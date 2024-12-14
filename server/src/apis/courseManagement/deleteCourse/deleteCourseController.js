const { tryDeleteCourse } = require('./deleteCourseService');
const now = new Date();

const deleteCourse = async (req, res) => {
    try {
        const { role, aid } = req.session;
        const { course_id } = req.query;

        if (Number.isNaN(aid))
            throw new Error(`'aid' must provided.`);

        if (!role)
            throw new Error(`'role' must provided.`);

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' must provided.`);

        const result = await tryDeleteCourse(aid, course_id);

        console.log(result);
        if (result === 'U_UID') {
            console.error(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | User of auth_${aid} not exist.`);
            return res.status(403).json({
                message: `User of auth_${aid} not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'U_CID') {
            console.warn(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | Course ID '${course_id}' not found.`);
            return res.status(404).json({
                message: `Course ID '${course_id}' not found.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'U_ROLE') {
            console.warn(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | User does not have permission.`);
            return res.status(403).json({
                message: `User does not have permission.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'BANNED') {
            console.warn(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | User is banned.`);
            return res.status(403).json({
                message: `User is banned.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | Course deleted successfully.`);
            return res.status(200).json({
                message: `Course deleted successfully.`,
                time: now.toLocaleString()
            });
        }

        console.log(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | Course failed to delete.`);
        return res.status(203).json({
            message: `Course failed to delete.`,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at deleteCourseController.js/deleteCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { deleteCourse };
