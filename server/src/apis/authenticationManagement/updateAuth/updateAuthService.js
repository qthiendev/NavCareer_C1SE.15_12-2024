const ncdb = require('../../databases/ncdbService');

const tryUpdateAuth = async (
    role,
    aid,
    newAccount,
    currentPassword,
    newPassword,
    newIdentifierEmail,
    newAuthorizationId
) => {
    try {
        // update new authentication data
        const results = await ncdb.query(role,
            `EXECUTE UpdateAuth @aid, @new_account, @current_password, @new_password, @new_identifier_email, @new_authorization_id`,
            {
                aid: aid,
                new_account: newAccount,
                current_password: currentPassword,
                new_password: newPassword,
                new_identifier_email: newIdentifierEmail,
                new_authorization_id: newAuthorizationId
            });

        // Ensure checkResult is valid and contains the expected structure
        return results && results.length > 0;

    } catch (err) {
        throw new Error(`editAuthService.js/tryEditAuth | ${err.message}`);
    }
};

module.exports = { tryUpdateAuth };
