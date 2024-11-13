const { tryUpdateCourse, tryChangeModuleOrdinal } = require('./updateCourseService');
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
            course_status
        } = req.body;

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

        const result = await tryUpdateCourse(aid, role, course_id, course_name, course_short_description, course_full_description, course_price, course_duration, course_status);

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

const changeModuleOrdinal = async (req, res) => {
    try {
        const { aid, role } = req.session;

        const { course_id, module_id_1, module_id_2 } = req.query;

        if (!role)
            throw new Error(`'role' is required.`);

        if (!course_id)
            throw new Error(`'course_id' is required.`);

        if (!module_id_1)
            throw new Error(`'module_id_1' is empty or invalid.`);

        if (!module_id_2)
            throw new Error(`'module_id_2' is empty or invalid.`);

        const result = await tryChangeModuleOrdinal(aid, role, course_id, module_id_1, module_id_2);

        if (!result)
            throw new Error(`Cannot get result`);

        if (result === 'U_CID') {
            console.error(`[${now.toLocaleString()}] at updateCourseController.js/changeModuleOrdinal | Course ${course_id} not exist.`);
            return res.status(403).json({
                message: `Course ${course_id} not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'U_UID' || result === 'BANNED') {
            console.error(`[${now.toLocaleString()}] at updateCourseController.js/changeModuleOrdinal | User ${aid} not allow to update Course ${course_id}.`);
            return res.status(403).json({
                message: `User ${aid} not allow to update Course ${course_id}.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at updateCourseController.js/changeModuleOrdinal| Course ${course_id} edited module ${module_id_1}, ${module_id_2} successfuly.`);
            return res.status(200).json({
                message: `Course ${course_id} edited module ${module_id_1}, ${module_id_2} successfuly.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'U_ORD') {
            console.error(`[${now.toLocaleString()}] at updateCourseController.js/changeModuleOrdinal | U_ORD ${course_id}, ${module_id_1}, ${module_id_2}.`);
            return res.status(203).json({
                message: `Course ${course_id} failed to edite module ${module_id_1}, ${module_id_2}.`,
                time: now.toLocaleString()
            });
        }


        if (result === 'FAILED') {
            console.error(`[${now.toLocaleString()}] at updateCourseController.js/changeModuleOrdinal |  Course ${course_id} failed to edite module ${module_id_1}, ${module_id_2}.`);
            return res.status(203).json({
                message: `Course ${course_id} failed to edite module ${module_id_1}, ${module_id_2}.`,
                time: now.toLocaleString()
            });
        }

        throw new Error('Cannot handle');

    } catch (err) {
        console.error(`[${now.toLocaleString()}] at updateCourseController.js/changeModuleOrdinal | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
}

module.exports = { updateCourse, changeModuleOrdinal };