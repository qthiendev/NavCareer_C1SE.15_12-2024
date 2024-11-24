const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const predictPythonPath = path.resolve(__dirname, '../../../../../nav_model/nodejs_predict.py');
const savePythonPath = path.resolve(__dirname, '../../../../../nav_model/nodejs_predict_save.py');

const tryPredict = (data) => {
    return new Promise((resolve, reject) => {
        const python = spawn('python', [predictPythonPath, JSON.stringify(data)]);

        let result = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`careerService.js/tryPredict | ${code}: ${errorOutput}`));
            } else {
                resolve(result.trim());
            }
        });
    });
};

const trySaveResponse = async (responses, jobName) => {
    return new Promise((resolve, reject) => {
        const python = spawn('python', [savePythonPath, JSON.stringify(responses), jobName]);

        let result = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`careerService.js/trySaveResponse | ${code}: ${errorOutput}`));
            } else {
                resolve(result.trim());
            }
        });
    });
};

const tryGetAvailableCareer = async () => {
    const version = 'v1.3';
    const filePath = path.join(__dirname, `../../../../../nav_model/data/${version}/careers.csv`);
    const careers = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row['Career Name']) {
                    careers.push(row['Career Name (Vietnamese)'].trim());
                }
            })
            .on('end', () => {
                resolve(careers);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = { tryPredict, trySaveResponse, tryGetAvailableCareer };
