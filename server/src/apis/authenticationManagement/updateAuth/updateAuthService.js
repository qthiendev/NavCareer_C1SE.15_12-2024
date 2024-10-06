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
        await ncdb.query(role,
            `EXECUTE UpdateAuth @aid, @new_account, @current_password, @new_password, @new_identifier_email, @new_authorization_id`,
            {
                aid: aid,
                new_account: newAccount,
                current_password: currentPassword,
                new_password: newPassword,
                new_identifier_email: newIdentifierEmail,
                new_authorization_id: newAuthorizationId
            });

        // Verify
        const checkResult = await ncdb.query(role,
            `EXECUTE CheckAuth @aid, @account, @password`,
            { aid: aid, account: newAccount, password: newPassword });

        console.log(checkResult)

        // Ensure checkResult is valid and contains the expected structure
        return checkResult && checkResult.length > 0;

    } catch (err) {
        throw new Error(`editAuthService.js/tryEditAuth | ${err.message}`);
    }
};

module.exports = { tryUpdateAuth };
