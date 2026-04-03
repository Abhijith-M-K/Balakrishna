"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, ChevronDown, User, X } from "lucide-react";

interface Student {
    id: string;
    studentId: string;
    name: string;
    [key: string]: any;
}

interface StudentSearchSelectProps {
    students: Student[];
    name: string;
    label?: string;
    defaultValue?: string; // This would be the internal UUID (student.id)
    placeholder?: string;
    required?: boolean;
    onSelect?: (student: Student | null) => void;
}

export default function StudentSearchSelect({ 
    students, 
    name, 
    label = "Select Student", 
    defaultValue, 
    placeholder = "Type to search student name or ID...",
    required = false,
    onSelect
}: StudentSearchSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initializing state if defaultValue is provided
    useEffect(() => {
        if (defaultValue) {
            const student = students.find(s => s.id === defaultValue);
            if (student) {
                setSelectedStudent(student);
                setSearchTerm(`${student.name} (${student.studentId})`);
            }
        }
    }, [defaultValue, students]);

    // Derived: filter students based on search term (only when open)
    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        
        const term = searchTerm.toLowerCase();
        // If the search term exactly matches the selected student, show all unless you want to filter out.
        // Actually, let's always filter.
        return students.filter(s => 
            s.name.toLowerCase().includes(term) || 
            s.studentId.toLowerCase().includes(term)
        );
    }, [searchTerm, students]);

    // Handle selection
    const handleSelect = (student: Student) => {
        setSelectedStudent(student);
        setSearchTerm(`${student.name} (${student.studentId})`);
        setIsOpen(false);
        if (onSelect) onSelect(student);
    };

    // Handle clearing the selection
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedStudent(null);
        setSearchTerm("");
        setIsOpen(true);
        inputRef.current?.focus();
        if (onSelect) onSelect(null);
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // If nothing selected and term doesn't match precisely, clear it? 
                // Or just keep the term. Let's keep the term but logic in form usually checks studentId.
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex(prev => (prev < filteredStudents.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredStudents.length) {
                    handleSelect(filteredStudents[highlightedIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    // Reset highlight on filter change
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [filteredStudents]);

    return (
        <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", position: "relative" }}>
            {label && (
                <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                    {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
                </label>
            )}
            
            <div 
                style={{ 
                    position: "relative",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Search 
                    size={18} 
                    style={{ 
                        position: "absolute", 
                        left: "1rem", 
                        color: isOpen ? "var(--accent-primary)" : "var(--text-muted)", 
                        transition: "color 0.2s" 
                    }} 
                />
                <input 
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                        if (selectedStudent && e.target.value !== `${selectedStudent.name} (${selectedStudent.studentId})`) {
                            setSelectedStudent(null);
                            if (onSelect) onSelect(null);
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    required={required}
                    style={{ 
                        padding: "0.75rem 2.8rem", 
                        background: "var(--bg-tertiary)", 
                        border: `1px solid ${isOpen ? "var(--accent-primary)" : "var(--border-color)"}`, 
                        borderRadius: "var(--radius-md)", 
                        color: "var(--text-primary)", 
                        outline: "none",
                        width: "100%",
                        boxShadow: isOpen ? "0 0 0 3px rgba(59, 130, 246, 0.15)" : "none",
                        transition: "all 0.2s ease"
                    }}
                />
                
                <div style={{ position: "absolute", right: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {searchTerm && (
                        <button 
                            type="button" 
                            onClick={handleClear}
                            style={{ background: "none", border: "none", padding: 0, color: "var(--text-muted)", cursor: "pointer", display: "flex" }}
                        >
                            <X size={16} />
                        </button>
                    )}
                    <ChevronDown 
                        size={18} 
                        style={{ 
                            color: "var(--text-muted)", 
                            transform: isOpen ? "rotate(180deg)" : "rotate(0)", 
                            transition: "transform 0.3s ease" 
                        }} 
                    />
                </div>
            </div>

            {/* Hidden Input for Form Submission */}
            <input type="hidden" name={name} value={selectedStudent?.id || ""} required={required} />

            {/* Custom Dropdown List */}
            {isOpen && (
                <div 
                    className="glass-card" 
                    style={{ 
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "0.5rem",
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "0.5rem",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
                        border: "1px solid var(--border-color)",
                        animation: "dropdownFadeIn 0.2s ease-out"
                    }}
                >
                    <style>{`
                        @keyframes dropdownFadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .student-option:hover {
                            background: rgba(59, 130, 246, 0.1);
                        }
                        .student-option.highlighted {
                            background: rgba(59, 130, 246, 0.15) !important;
                            border-color: var(--accent-primary) !important;
                        }
                    `}</style>
                    
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((s, index) => (
                            <div 
                                key={s.id}
                                className={`student-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                                onClick={() => handleSelect(s)}
                                style={{
                                    padding: "0.75rem 1rem",
                                    borderRadius: "var(--radius-sm)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    transition: "background 0.15s",
                                    marginBottom: "2px",
                                    border: "1px solid transparent"
                                }}
                            >
                                <div style={{ 
                                    width: "32px", 
                                    height: "32px", 
                                    borderRadius: "50%", 
                                    background: selectedStudent?.id === s.id ? "var(--accent-primary)" : "var(--bg-secondary)", 
                                    color: selectedStudent?.id === s.id ? "#fff" : "var(--text-muted)",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    fontSize: "0.75rem"
                                }}>
                                    <User size={14} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{s.name}</span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ID: {s.studentId}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            No students match your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
