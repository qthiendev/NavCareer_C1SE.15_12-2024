const { spawn } = require('child_process');
const path = require('path');

const predictPythonPath = path.resolve(__dirname, '../../../../../_career/nodejs_predict.py');
const savePythonPath = path.resolve(__dirname, '../../../../../_career/nodejs_predict_save.py');

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

const trySaveResponse = (responses, jobName) => {
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

module.exports = { tryPredict, trySaveResponse };
