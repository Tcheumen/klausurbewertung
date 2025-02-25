const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

const generateExcelFile = () => {
    if (!fs.existsSync(DATABASE_PATH)) {
        throw new Error('No data saved found in database.json');
    }

    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const { students, weightingOfExercice, thresholds, moduleInfo } = JSON.parse(rawData);

    const workbook = xlsx.utils.book_new();

    const studentData = students.map((student) => ({
        Mtknr: student.mtknr,
        Nachname: student.nachname,
        Vorname: student.vorname,
        ...student.scores,
        Total: student.total || String('ne').padStart(21, ' '),
        Bewertung: student.bewertung || String('ne').padStart(21, ' '),
    }));

    const studentWorksheet = xlsx.utils.json_to_sheet(studentData);
    xlsx.utils.book_append_sheet(workbook, studentWorksheet, 'Students');

    const exerciseData = Object.entries(weightingOfExercice || {}).map(([exercise, weight]) => ({
        Aufgaben: exercise,
        Anzahl_Punktzahl: weight ,
    }));

    const exerciseWorksheet = xlsx.utils.json_to_sheet(exerciseData);
    xlsx.utils.book_append_sheet(workbook, exerciseWorksheet, 'Aufgaben');

    const thresholdData = thresholds.map((threshold) => ({
        Punkte: threshold.points,
        Prozentsatz: `${threshold.percentage}%`,
        Note: threshold.note,
    }));

    const thresholdWorksheet = xlsx.utils.json_to_sheet(thresholdData);
    xlsx.utils.book_append_sheet(workbook, thresholdWorksheet, 'Grenzwerte');

const moduleInfoData = [
    { "Module Eigenschaft": "Module Title", "Module Information": moduleInfo.moduleTitle },
    { "Module Eigenschaft": "Module Number", "Module Information": moduleInfo.moduleNumber },
    { "Module Eigenschaft": "Prüfungsdatum", "Module Information": moduleInfo.examDate },
    { "Module Eigenschaft": "Prüfer", "Module Information": moduleInfo.examiners.join(', ') },
    { "Module Eigenschaft": "Exportdatum", "Module Information": new Date().toLocaleDateString() }
];


    const moduleInfoWorksheet = xlsx.utils.json_to_sheet(moduleInfoData);

    // Ajustement automatique de la largeur des colonnes
moduleInfoWorksheet['!cols'] = [
    { wch: 20 }, // Largeur pour "Attribut"
    { wch: 30 }  // Largeur pour "Valeur"
];


    xlsx.utils.book_append_sheet(workbook, moduleInfoWorksheet, 'Module Info');

    const filePath = path.join(__dirname, '../exports/Bewertungsdaten.xlsx');
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    xlsx.writeFile(workbook, filePath);
    return filePath;
};

module.exports = {
    generateExcelFile,
};
