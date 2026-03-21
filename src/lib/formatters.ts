export function formatDate(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return "N/A";
    
    // Attempt parse
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "N/A";

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
}
