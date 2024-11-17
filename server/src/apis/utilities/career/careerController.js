const { tryPredict, trySaveResponse, tryGetAvailableCareer } = require('./careerService');
const now = new Date();


const predict = async (req, res) => {
    try {
        const { data } = req.query;

        if (!data) 
            throw new Error(`'data' is required`);

        console.log('\x1b[34m%s\x1b[0m', `[${now.toLocaleString()}] at careerController.js/predict | Job predicting with: ${data}.`);

        const dataString = data.replace(/[{}]/g, '');
        const dataArray = dataString.split(',').map(Number);

        if (dataArray.length !== 30) {
            throw new Error("Exactly 30 responses are required");
        }

        const prediction = await tryPredict(dataArray);

        if (!prediction) throw new Error('Cannot get prediction');

        console.log(`[${now.toLocaleString()}] at careerController.js/predict | Job predict: ${prediction}.`);
        return res.status(200).json({ predicted_code: prediction, time: now.toLocaleString() });
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at careerController.js/predict | ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

const saveResponse = async (req, res) => {
    try {
        const { data, job_name: jobName } = req.query;

        if (!data || !jobName) throw new Error(`'data' and 'job_name' are required`);

        const dataString = data.replace(/[{}]/g, '');
        const dataArray = dataString.split(',').map(Number);

        if (dataArray.length !== 30) {
            return res.status(400).json({ error: "Exactly 30 responses are required" });
        }

        console.log('\x1b[34m%s\x1b[0m', `[${now.toLocaleString()}] at careerController.js/saveResponse | Saving: ${dataArray} -> ${jobName}.`);

        const saveResult = await trySaveResponse(dataArray, jobName);

        if (!saveResult) throw new Error('Failed to save response');

        console.log(`[${now.toLocaleString()}] at careerController.js/saveResponse | Response saved: ${saveResult}.`);
        return res.status(200).json({ message: saveResult, time: now.toLocaleString() });
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at careerController.js/saveResponse | ${err.message}`);
        res.status(500).json({
            message: 'Server Error',
            time: now.toLocaleString()
        });
    }
};

const getAvailableCareer = async (req, res) => {
    try {
        const careers = await tryGetAvailableCareer();
        res.status(200).json(careers);
    } catch (error) {
        console.error('Error fetching available careers:', error);
        res.status(500).json({ error: 'Failed to load available careers.' });
    }
};

module.exports = { predict, saveResponse, getAvailableCareer };
