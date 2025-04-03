const fs = require('fs');
const path = require('path');

const DATABASE_PATH = path.join(__dirname, '../data/database.json');

const noteMapping = {
    'g.n.b': '5.0 (g.n.b)',
    'n.b': '5.0 (n.b)',
    '4,0': '4.0',
    '3,7': '3.7',
    '3,3': '3.3',
    '3,0': '3.0',
    '2,7': '2.7',
    '2,3': '2.3',
    '2,0': '2.0',
    '1,7': '1.7',
    '1,3': '1.3',
    '1,0': '1.0',
};

const sortedNotes = ['5.0 (g.n.b)', '5.0 (n.b)', '4.0', '3.7', '3.3', '3.0', '2.7', '2.3', '2.0', '1.7', '1.3', '1.0'];

const getProcessedData = () => {
    try {
        if (!fs.existsSync(DATABASE_PATH)) {
            throw new Error('No data found in database.json');
        }

        const rawData = fs.readFileSync(DATABASE_PATH, 'utf8');
        const { students, weightingOfExercice, thresholds, moduleInfo } = JSON.parse(rawData);

        const noteCounts = sortedNotes.reduce((acc, note) => {
            acc[note] = 0;
            return acc;
        }, {});

        students.forEach(student => {
            let note = student.note;
            if (noteMapping[note]) {
                note = noteMapping[note];
            }
            if (noteCounts.hasOwnProperty(note)) {
                noteCounts[note] += 1;
            }
        });

        const labels = sortedNotes;
        const data = labels.map(label => noteCounts[label]);

        const successfulNotes = ['4.0', '3.7', '3.3', '3.0', '2.7', '2.3', '2.0', '1.7', '1.3', '1.0'];
        const totalStudents = students.length;
        const maxCount = Math.max(...data);
        const passedStudents = students.filter(s => s.note && successfulNotes.includes(s.note.replace(',', '.'))).length;

        const successRate = (passedStudents / totalStudents) * 100;
        const failureRate = 100 - successRate;

        const exerciseScores = {};

        students.forEach(student => {
            Object.entries(student.scores || {}).forEach(([exercise, score]) => {
                if (score !== null) {
                    if (!exerciseScores[exercise]) {
                        exerciseScores[exercise] = [];
                    }
                    exerciseScores[exercise].push(score);
                }
            });
        });

        const avgPercentages = Object.fromEntries(
            Object.entries(exerciseScores).map(([exercise, scores]) => [
                exercise, scores.reduce((sum, val) => sum + val, 0) / scores.length
            ])
        );

        return {
            students,
            weightingOfExercice,
            thresholds,
            moduleInfo,
            labels,
            data,
            totalStudents,
            maxCount,
            successRate,
            failureRate,
            avgPercentages,
            exerciseLabels: Object.keys(avgPercentages),
            exerciseData: Object.values(avgPercentages)
        };

    } catch (error) {
        console.error('Error reading database.json:', error);
        return null;
    }
};

module.exports = { getProcessedData, sortedNotes };
