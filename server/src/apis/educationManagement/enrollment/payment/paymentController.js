const { tryCreateOrder } = require('./paymentService');
const { tryReadCourse } = require('../../../courseManagement/readCourse/readCourseService');
const { tryReadProfile } = require('../../../profileManagement/readProfile/readProfileService');
const now = new Date();

const createOrder = async (req, res) => {
    try {
        const { aid, uid, role } = req.session;
        const { course_id } = req.query;

        if (!course_id)
            throw new Error(`'course_id' is required.`);

        const courseData = await tryReadCourse(role, course_id);
        const userData = await tryReadProfile(aid, role, uid);

        if (courseData.check) {
            console.error(`[${now.toLocaleString()}] at paymentController.js/createOrder | Course ${course_id} not found.`);
            return res.status(403).json({
                message: `Course ${course_id} not found.`,
                time: now.toLocaleString()
            });
        }

        if (userData.check) {
            console.error(`[${now.toLocaleString()}] at paymentController.js/createOrder | Profile '${uid}' not found`);
            return res.status(403).json({
                message: `Profile '${uid}' not found`,
                time: now.toLocaleString()
            });
        }

        const data = await tryCreateOrder(aid, role, courseData, userData);

        if (!data)
            throw new Error('Cannot get data');

        console.log(`[${new Date().toLocaleString()}] at paymentController.js/createOrder | Order created successfully => ${data.orderurl}`);
        return res.status(200).json({
            ...data,
            time: new Date().toLocaleString()
        });
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at paymentController.js/createOrder | ${err.message}`);
        return res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
}

module.exports = { createOrder };