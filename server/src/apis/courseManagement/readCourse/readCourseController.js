const { tryReadCourse } = require('./readCourseService');

const readCourse = async (req, res) => {
    try {
        const { userType, course_id } = req.query;

        if (!userType) 
            throw new Error(`'userType' is required.`);

        if (!course_id) 
            throw new Error(`'course_id' is required.`);

        const data = await tryReadCourse(userType, course_id);

        if (!data) 
            throw new Error(`No course found for the given course_id.`);

        res.status(200).json(data);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readCourseController.js/readCourse() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
}

module.exports = { readCourse };