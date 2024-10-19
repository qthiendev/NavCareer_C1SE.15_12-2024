const { tryReadUserCourses } = require('./readUserCoursesService');
const now = new Date();

const readAllCourse = async (req, res) => {
    try {
        const { role, aid } = req.session;

        const courses = await tryReadUserCourses(role, aid);

        if (courses) {
            console.log(`[${now.toLocaleString()}] at readAllCourseController.js/readAllCourse | Courses of user ${aid} found.`);
            return res.status(200).json({
                courses,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at readAllCourseController.js/readAllCourse | Courses of user ${aid} not found.`);
            return res.status(203).json({
                message: `Courses of user ${aid} not found.`,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at readAllCourseController.js/readAllCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { readAllCourse };