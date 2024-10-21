const ncdb = require('../../../databases/ncdbService');

const tryModifyUser = async (role, profileData) => {
    try {
        const {
            authentication_id,
            account,
            password,
            identifier_email,
            authorization_id,
            auth_status,
            user_full_name,
            user_alias,
            user_bio,
            user_birthdate,
            user_gender,
            user_email,
            user_phone_number,
            user_address,
            user_status
        } = profileData;

        // Validate and format inputs
        const params = {
            authentication_id: Number(authentication_id),
            account: account,
            password,
            identifier_email: identifier_email,
            authorization_id: Number(authorization_id),
            auth_status: Boolean(auth_status),
            user_full_name: user_full_name,
            user_alias: user_alias,
            user_bio: user_bio,
            user_birthdate: user_birthdate,
            user_gender: Boolean(user_gender),
            user_email: user_email,
            user_phone_number: user_phone_number,
            user_address: user_address,
            user_status: Boolean(user_status),
        };

        // Construct the query string for the stored procedure
        const queryString = `
            EXECUTE ModifyUser 
                @authentication_id = @authentication_id,
                @account = @account,
                @password = @password,
                @identifier_email = @identifier_email,
                @authorization_id = @authorization_id,
                @auth_status = @auth_status,
                @user_full_name = @user_full_name,
                @user_alias = @user_alias,
                @user_bio = @user_bio,
                @user_birthdate = @user_birthdate,
                @user_gender = @user_gender,
                @user_email = @user_email,
                @user_phone_number = @user_phone_number,
                @user_address = @user_address,
                @user_status = @user_status;
        `;

        // Execute the query with parameterized values
        const results = await ncdb.query(role, queryString, params);

        // Ensure the procedure executed successfully by checking the result
        return results && results[0]?.check === 'TRUE';

    } catch (err) {
        // Add more context to the error message for easier debugging
        throw new Error(`updateProfileService.js/tryModifyUser | Error modifying user with ID ${profileData.authentication_id}: ${err.message}`);
    }
};

module.exports = { tryModifyUser };
