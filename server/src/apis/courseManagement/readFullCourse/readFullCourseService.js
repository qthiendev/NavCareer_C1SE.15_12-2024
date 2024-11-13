const ncbd = require('../../databases/ncdbService');

const tryReadFullCourse = async (role, courses_id) => {
    try {
        // Kiểm tra xem courses_id có phải là số hợp lệ không
        if (isNaN(courses_id)) {
            throw new Error(`'courses_id' must be a valid number.`);
        }

        const courses = await ncbd.query(role, `execute ReadFullCourse @course_id`, { course_id: courses_id });

        if (!courses || courses.length === 0) {
            return null;
        }

        const courseDetails = {
            authentication_id: courses[0].authentication_id,
            course_id: courses_id,
            course_name: courses[0].course_name,
            course_short_description: courses[0].course_short_description,
            course_full_description: courses[0].course_full_description,
            course_price: courses[0].course_price,
            course_duration: courses[0].course_duration,
            course_piority_index: courses[0].course_piority_index,
            course_status: courses[0].course_status,
            user_id: courses[0].user_id,
            user_full_name: courses[0].user_full_name,
            modules: []
        };

        for (const row of courses) {
            let module = courseDetails.modules.find(m => m.module_ordinal === row.module_ordinal);
            if (!module) {
                module = {
                    module_id: row.module_id,
                    module_ordinal: row.module_ordinal,
                    module_name: row.module_name,
                    collections: []
                };
                courseDetails.modules.push(module);
            }

            let collection = module.collections.find(c => c.collection_id === row.collection_id);
            if (!collection && row.collection_id != null) {
                collection = {
                    collection_id: row.collection_id,
                    collection_ordinal: row.collection_ordinal,
                    collection_name: row.collection_name,
                    materials: []
                };
                module.collections.push(collection);
            }

            if (collection) {
                let material = collection.materials.find(m => m.material_ordinal === row.material_ordinal);
                if (!material && row.material_ordinal != null) {
                    material = {
                        material_ordinal: row.material_ordinal,
                        material_type_name: row.material_type_name,
                        material_content: row.material_content,
                        questions: []
                    };
                    collection.materials.push(material);
                }

                if (material && row.question_ordinal != null) {
                    let question = material.questions.find(q => q.question_ordinal === row.question_ordinal);
                    if (!question) {
                        question = {
                            question_ordinal: row.question_ordinal,
                            question_type_name: row.question_type_name,
                            question_description: row.question_description,
                            answers: []
                        };
                        material.questions.push(question);
                    }

                    if (row.answer_ordinal != null) {
                        question.answers.push({
                            answer_ordinal: row.answer_ordinal,
                            answer_description: row.answer_description,
                            answer_is_right: row.answer_is_right
                        });
                    }
                }
            }
        }

        courseDetails.modules.sort((a, b) => a.module_ordinal - b.module_ordinal);
        for (const module of courseDetails.modules) {
            module.collections.sort((a, b) => a.collection_ordinal - b.collection_ordinal);
            for (const collection of module.collections) {
                collection.materials.sort((a, b) => a.material_ordinal - b.material_ordinal);
                for (const material of collection.materials) {
                    material.questions.sort((a, b) => a.question_ordinal - b.question_ordinal);
                }
            }
        }

        return courseDetails;

    } catch (err) {
        throw new Error(`readCourseService.js/tryReadFullCourse | ${err.message}`);
    }
};

module.exports = { tryReadFullCourse };
