const signOut = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(`[${new Date().toLocaleString()}] at signOutController.js/signOut() | Error destroying session >{${err.message}}<`);
                return res.status(500).json({
                    message: 'Error on request',
                    time: new Date().toLocaleString()
                });

            }

            console.log(`[${new Date().toLocaleString()}] at signOutController.js/signOut() | Signed out successfully`);
            return res.status(200).json({
                message: 'Signed out successfully.',
                time: new Date().toLocaleString()
            });

        });
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at signOutController.js/signOut() | Error >{${err.message}}<`);
        return res.status(500).json({
            message: 'Error on request',
            time: new Date().toLocaleString()
        });
    }
};

module.exports = { signOut };
