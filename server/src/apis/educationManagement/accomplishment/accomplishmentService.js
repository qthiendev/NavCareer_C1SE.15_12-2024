const ncdb = require('../../databases/ncdbService');

const tryCheckAccomplishment = async (aid, role, enrollment_id) => {
    try {
        const results = await ncdb.query(role, 
            'EXECUTE CheckAccomplishment @aid, @enrollment_id', 
            {aid, enrollment_id}
        );

        return results[0].check;
    } catch (err) {
        throw new Error(`accomplishmentService.js/tryCheckAccomplishment | ${err.message}`);
    }
}

module.exports = { tryCheckAccomplishment };