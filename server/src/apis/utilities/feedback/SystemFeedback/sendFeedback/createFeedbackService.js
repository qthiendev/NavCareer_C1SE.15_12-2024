const ncbd = require('../../../../databases/ncdbService'); // Database connection module

const tryCreateFeedback = async (role, aid, description) => {
    try {
        console.log(`[${new Date().toLocaleString()}] Executing createFeedback procedure with aid: ${aid}, description: "${description}"`);

        // Correct the query string with proper parameter names
        const result = await ncbd.query(
            role,
            `EXECUTE createFeedback @aid, @description`,
            {aid,description }
        );

        console.log(`[${new Date().toLocaleString()}] createFeedback procedure executed successfully.`);
        return result; // Return the result if needed
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Error executing createFeedback: ${err.message}`);
        throw new Error(`createFeedbackService.js/tryCreateFeedback | ${err.message}`);
    }
};

module.exports = { tryCreateFeedback };
