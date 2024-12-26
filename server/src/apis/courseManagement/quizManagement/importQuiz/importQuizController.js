const { tryImportQuiz } = require('./importQuizService');
const now = () => new Date().toLocaleString();

const importQuiz = async (req, res) => {
    try {
        const { course_id, collection_id, questions } = req.body;
        const { aid, role } = req.session;

        console.log(req.body);

        if (!collection_id || Number.isNaN(collection_id)) {
            console.error(`[${now()}] importQuizController.js/importQuiz | 'collection_id' is required.`);
            return res.status(400).json({
                message: `'collection_id' is required.`,
                time: now(),
            });
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            console.error(`[${now()}] importQuizController.js/importQuiz | 'questions' array is required.`);
            return res.status(400).json({
                message: `'questions' array is required.`,
                time: now(),
            });
        }

        const result = await tryImportQuiz(aid, role, course_id, collection_id, questions);

        if (result.success) {
            console.log(`[${now()}] importQuizController.js/importQuiz | Quiz imported successfully.`);
            return res.status(200).json({
                message: `Quiz imported successfully.`,
                time: now(),
                data: result,
            });
        }

        console.error(`[${now()}] importQuizController.js/importQuiz | Quiz import failed.`);
        return res.status(500).json({
            message: `Quiz import failed.`,
            time: now(),
        });
    } catch (err) {
        console.error(`[${now()}] importQuizController.js/importQuiz | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now(),
        });
    }
};

module.exports = { importQuiz };
