"use client";

import { FileSpreadsheet } from "lucide-react";

interface ExcelButtonProps {
    data: any[];
    title: string;
    columns: string[];
}

export default function ExcelButton({ data, title, columns }: ExcelButtonProps) {
    const exportToExcel = () => {
        if (!data || data.length === 0) return;

        // SpreadSheetML XML approach for genuine Excel recognition
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="sHeader">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#5B4BDF" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="sCell">
   <Alignment ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Report">
  <Table>
   <Row ss:Height="25">`;

        // Add Headers
        columns.forEach(col => {
            xml += `<Cell ss:StyleID="sHeader"><Data ss:Type="String">${col.toUpperCase()}</Data></Cell>`;
        });
        xml += `</Row>`;

        // Add Data Rows
        data.forEach(row => {
            xml += `<Row ss:Height="20">`;
            columns.forEach(col => {
                const value = row[col] === undefined || row[col] === null ? "" : row[col];
                const type = typeof value === 'number' ? 'Number' : 'String';
                xml += `<Cell ss:StyleID="sCell"><Data ss:Type="${type}">${value}</Data></Cell>`;
            });
            xml += `</Row>`;
        });

        xml += `  </Table>
 </Worksheet>
</Workbook>`;

        const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button 
            onClick={exportToExcel}
            className="btn btn-secondary" 
            style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                background: "rgba(16, 185, 129, 0.1)", 
                color: "#059669", 
                border: "1px solid rgba(16, 185, 129, 0.2)",
                fontWeight: 600,
                padding: "0.6rem 1.2rem",
                borderRadius: "8px"
            }}
            disabled={!data || data.length === 0}
        >
            <FileSpreadsheet size={18} /> Excel Export
        </button>
    );
}
