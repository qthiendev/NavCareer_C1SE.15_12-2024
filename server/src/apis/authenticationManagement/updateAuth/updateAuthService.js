const ncdb = require('../../databases/ncdbService');

const tryUpdateAuth = async (
    role,
    aid,
    newAccount,
    currentPassword,
    newPassword,
    newIdentifierEmail
) => {
    try {
        const updateAuth = await ncdb.query(role,
            `EXECUTE UpdateAuth @aid, @new_account, @current_password, @new_password, @new_identifier_email`,
            {
                aid: aid,
                new_account: newAccount,
                current_password: currentPassword,
                new_password: newPassword,
                new_identifier_email: newIdentifierEmail
            });

        // Ensure checkResult is valid and contains the expected structure
        return updateAuth[0].check;

    } catch (err) {
        throw new Error(`editAuthService.js/tryEditAuth | ${err.message}`);
    }
};

module.exports = { tryUpdateAuth };
