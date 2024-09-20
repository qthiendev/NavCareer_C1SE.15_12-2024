// const { getProfileByAuthID, getProfileByUserName, getProfileByUserID } = require("../../services/accountManagement/profileService");

// const getProfile = async (req, res) => {
//     const { AUTHENTICATION_ID, 
//         USER_ID, 
//         USER_NAME } = req.query;

//     try {
//         console.log(`</> ${JSON.stringify(req.query)}`);

//         let result = null;

//         if (AUTHENTICATION_ID) {
//             result = await getProfileByAuthID(AUTHENTICATION_ID);
//         } else if (USER_ID) {
//             result = await getProfileByUserID(USER_ID);
//         } else if (USER_NAME) {
//             result = await getProfileByUserName(USER_NAME);
//         }

//         res.json(result[0]);

//     } catch (err) {
//         console.error("<!> Error querying user profile.");
//         console.error("<!>", err);
//         res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
//     }
// };

// module.exports = { getProfile };