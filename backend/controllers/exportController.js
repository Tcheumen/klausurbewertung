const fs = require('fs');
const { generateExcelFile } = require('../services/excelService');
const { generatePDFReport } = require('../services/pdfService');
const { exportCSV } = require('../services/csvService');

const generateCSV = (req, res) => {
    try {
        const csvContent = exportCSV();
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.attachment('exam_data.csv');
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting CSV file', error });
    }
};

const generateExcel = (req, res) => {
    try {
        const filePath = generateExcelFile();
        res.download(filePath, 'Bewertungsdaten.xlsx', () => {});
    } catch (error) {
        res.status(500).json({ message: 'Error generating the Excel file', error: error.message });
    }
};

const generatePDF = async (req, res) => {
    try {
        const pdfPath = await generatePDFReport(); 
        res.download(pdfPath, 'Pruefungsbewertungsbericht.pdf', (err) => {
            if (err) {
                console.error('Error during download:', err);
                res.status(500).json({ message: 'Error during download' });
            }
        });
    } catch (error) {
        console.error('Error during generating the PDF file:', error);
        res.status(500).json({ message: 'Error during generating the PDF file:', error: error.message });
    }
};


module.exports = {
    generateCSV,
    generateExcel,
    generatePDF
};
