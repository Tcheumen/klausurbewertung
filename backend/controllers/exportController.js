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
        res.status(500).json({ message: 'Erreur lors de l’exportation du fichier CSV', error });
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
        const pdfPath = await generatePDFReport(); // Attendre la résolution de la promesse
        res.download(pdfPath, 'Pruefungsbewertungsbericht.pdf', (err) => {
            if (err) {
                console.error('Erreur lors du téléchargement:', err);
                res.status(500).json({ message: 'Erreur lors du téléchargement du fichier PDF' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la génération du fichier PDF:', error);
        res.status(500).json({ message: 'Erreur lors de la génération du fichier PDF', error: error.message });
    }
};


module.exports = {
    generateCSV,
    generateExcel,
    generatePDF
};
