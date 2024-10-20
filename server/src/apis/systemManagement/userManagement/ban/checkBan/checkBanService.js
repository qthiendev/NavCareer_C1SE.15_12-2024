const ncdb = require('../../../../databases/ncdbService');

const tryCheckBan = async (aid, role, procedure_name) => {
    try {
        const data = await ncdb.query(role, `execute CheckBanned @aid, @procedure_name`, {aid, procedure_name});
        return data[0].check;
    } catch (err) {
        throw new Error(`checkBanService.js/tryCheckBan | ${err.message}`);
    }
};

module.exports = { tryCheckBan };