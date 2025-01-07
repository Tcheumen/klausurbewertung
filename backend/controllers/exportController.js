
const fs = require('fs');
const { generateExcelFile } = require('../services/excelService');
const { generatePDFFile } = require('../services/pdfService');


const generateExcel = (req, res) => {
    const { students, exam } = req.body;

    const filePath = generateExcelFile(students, exam);
    res.download(filePath, 'Bewertungsdaten.xlsx', () => {
        //fs.unlinkSync(filePath);
    });
};

const generatePDF = (req, res) => {
    const { students, exam } = req.body;

    const filePath = generatePDFFile(students, exam);
    res.download(filePath, 'Report.pdf', () => {
       // fs.unlinkSync(filePath);
    });
};

module.exports = {
    generateExcel,
    generatePDF
}