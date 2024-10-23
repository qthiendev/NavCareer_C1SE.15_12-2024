const ncdb = require('../../../databases/ncdbService');

const tryGetFrame = async (aid, role, course_id) => {
    try {
        const collections = await ncdb.query(role,
            'EXECUTE ReadFrame @course_id',
            {course_id}
        );

        return collections;
    } catch (err) {
        throw new Error(`getLearnService.js/tryGetFrame | ${err.message}`);
    }
};

const tryGetCollection = async (aid, role, course_id, module_ordinal, collection_ordinal) => {
    try {
        const collections = await ncdb.query(role,
            'EXECUTE ReadCollection @course_id, @module_ordinal, @collection_ordinal',
            {course_id, module_ordinal, collection_ordinal}
        );

        return collections;
    } catch (err) {
        throw new Error(`getLearnService.js/tryGetCollection | ${err.message}`);
    }
};

module.exports = { tryGetFrame, tryGetCollection };