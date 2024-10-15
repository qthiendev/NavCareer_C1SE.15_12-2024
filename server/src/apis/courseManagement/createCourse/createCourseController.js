const { tryCreateCourse } = require('./createCourseService');
const now = new Date();

const createCourse = async (req, res) => {
    try {
        const { role, aid } = req.session;
        const {
            course_name,
            course_description,
            course_price,
            duration
        } = req.body;

        if (Number.isNaN(aid))
            throw new Error(`'aid' must provided.`);

        if (!role)
            throw new Error(`'role' must provided.`);

        if (!course_name)
            throw new Error(`'course_name' must provided.`);

        if (!course_description)
            throw new Error(`'course_description' must provided.`);

        if (Number.isNaN(course_price))
            throw new Error(`'course_price' must provided.`);

        if (!duration)
            throw new Error(`'duration' must provided.`);

        const data = await tryCreateCourse(aid, role, course_name, course_description, course_price, duration);

        if (data) {
            console.log(`[${now.toLocaleString()}] at createCourseController.js/createCourse | Course created succesfuly.`);
            return res.status(200).json({
                message: `Course created succesfuly.`,
                time: now.toLocaleString()
            });
        } else {
            console.log(`[${now.toLocaleString()}] at createCourseController.js/createCourse | Course failed to create.`);
            return res.status(203).json({
                message: `Course failed to create.`,
                time: now.toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at createCourseController.js/createCourse | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: now.toLocaleString()
        });
    }
};

module.exports = { createCourse };
