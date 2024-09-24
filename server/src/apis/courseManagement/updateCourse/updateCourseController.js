const { tryCreateCourse } = require('./updateCourseService');

const updateCourse = async (req, res) => {
    try {
        const {
            userType: rawUser = '',
            course_id,
            course_name,
            course_description,
            duration,
            created_date,
            user_id: rawUserID = ''
        } = req.query
        
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

        if (!created_date)
            throw new Error(`'duration' is empty or invalid.`);

        if (!user_id)
            throw new Error(`'user_id' is empty or invalid.`);

        const data = tryCreateCourse(userType, course_id, course_name, course_description, duration, created_date, user_id);

        if (data)
            res.status(200).json({ message: 'Course modified successfully.' });

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at createCourseController.js/createCourse() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
}

module.exports = { updateCourse };