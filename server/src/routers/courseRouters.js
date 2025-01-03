const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authentication');
const authzMiddleware = require('../middlewares/authorization');

const { createCourse } = require('../apis/courseManagement/createCourse/createCourseController');
const { readCourse } = require('../apis/courseManagement/readCourse/readCourseController');
const { updateCourse, changeModuleOrdinal } = require('../apis/courseManagement/updateCourse/updateCourseController');
const { deleteCourse } = require('../apis/courseManagement/deleteCourse/deleteCourseController');
const { readFullCourse } = require('../apis/courseManagement/readFullCourse/readFullCourseController');

const { createModule } = require('../apis/courseManagement/moduleManagement/createModule/createModuleController');
const { updateModule } = require('../apis/courseManagement/moduleManagement/updateModule/updateModuleController');
const { deleteModule } = require('../apis/courseManagement/moduleManagement/deleteModule/deleteModuleController');

const { createCollection } = require('../apis/courseManagement/collectionManagement/createCollection/createCollectionController');
const { updateCollection, changeCollectionOrdinal } = require('../apis/courseManagement/collectionManagement/updateCollection/updateCollectionController');
const { deleteCollection } = require('../apis/courseManagement/collectionManagement/deleteCollection/deleteCollectionController');

const { createMaterial } = require('../apis/courseManagement/materialManagement/createMaterial/createMaterialController');
const { updateMaterial, changeMaterialOrdinal, uploadMedia } = require('../apis/courseManagement/materialManagement/updateMaterial/updateMaterialController');
const { deleteMaterial } = require('../apis/courseManagement/materialManagement/deleteMaterial/deleteMaterialController');

const { createQuestion } = require('../apis/courseManagement/quizManagement/createQuestion/createQuestionController');
const { updateQuestion } = require('../apis/courseManagement/quizManagement/updateQuestion/updateQuestionController');
const { deleteQuestion } = require('../apis/courseManagement/quizManagement/deleteQuestion/deleteQuestionController');

const { createAnswer } = require('../apis/courseManagement/quizManagement/createAnswer/createAnswerController');
const { updateAnswer, changeAnswerOrdinal } = require('../apis/courseManagement/quizManagement/updateAnswer/updateAnswerController');
const { deleteAnswer } = require('../apis/courseManagement/quizManagement/deleteAnswer/deleteAnswerController');

const { importQuiz } = require('../apis/courseManagement/quizManagement/importQuiz/importQuizController')

router.get('/read', readCourse);

router.get('/read-full', authMiddleware.isSignedIn, authzMiddleware.esp, readFullCourse);
router.post('/create', authMiddleware.isSignedIn, authzMiddleware.esp, createCourse);
router.post('/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateCourse);
router.post('/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteCourse);

router.post('/module/create', authMiddleware.isSignedIn, authzMiddleware.esp, createModule);
router.post('/module/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateModule);
router.post('/module/ordinal', authMiddleware.isSignedIn, authzMiddleware.esp, changeModuleOrdinal);
router.post('/module/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteModule);

router.post('/module/collection/import-quiz', authMiddleware.isSignedIn, authzMiddleware.esp, importQuiz);
router.post('/module/collection/create', authMiddleware.isSignedIn, authzMiddleware.esp, createCollection);
router.post('/module/collection/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateCollection);
router.post('/module/collection/ordinal', authMiddleware.isSignedIn, authzMiddleware.esp, changeCollectionOrdinal);
router.post('/module/collection/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteCollection);

router.post('/module/collection/material/create', authMiddleware.isSignedIn, authzMiddleware.esp, createMaterial);
router.post('/module/collection/material/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateMaterial);
router.post('/module/collection/material/ordinal', authMiddleware.isSignedIn, authzMiddleware.esp, changeMaterialOrdinal);
router.post('/module/collection/material/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteMaterial);
router.post('/module/collection/material/upload', authMiddleware.isSignedIn, authzMiddleware.esp, uploadMedia);

router.post('/module/collection/question/create', authMiddleware.isSignedIn, authzMiddleware.esp, createQuestion);
router.post('/module/collection/question/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateQuestion);
router.post('/module/collection/question/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteQuestion);

router.post('/module/collection/answer/create', authMiddleware.isSignedIn, authzMiddleware.esp, createAnswer);
router.post('/module/collection/answer/update', authMiddleware.isSignedIn, authzMiddleware.esp, updateAnswer);
router.post('/module/collection/answer/ordinal', authMiddleware.isSignedIn, authzMiddleware.esp, changeAnswerOrdinal);
router.post('/module/collection/answer/delete', authMiddleware.isSignedIn, authzMiddleware.esp, deleteAnswer);

module.exports = router;
