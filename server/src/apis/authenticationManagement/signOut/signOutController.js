const signOut = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(`[${new Date().toLocaleString()}] at signOutController.js/signOut() | Error destroying session >{${err.message}}<`);
                if (!res.headersSent) {
                    return res.status(500).json({
                        message: 'Error on request',
                        time: new Date().toLocaleString()
                    });
                }
            } else {
                console.log(`[${new Date().toLocaleString()}] at signOutController.js/signOut() | Signed out successfully`);
                if (!res.headersSent) {
                    return res.status(200).json({
                        message: 'Signed out successfully.',
                        time: new Date().toLocaleString()
                    });
                }
            }
        });
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at signOutController.js/signOut() | Error >{${err.message}}<`);
        if (!res.headersSent) {
            return res.status(500).json({
                message: 'Error on request',
                time: new Date().toLocaleString()
            });
        }
    }
};

module.exports = { signOut };
