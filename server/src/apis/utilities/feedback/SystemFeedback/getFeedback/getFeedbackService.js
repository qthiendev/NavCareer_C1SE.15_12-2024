const ncbd = require('../../../../databases/ncdbService');
const tryReadFeedback = async (role) => {
    try {
        if (!role)
            throw new Error(`'role' is empty`);

        console.log(`[${new Date().toLocaleString()}] Executing readfeedback query`);
        const result = await ncbd.query(role, `EXECUTE readfeedback`);
        return result; 
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] Query error: ${err.message}`);
        throw new Error(`readFeedbackService.js/tryReadFeedback | ${err.message}`);
    }
};

module.exports = { tryReadFeedback };
