const ncdb = require('../../databases/ncdbService');

const tryUpdateAuth = async (
    userType,
    authenticationId,
    newAccount,
    currentPassword,
    newPassword,
    newIdentifierEmail,
    newAuthorizationId
) => {
    try {
        if (!authenticationId || !currentPassword || !newPassword || !newIdentifierEmail || !newAuthorizationId) {
            throw new Error("All parameters must be provided.");
        }
        // Insert new authentication data
        const insertQuery = `EXECUTE UpdateAuthentication 
            @authentication_id, 
            @new_account,
            @current_password,
            @new_password, 
            @new_email,
            @new_authorization_id`;

        const params = {
            authentication_id: authenticationId,
            new_account: newAccount,
            current_password: currentPassword,
            new_password: newPassword,
            new_email: newIdentifierEmail,
            new_authorization_id: newAuthorizationId
        };

        await ncdb.query(userType, insertQuery, params);

        // Verify

        const checkResult = await ncdb.query(
            userType,
            `EXECUTE ReadAuthentication @account, @password`,
            { account: newAccount, password: newPassword }
        );

        // Ensure checkResult is valid and contains the expected structure
        return checkResult && checkResult.length > 0
            && checkResult[0].authorization_id === Number.parseInt(newAuthorizationId)
            && checkResult[0].email === new_email
            && checkResult[0].email === new_email;
    } catch (err) {
        throw new Error(`editAuthService.js/tryEditAuth | ${err.message}`);
    }
};

module.exports = { tryUpdateAuth };
