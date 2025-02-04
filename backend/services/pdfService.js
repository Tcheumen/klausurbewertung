const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');
const EXPORT_PATH = path.join(__dirname, '../exports/Rapport_Evaluation_Examens.pdf');
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400;
const PAGE_HEIGHT = 750;
const MARGIN_TOP = 50;
const ROW_HEIGHT = 25;

const generateChart = async (data, type, title) => {
    const chartCanvas = new ChartJSNodeCanvas({ width: CHART_WIDTH, height: CHART_HEIGHT });
    const config = {
        type,
        data,
        options: {
            plugins: { title: { display: true, text: title } },
        },
    };
    return await chartCanvas.renderToBuffer(config);
};

const drawTable = (doc, headers, rows, startX, startY) => {
    const columnWidths = headers.map(() => 120);
    let y = startY;

    const addNewPageIfNeeded = () => {
        if (y + ROW_HEIGHT > PAGE_HEIGHT) {
            doc.addPage();
            y = MARGIN_TOP;
        }
    };

    doc.font('Helvetica-Bold');
    headers.forEach((header, i) => {
        addNewPageIfNeeded();
        doc.rect(startX + (i * columnWidths[i]), y, columnWidths[i], ROW_HEIGHT).stroke();
        doc.text(header, startX + (i * columnWidths[i]) + 5, y + 5, { width: columnWidths[i] - 10, align: 'center' });
    });
    y += ROW_HEIGHT;
    doc.font('Helvetica');

    rows.forEach(row => {
        addNewPageIfNeeded();
        row.forEach((cell, i) => {
            doc.rect(startX + (i * columnWidths[i]), y, columnWidths[i], ROW_HEIGHT).stroke();
            doc.text(String(cell), startX + (i * columnWidths[i]) + 5, y + 5, { width: columnWidths[i] - 10, align: 'center' });
        });
        y += ROW_HEIGHT;
    });
    doc.moveDown(1);
};

const generatePDFReport = async () => {
    if (!fs.existsSync(DATABASE_PATH)) {
        throw new Error('No data found in database.json');
    }

    const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
    const { students, weightingOfExercice, thresholds } = JSON.parse(rawData);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(EXPORT_PATH);
    doc.pipe(stream);

    doc.fontSize(16).text("Rapport d'Évaluation des Examens", { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12).text("1. Configuration", { underline: true });
    doc.moveDown(1);
    drawTable(doc, ['Points', 'Pourcentage', 'Note'], thresholds.map(t => [t.points, `${t.percentage}%`, t.note]), 50, doc.y);

    doc.moveDown(1);
    drawTable(doc, ['Exercice', 'Pondération'], Object.entries(weightingOfExercice).map(([ex, wt]) => [ex, wt]), 50, doc.y);

    doc.moveDown(2);
    doc.fontSize(12).text("2. Données des Participants", { underline: true });
    doc.moveDown(1);
    drawTable(doc, ['Nom', 'Matricule', 'Total Points', 'Bewertung'], students.map(s => [s.vorname + ' ' + s.nachname, s.mtknr, s.total || 'N/A', s.bewertung || 'N/A']), 50, doc.y);

    doc.addPage();
    doc.fontSize(12).text("3. Analyse Graphique", { underline: true });
    doc.moveDown(1);

    const noteCategoriesData = {
        labels: thresholds.map(t => t.note),
        datasets: [{
            label: 'Nombre de notes par catégorie',
            data: thresholds.map(t => students.filter(s => s.bewertung === t.note).length),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
    };
    const noteCategoriesChart = await generateChart(noteCategoriesData, 'bar', 'Répartition des Notes');
    doc.image(noteCategoriesChart, { width: 400, align: 'center' });
    doc.moveDown(2);

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => {
            console.log("Fichier PDF généré avec succès !");
            resolve(EXPORT_PATH);
        });

        stream.on('error', (err) => {
            console.error("Erreur lors de la génération du fichier PDF :", err);
            reject(err);
        });
    });
};

module.exports = { generatePDFReport };
