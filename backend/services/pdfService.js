const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const generatePDFFile = (students, exam) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../exports/Report.pdf');

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Report of examination', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Exam : ${exam.title}`);
    doc.text(`Date : ${exam.date}`);
    doc.moveDown();
    doc.text('Student results :');
    students.forEach((student, i) => {
        doc.text(`${i + 1}. ${student.name} - Total : ${student.total}`);
    });
    doc.end();

    return filePath;
};

module.exports = {
    generatePDFFile
};