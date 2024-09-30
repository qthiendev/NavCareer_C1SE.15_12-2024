const ncdb = require('../../databases/ncdbService');

const tryUpdateAuthentication = async (
    authenticationId,
    currentAccount,
    currentPassword,
    newPassword,
    newIdentifierEmail,
    newAuthorizationId
) => {
    try {
        if (!authenticationId || !currentAccount || !currentPassword || !newPassword || !newIdentifierEmail || !newAuthorizationId) {
            throw new Error("All parameters must be provided.");
        }
        // Insert new authentication data
        const insertQuery = `EXECUTE UpdateAuthentication @authentication_id, @current_account, @current_password, @new_password, @new_email, @new_authorization_id`;

        const params = {
            authentication_id: authenticationId,
            current_account: currentAccount,
            current_password: currentPassword,
            new_password: newPassword,
            new_email: newIdentifierEmail,
            new_authorization_id: newAuthorizationId
        };

        await ncdb.query('sa', insertQuery, params);

        // Verify
        const checkQuery = `EXECUTE ReadAuthentication @account, @password`;
        const checkParams = {
            account: currentAccount,
            password: newPassword // ensure new password is used for checking
        };

        const checkResult = await ncdb.query('sa', checkQuery, checkParams);

        // Ensure checkResult is valid and contains the expected structure
        if (checkResult && checkResult.length > 0) {
            return checkResult[0].authorization_id === Number.parseInt(newAuthorizationId);
        } else {
            return false; // Verification failed if no results
        }
    } catch (err) {
        throw new Error(`editAuthService.js/tryEditAuth() | ${err.message}`);
    }
};

module.exports = { tryUpdateAuthentication };
