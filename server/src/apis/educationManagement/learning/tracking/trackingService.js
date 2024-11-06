const ncdb = require('../../../databases/ncdbService');

const tryCreateTracking = async (aid, role, enrollment_id, collection_id) => {
    try {
        const result = await ncdb.query(role,
            'EXECUTE CreateTracking @aid, @enrollment_id, @collection_id',
            { aid, enrollment_id, collection_id }
        );

        if (!result || result.length < 1)
            throw new Error('Cannot get result');

        return result[0].check;
    } catch (err) {
        throw new Error(`trackingService.js/tryCreateTracking | ${err.message}`);
    }
};

const tryReadTracking = async (aid, role, enrollment_id) => {
    try {
        const result = await ncdb.query(role,
            'EXECUTE ReadTracking @aid, @enrollment_id',
            { aid, enrollment_id }
        );

        return result;
    } catch (err) {
        throw new Error(`trackingService.js/tryReadTracking | ${err.message}`);
    }
};

module.exports = { tryCreateTracking, tryReadTracking }