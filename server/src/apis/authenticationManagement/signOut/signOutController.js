const signOut = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err)
                throw new Error(err);

            console.log(`[${new Date().toLocaleString()}] at signOutController.js/signOut | Signed out successfully`);
            return res.status(200).json({
                message: 'Signed out successfully.',
                time: new Date().toLocaleString()
            });

        });
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at signOutController.js/signOut | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
};

module.exports = { signOut };
