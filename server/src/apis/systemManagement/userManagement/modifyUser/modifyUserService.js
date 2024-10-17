const ncdb = require('../../../databases/ncdbService');

const formatDate = (birthdate) => {
    const [day, month, year] = birthdate.split('/');
    return `${year}-${month}-${day}`; // yyyy-MM-dd
};

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
            birthdate,
            gender,
            email,
            phone_number,
            address,
            user_status
        } = profileData;

        // Ensure all parameters are included and correctly named in the query string
        const queryString = `EXECUTE ModifyUser 
            @authentication_id = @authentication_id,
            @account = @account,
            @password = @password,
            @identifier_email = @identifier_email,
            @authorization_id = @authorization_id,
            @auth_status = @auth_status,
            @user_full_name = @user_full_name,
            @birthdate = @birthdate,
            @gender = @gender,
            @email = @email,
            @phone_number = @phone_number,
            @address = @address,
            @user_status = @user_status`;

        const params = {
            authentication_id: Number(authentication_id),
            account,
            password,
            identifier_email,
            authorization_id: Number(authorization_id),
            auth_status,
            user_full_name,
            birthdate: formatDate(birthdate),
            gender,
            email,
            phone_number,
            address,
            user_status
        };

        const results = await ncdb.query(role, queryString, params);

        return results && results.length > 0 && results[0].check === 'TRUE';

    } catch (err) {
        throw new Error(`updateProfileService.js/tryUpdateProfile| ${err.message}`);
    }
};

module.exports = { tryModifyUser };
