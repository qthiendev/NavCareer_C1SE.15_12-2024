const ncdb = require('../../../databases/ncdbService');

const tryEnroll = async (aid, role, course_id, apptransid) => {
    try {
        const data = await ncdb.query(role, 'EXECUTE CreateEnrollment @aid, @course_id', { aid, course_id });

        if (!data) throw new Error('Query failed');

        if (data[0].check === 'SUCCESSED') {
            const secondData = await ncdb.query(role, 
                'EXECUTE UpdatePayment @aid , @payment_transaction_id', 
                { aid, payment_transaction_id: apptransid }
            );

            return secondData[0].check;
        }

        return data[0].check;

    } catch (err) {
        throw new Error(`enrollService.js/tryEnroll | ${err.message}`);
    }
}

module.exports = { tryEnroll };