const { tryCreateCourse } = require('./updateCourseService');
const now = new Date();

const updateCourse = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { 
            course_id, 
            new_course_name, 
            new_course_description, 
            new_duration 
        } = req.body;

        if (Number.isNaN(aid))
            throw new Error(`'course_id' is required.`);

        if (!role)
            throw new Error(`'course_id' is required.`);

        if (!new_course_name)
            throw new Error(`'account' is empty or invalid.`);

        if (!new_course_description)
            throw new Error(`'password' is empty or invalid.`);

        if (!new_duration)
            throw new Error(`'duration' is empty or invalid.`);

        const data = await tryCreateCourse(aid, role, course_id, new_course_name, new_course_description, new_duration);

        if (data) {
            console.log(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse | Course ${course_id} edited successfuly.`);
            return res.status(200).json({
                message: `Course ${course_id} edited successfuly.`,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse |  Course ${course_id} failed to edit.`);
            return res.status(203).json({
                message: `Course ${course_id} failed to edit.`,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { updateCourse };