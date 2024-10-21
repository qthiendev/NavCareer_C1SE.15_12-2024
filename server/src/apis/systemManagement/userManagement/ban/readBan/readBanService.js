const ncdb = require('../../../../databases/ncdbService');

const tryReadBan = async (role) => {
    try {
        const data = await ncdb.query(role, `execute ReadAllProcedureBanned`, {});
        return data;
    } catch (err) {
        throw new Error(`readBanService.js/tryReadBan | ${err.message}`);
    }
};

const tryReadBanESP = async (role) => {
    try {
        const data = await ncdb.query(role, `execute ReadAllProcedureBannedESP`, {});
        return data;
    } catch (err) {
        throw new Error(`readBanService.js/tryReadBan | ${err.message}`);
    }
};


module.exports = { tryReadBan, tryReadBanESP };