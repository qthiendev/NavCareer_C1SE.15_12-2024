const { tryCreateCourse } = require('./createCourseService');
const now = new Date();

const createCourse = async (req, res) => {
    try {
        const { role, aid } = req.session;
        const {
            course_name, 
            course_short_description, 
            course_full_description, 
            course_price, 
            course_duration
        } = req.body;

        if (Number.isNaN(aid))
            throw new Error(`'aid' must provided.`);

        if (!role)
            throw new Error(`'role' must provided.`);

        if (!course_name)
            throw new Error(`'course_name' must provided.`);

        if (!course_short_description)
            throw new Error(`'course_short_description' must provided.`);

        if (!course_full_description)
            throw new Error(`'course_full_description' must provided.`);

        if (!course_duration)
            throw new Error(`'course_duration' must provided.`);

        const result = await tryCreateCourse(aid, role, course_name, course_short_description, course_full_description, course_price, course_duration);

        console.log(result)
        if (result === 'U_UID') {
            console.error(`[${now.toLocaleString()}] at createCourseController.js/createCourse | User of auth_${aid} not exist.`);
            return res.status(403).json({
                message: `User of auth_${aid} not exist.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'EXISTED') {
            console.warn(`[${now.toLocaleString()}] at createCourseController.js/createCourse | Course '${course_name}' already existed.`);
            return res.status(201).json({
                message: `Course '${course_name}' already existed.`,
                time: now.toLocaleString()
            });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now.toLocaleString()}] at createCourseController.js/createCourse | Course created succesfuly.`);
            return res.status(200).json({
                message: `Course created succesfuly.`,
                time: now.toLocaleString()
            });
        }


        console.log(`[${now.toLocaleString()}] at createCourseController.js/createCourse | Course failed to create.`);
        return res.status(203).json({
            message: `Course failed to create.`,
            time: now.toLocaleString()
        });
        
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createCourseController.js/createCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { createCourse };
