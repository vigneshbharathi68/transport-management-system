// scripts/generateExcelTemplate.js
const ExcelJS = require('exceljs');
const fs = require('fs');

async function generateExcelTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Shipments');
    
    // Header row with styling
    const headerRow = worksheet.addRow([
        'Order No',
        'Group ID',
        'Source',
        'Destination',
        'Material ID',
        'Vehicle Type ID',
        'Weight (kg)',
        'Volume (m³)',
        'Quantity',
        'Status'
    ]);
    
    // Style header
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'center' };
    
    // Sample data rows
    const sampleData = [
        ['ORD-001', 'G1', 'Chennai', 'Mumbai', 1, 2, 1500.50, 25.75, 100, 'DRAFT'],
        ['ORD-002', 'G1', 'Mumbai', 'Delhi', 2, 1, 2500.00, 40.20, 200, 'SCHEDULED'],
        ['ORD-003', 'G2', 'Bangalore', 'Hyderabad', 3, 2, 1200.75, 18.50, 150, 'DRAFT'],
        ['ORD-004', 'G2', 'Delhi', 'Chennai', 1, 3, 3000.00, 55.00, 300, 'IN_TRANSIT'],
        ['ORD-005', 'G3', 'Pune', 'Mumbai', 2, 2, 800.25, 12.30, 80, 'DRAFT'],
    ];
    
    sampleData.forEach(data => {
        worksheet.addRow(data);
    });
    
    // Set column widths
    worksheet.columns = [
        { width: 15 }, // Order No
        { width: 12 }, // Group ID
        { width: 15 }, // Source
        { width: 15 }, // Destination
        { width: 15 }, // Material ID
        { width: 18 }, // Vehicle Type ID
        { width: 14 }, // Weight
        { width: 14 }, // Volume
        { width: 12 }, // Quantity
        { width: 12 }  // Status
    ];
    
    // Data validation for Status column
    worksheet.dataValidations.add('J2:J1000', {
        type: 'list',
        formula1: '"DRAFT,SCHEDULED,IN_TRANSIT,DELIVERED,CANCELLED"',
        showInputMessage: true,
        prompt: 'Select valid status'
    });
    
    // Save file
    const filePath = 'shipments_template.xlsx';
    await workbook.xlsx.writeFile(filePath);
    console.log(`✅ Template created: ${filePath}`);
}

generateExcelTemplate();
