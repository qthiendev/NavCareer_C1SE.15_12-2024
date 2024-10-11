const { tryDeleteCourse } = require('./deleteCourseService');
const now = new Date();

const deleteCourse = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { course_id } = req.body;

        const data = await tryDeleteCourse(aid, role, course_id);

        if (data) {
            console.log(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | Course ${course_id} deleted succesfully.`);
            return res.status(200).json({
                message: `Course ${course_id} deleted succesfully.`,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | Failed to delete Course ${course_id}.`);
            return res.status(203).json({
                message: `Failed to delete Course ${course_id}.`,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { deleteCourse };