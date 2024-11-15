const ncbd = require('../../databases/ncdbService');
const tryCreateFeedback = async (aid, feedback_decrition) => {
    try {
        const result = await ncbd.query(
            `EXECUTE createFeedback @aid, @feedback_decrition`, 
            {aid, feedback_decrition});

        return result[0].check;

    } catch (err) {
        throw new Error(`createFeedbackService.js/tryCreateFeedback | ${err.message}`);
    }
};

module.exports = {tryCreateFeedback};