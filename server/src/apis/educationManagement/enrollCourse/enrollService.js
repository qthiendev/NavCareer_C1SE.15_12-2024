const ncdb = require('../../databases/ncdbService');

const tryEnroll = async (aid, role, course_id) => {
    try {
        const data = await ncdb.query(role, 'EXECUTE CreateEnrollment @aid, @course_id', { aid, course_id });

        if (!data) throw new Error('Query failed');

        console.log(data)

        return data[0].check;

    } catch (err) {
        throw new Error(`enrollService.js/tryEnroll | ${err.message}`);
    }
}

module.exports = { tryEnroll };