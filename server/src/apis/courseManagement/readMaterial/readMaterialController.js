const { tryReadMaterial } = require('./readMaterialService');

const readMaterial= async (req, res) => {
    try {
        // Extract course_id from query parameters
        const { userType, course_id } = req.query;

        // Validate input
        if (!course_id) 
            throw new Error(`'course_id' is required.`);

        // Call the service to read materials for the specified course
        const data = await tryReadMaterial(userType, course_id);

        // Check if data was returned
        if (!data) 
            throw new Error(`No materials found for course with ID ${course_id}.`);

        // Send success response
        res.status(200).json(data);

    } catch (err) {
        const now = new Date();
        console.error(`[${now.toLocaleString()}] at readMaterialController.js/readCourse() | {\n${err.message}\n}`);
        res.status(400).json({ message: err.message });
    }
}

module.exports = { readMaterial };
