const { tryReadCourse } = require('./readCourseService');
const now = new Date();

const readCourse = async (req, res) => {
    try {
        const { role } = req.session;
        const { course_id } = req.query;

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' is required.`);

        const course = await tryReadCourse(role, course_id);

        if (course) {
            console.log(`[${now.toLocaleString()}] at readCourseController.js/readCourse | Course ${course_id} found.`);
            return res.status(200).json({
                ...course,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at readCourseController.js/readCourse | Course ${course_id} not found.`);
            return res.status(203).json({
                message: `Course ${course_id} not found.`,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at readCourseController.js/readCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}


module.exports = { readCourse };