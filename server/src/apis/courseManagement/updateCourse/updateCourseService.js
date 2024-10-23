const ncdb = require('../../databases/ncdbService');

const tryUpdateCourse = async (aid, role, course_id, course_name, course_short_description, course_full_description, course_price, course_duration, course_status, modules) => {
    try {
        if (Number.isNaN(aid))
            throw new Error(`'aid' is required.`);

        if (!role)
            throw new Error(`'role' is required.`);

        if (Number.isNaN(course_id))
            throw new Error(`'course_id' is required.`);

        if (!course_short_description)
            throw new Error(`'course_short_description' is empty or invalid.`);

        if (!course_full_description)
            throw new Error(`'course_full_description' is empty or invalid.`);

        if (Number.isNaN(course_price))
            throw new Error(`'course_price' is required.`);

        if (!course_duration)
            throw new Error(`'course_duration' is empty or invalid.`);

        if (Number.isNaN(course_status))
            throw new Error(`'course_status' is required.`);

        // Update the course
        const updateCourse = await ncdb.query(role,
            `EXECUTE UpdateCourse @aid, @course_id, @course_name, @course_short_description, @course_full_description, @course_price, @course_duration, @course_status`,
            { 
                aid: Number(aid), 
                course_id: Number(course_id), 
                course_name, 
                course_short_description, 
                course_full_description, 
                course_price: Number(course_price), 
                course_duration, 
                course_status: course_status ? 1 : 0 // Convert boolean to integer
            });

        // If course update fails, return the failure check message
        if (updateCourse[0].check !== 'SUCCESSED') {
            return updateCourse[0].check;
        }

        const modulesJson = JSON.stringify(modules);

        // Update modules for the course
        const updateModules = await ncdb.query(role,
            `EXECUTE UpdateModule @aid, @course_id, @modules`,
            { 
                aid: Number(aid), 
                course_id: Number(course_id), 
                modules: modulesJson 
            });

        // Return the result of the module update
        return updateModules[0].check;

    } catch (err) {
        throw new Error(`updateCourseService.js/tryUpdateCourse| ${err.message}`);
    }
};

module.exports = { tryUpdateCourse };
