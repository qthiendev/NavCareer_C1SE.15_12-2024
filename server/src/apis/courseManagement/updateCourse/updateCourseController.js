const { tryUpdateCourse } = require('./updateCourseService');
const now = new Date();

const updateCourse = async (req, res) => {
    try {
        const { aid, role } = req.session;

        const {
            course_id,
            course_name,
            course_short_description,
            course_full_description,
            course_price,
            course_duration,
            course_status,
            modules
        } = req.body;

        console.log(req.body);

        if (Number.isNaN(aid))
            throw new Error(`'aid' is required.`);

        if (!role)
            throw new Error(`'role' is required.`);

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' is required.`);

        if (!course_short_description)
            throw new Error(`'account' is empty or invalid.`);

        if (!course_full_description)
            throw new Error(`'password' is empty or invalid.`);

        if (Number.isNaN(course_price))
            throw new Error(`'duration' is empty or invalid.`);

        if (!course_duration)
            throw new Error(`'duration' is empty or invalid.`);

        if (Number.isNaN(course_status))
            throw new Error(`'aid' is required.`);

        const result = await tryUpdateCourse(aid, role, course_id, course_name, course_short_description, course_full_description, course_price, course_duration, course_status, modules);

        if (result === 'U_CID') {
            console.error(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse | Course ${course_id} not exist.`);
            return res.status(403).json({
                message: `Course ${course_id} not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'U_UID' || result === 'U_ROLE') {
            console.error(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse | User ${aid} not allow to update Course ${course_id}.`);
            return res.status(403).json({
                message: `User ${aid} not allow to update Course ${course_id}.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse | Course ${course_id} edited successfuly.`);
            return res.status(200).json({
                message: `Course ${course_id} edited successfuly.`,
                time: now.toLocaleString()
            });
        }

        console.error(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse |  Course ${course_id} failed to edit.`);
        return res.status(203).json({
            message: `Course ${course_id} failed to edit.`,
            time: now.toLocaleString()
        });

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at updateCourseController.js/updateCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { updateCourse };