const { queryDB } = require('../../database/queryDBService');

const tryReadMaterial = async (userType, course_id) => {
    try {
        // Execute the SQL query
        const queryString = `
        select c.course_id,
            c.course_name,
            c.course_description,
            c.duration,
            c.created_date,
            c.provider_id,
            m.module_id,
            m.module_name,
            m.module_ordinal,
            m.created_date as module_created_date,
            col.collection_id,
            col.collection_name,
            col.collection_ordinal,
            col.collection_type_id,
            col.created_date as collection_created_date,
            mat.material_id,
            mat.material_content,
            mat.material_ordinal,
            mat.material_type_id
        from courses c
            left join  modules m on c.course_id = m.course_id
            left join collections col on m.module_id = col.module_id
            left join materials mat on col.collection_id = mat.collection_id
        where c.course_id = @course_id`;

        const params = {course_id: course_id};

        const results = await queryDB(userType, queryString, params);

        // Structure the results
        const structuredResult = {
            Courses: []
        };

        results.forEach(row => {
            const {
                course_id,
                course_name,
                course_description,
                duration,
                created_date,
                provider_id,
                module_id,
                module_name,
                module_ordinal,
                module_created_date,
                collection_id,
                collection_name,
                collection_ordinal,
                collection_type_id,
                collection_created_date,
                material_id,
                material_content,
                material_ordinal,
                material_type_id
            } = row;

            // Check if the course already exists
            let course = structuredResult.Courses.find(c => c.course_id === course_id);
            if (!course) {
                course = {
                    course_id,
                    course_name,
                    course_description,
                    duration,
                    created_date,
                    provider_id,
                    Modules: [] // Initialize Modules array
                };
                structuredResult.Courses.push(course);
            }

            // Check if the module already exists
            let module = course.Modules.find(m => m.module_id === module_id);
            if (module_id !== null && !module) {
                module = {
                    module_id,
                    module_name,
                    module_ordinal,
                    created_date: module_created_date,
                    Collections: [] // Initialize Collections array
                };
                course.Modules.push(module);
            }

            // Check if the collection already exists
            let collection = module?.Collections.find(c => c.collection_id === collection_id);
            if (collection_id !== null && !collection) {
                collection = {
                    collection_id,
                    collection_name,
                    collection_ordinal,
                    collection_type_id,
                    created_date: collection_created_date,
                    Materials: [] // Initialize Materials array
                };
                module.Collections.push(collection);
            }

            // Add the material to the collection
            if (material_id !== null) {
                collection?.Materials.push({
                    material_id,
                    material_content,
                    material_ordinal,
                    material_type_id
                });
            }
        });

        return structuredResult;

    } catch (error) {
        console.error("Error reading materials:", error);
        throw error; // Re-throw the error for further handling
    }
};

module.exports = { tryReadMaterial };
