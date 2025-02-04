const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

const generateExcelFile = () => {
    // Vérification des fichiers requis
    if (!fs.existsSync(DATABASE_PATH)) {
        throw new Error('No data saved found in database.json');
    }

    // Chargement des données JSON
    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const { students, weightingOfExercice, thresholds } = JSON.parse(rawData);

    // Création d'un nouveau classeur Excel
    const workbook = xlsx.utils.book_new();

    // Feuille 1 : Données des étudiants (Ajout de la colonne "Bewertung")
    const studentData = students.map((student) => ({
        Mtknr: student.mtknr,
        Nachname: student.nachname,
        Vorname: student.vorname,
        ...student.scores, // Ajout des scores des exercices
        Total: student.total || 'ne',
        Bewertung: student.bewertung || '', // Ajout de la colonne "Bewertung"
    }));

    const studentWorksheet = xlsx.utils.json_to_sheet(studentData);
    xlsx.utils.book_append_sheet(workbook, studentWorksheet, 'Students');

    // Feuille 2 : Table des exercices avec pondérations (Correction en utilisant "weightingOfExercice")
    const exerciseData = Object.entries(weightingOfExercice || {}).map(([exercise, weight]) => ({
        Aufgaben: exercise,
        Gewicht: weight || 'N/A', // Utilise la pondération si disponible
    }));

    const exerciseWorksheet = xlsx.utils.json_to_sheet(exerciseData);
    xlsx.utils.book_append_sheet(workbook, exerciseWorksheet, 'Exercises');

    // Feuille 3 : Table des seuils
    const thresholdData = thresholds.map((threshold) => ({
        Punkte: threshold.points,
        Prozentsatz: `${threshold.percentage}%`,
        Note: threshold.note,
    }));

    const thresholdWorksheet = xlsx.utils.json_to_sheet(thresholdData);
    xlsx.utils.book_append_sheet(workbook, thresholdWorksheet, 'Thresholds');

    // Sauvegarde du fichier Excel
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
