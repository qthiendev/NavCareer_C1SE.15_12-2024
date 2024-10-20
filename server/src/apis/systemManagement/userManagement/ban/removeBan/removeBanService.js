const ncdb = require('../../../../databases/ncdbService');

const tryRemoveBan = async (role, authentication_id, procedure_name) => {
    try {
        const data = await ncdb.query(role, 
            `execute RemoveBanned @authentication_id, @procedure_name`, 
            { authentication_id, procedure_name });
        return data[0].check;
    } catch (err) {
        throw new Error(`readBanService.js/tryRemoveBan | ${err.message}`);
    }
};

module.exports = { tryRemoveBan };
