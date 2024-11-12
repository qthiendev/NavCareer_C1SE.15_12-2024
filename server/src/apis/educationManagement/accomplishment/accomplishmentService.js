const ncdb = require('../../databases/ncdbService');

const tryCheckAccomplishment = async (aid, role, enrollment_id) => {
    try {
        const results = await ncdb.query(role,
            'EXECUTE CheckAccomplishment @aid, @enrollment_id',
            { aid, enrollment_id }
        );

        if (!results)
            throw new Error('Cannot get results');

        return results[0].check;
    } catch (err) {
        throw new Error(`accomplishmentService.js/tryCheckAccomplishment | ${err.message}`);
    }
}

const tryGetAccomplishment = async (role, enrollment_id, certificate_id) => {
    try {
        let results = null;

        if (certificate_id) {
            results = await ncdb.query(role,
                'EXECUTE ReadAccomplishment @certificate_id',
                { certificate_id }
            );
        } else if (enrollment_id !== null && enrollment_id !== undefined) {
            results = await ncdb.query(role,
                'EXECUTE ReadAccomplishmentByEnrollment @enrollment_id',
                { enrollment_id }
            );
        }

        if (!results)
            throw new Error('Cannot get results');

        return results;
    } catch (err) {
        throw new Error(`accomplishmentService.js/tryGetAccomplishment | ${err.message}`);
    }
}

module.exports = { tryCheckAccomplishment, tryGetAccomplishment };