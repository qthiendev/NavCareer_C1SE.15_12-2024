const ncbd = require('../../databases/ncdbService');

const tryCreateCourse = async (aid, role, courseName, courseDescription, duration, providerId) => {
    try {

        if (Number.isNaN(aid))
            throw new Error(`'aid' must provided.`);

        if (!role)
            throw new Error(`'role' must provided.`);

        if (!courseName)
            throw new Error(`'courseName' must provided.`);

        if (!courseDescription)
            throw new Error(`'courseDescription' must provided.`);

        if (!duration)
            throw new Error(`'duration' must provided.`);

        if (Number.isNaN(providerId))
            throw new Error(`'providerId' must provided.`);

        const result = await ncbd.query(role,
            `execute CreateCourse @aid, @course_name, @course_description, @duration, @provider_id`,
            {
                aid: aid,
                course_name: courseName,
                course_description: courseDescription,
                duration: duration,
                provider_id: providerId
            });

        return result && result.length > 0;

    } catch (err) {
        throw new Error(`createCourseService.js/tryCreateCourse| ${err.message}`);
    }
};

module.exports = { tryCreateCourse };