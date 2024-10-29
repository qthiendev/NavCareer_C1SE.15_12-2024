const ncdb = require('../../../databases/ncdbService');

const tryReadEnrollment = async (aid, role) => {
    try {
        const data = await ncdb.query(role, 'EXECUTE ReadEnrollment @aid', { aid });
        if (!data) throw new Error('Query failed');
        
        return data;

    } catch (err) {
        throw new Error(`readEnrollmentService.js/tryReadEnrollment | ${err.message}`);
    }
}

module.exports = { tryReadEnrollment };