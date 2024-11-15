const ncbd = require('../../databases/ncdbService');
const tryReadFeedback = async (role) => {
    try {
        const result = await ncbd.query(
            `EXECUTE readfeedback`);

        return result[0].check;

    } catch (err) {
        throw new Error(`readFeedbackService.js/tryreadFeedback | ${err.message}`);
    }
};

module.exports = {tryReadFeedback};