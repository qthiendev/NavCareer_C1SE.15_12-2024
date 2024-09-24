const { tryCreateCourse } = require('./createCourseService');

// Validate input using regex
const isValidInput = (input) => /^[a-zA-Z0-9@._-]+$/.test(input);

const createCourse = async (req, res) => {
    try {
        const {
            userType: rawUser = '',
            course_name,
            course_description,
            duration,
            user_id: rawUserID = ''
        } = req.query;

        const userType = rawUser.trim().replace(/\s/g, '') || null;
        const user_id = rawUserID.trim().replace(/\s/g, '') || null;

        if (!userType)
            throw new Error(`'userType' is empty.`);

        if (!course_name)
            throw new Error(`'account' is empty or invalid.`);

        if (!course_description)
            throw new Error(`'password' is empty or invalid.`);

        if (!duration)
            throw new Error(`'duration' is empty or invalid.`);

        if (!user_id)
            throw new Error(`'authorization_id' is empty or invalid.`);

        if (!isValidInput(userType))
            throw new Error(`'userType' contains invalid characters.`);

        if (!isValidInput(user_id))
            throw new Error(`'authorization_id' contains invalid characters.`);

        const createCourseSuccess = await tryCreateCourse(userType, course_name, course_description, duration, user_id);

        if (!createCourseSuccess)
            throw new Error('Failed to add course.');

        res.status(200).json({ message: 'Course added successfully.' });

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at createCourseController.js/createCourse() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { createCourse };
