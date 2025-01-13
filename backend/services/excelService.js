const xlsx = require('xlsx');
const path = require('path');


const generateExcelFile = (students, exam) => {

    const workbook = xlsx.utils.book_new();

    // Créer une feuille pour les étudiants

    const worksheetData = students.map((student) => ({
        Mtknr: student.mtknr,
        Name: student.name,
        FirstName: student.firstName,
        ...student.scores,
        Total: student.total,
    }));

    const worksheet = xlsx.utils.json_to_sheet(worksheetData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Sauvegarder le fichier
    const filePath = path.join(__dirname, '../exports/Bewertungsdaten.xlsx');
    
    xlsx.writeFile(workbook, filePath);
    return filePath;
};

module.exports = {
    generateExcelFile
};
