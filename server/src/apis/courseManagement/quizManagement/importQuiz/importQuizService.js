const ncdb = require('../../../databases/ncdbService');

const tryImportQuiz = async (aid, role, course_id, collection_id, questions) => {
    try {
        // Step 1: Create materials for each question with generic "Câu hỏi X" content
        for (let i = 0; i < questions.length; i++) {
            await ncdb.query(
                role,
                `EXECUTE CreateMaterial @aid, @material_content, @material_type_id, @collection_id`,
                {
                    aid: Number(aid),
                    collection_id: Number(collection_id),
                    material_content: `Câu hỏi ${i + 1}`,
                    material_type_id: 3, // Assuming 3 = Question type material
                }
            );
        }
        // Step 2: Fetch the full course structure
        const fullCourse = await ncdb.query(
            role,
            `EXECUTE ReadFullCourse @course_id`,
            { course_id: Number(course_id) }
        );

        let materialIds = fullCourse.filter(item => 
            item.collection_id === collection_id).map(item => item.material_id);

        console.log(materialIds);

        // Step 4: Create questions linked to the materials
        for (let i = 0; i < questions.length; i++) {
            const materialId = materialIds[i]; // Take the next available material ID
            const question = questions[i];

            const questionResult = await ncdb.query(
                role,
                `EXECUTE CreateQuestion @aid, @material_id, @question_description, @question_type_id`,
                {
                    aid: Number(aid),
                    material_id: materialId,
                    question_description: question.question,
                    question_type_id: question.type === 'multiple_response' ? 1 : 0, // Assign type
                }
            );

            if (!questionResult || questionResult.length === 0) {
                throw new Error('Failed to create question.');
            }
        }

        const fullCourse1 = await ncdb.query(
            role,
            `EXECUTE ReadFullCourse @course_id`,
            { course_id: Number(course_id) }
        );

        let questionIds = fullCourse1.filter(item => 
            item.collection_id === collection_id).map(item => item.question_id);

        // Step 5: Insert answers for each newly created question
        for (let i = 0; i < questionIds.length; i++) {
            const questionid = questionIds[i];
            const answers = questions[i].answers;

            for (const answer of answers) {
                const answerResult = await ncdb.query(
                    role,
                    `EXECUTE CreateAnswer @aid, @question_id, @answer_description, @answer_is_right`,
                    {
                        aid: Number(aid),
                        question_id: questionid,
                        answer_description: answer.text,
                        answer_is_right: answer.is_right ? 1 : 0,
                    }
                );

                if (!answerResult || answerResult.length === 0) {
                    throw new Error('Failed to create answer.');
                }
            }
        }

        return { success: true};
    } catch (err) {
        throw new Error(`importQuizService.js/tryImportQuiz | ${err.message}`);
    }
};

module.exports = { tryImportQuiz };
