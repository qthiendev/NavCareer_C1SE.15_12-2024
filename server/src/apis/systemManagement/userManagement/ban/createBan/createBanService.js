const ncdb = require('../../../../databases/ncdbService');

const tryCreateBan = async (role, authentication_id, procedure_name) => {
    try {
        const data = await ncdb.query(role,
            `EXECUTE CreateBanned @authentication_id, @procedure_name`,
            { authentication_id, procedure_name });

        return data[0].check;
    } catch (err) {
        throw new Error(`createBanService.js/tryCreateBan | ${err.message}`);
    }
};

module.exports = { tryCreateBan };
