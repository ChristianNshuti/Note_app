const express = require('express');
const router = express.Router();
const {
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    createClass,
    replaceClass,
    deleteClass,
    addClass
} = require('../../controllers/adminControllers/studentController');
const {
    getTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher
} = require('../../controllers/adminControllers/teacherController');
const upload = require('../../middlewares/adminMiddlewares/fileUpload');
const validateClassName = require('../../middlewares/adminMiddlewares/validateClassName');
const validateHeaders = require('../../middlewares/adminMiddlewares/validateHeaders');

router.get('/students',getStudents);
router.post('/add-student',addStudent);
router.put('/students',updateStudent);
router.delete('/students',deleteStudent);
router.post('/create-class',upload.single('file',validateHeaders,createClass));
router.post('/replace-class',upload.single('file'),validateHeaders,replaceClass);
router.delete('/delete-class',deleteClass);
router.post('/add-class',validateClassName,addClass);


//teachers routes

router.get('/teachers',getTeachers);
router.post('/add-teacher',addTeacher);
router.put('/teachers',updateTeacher);
router.delete('/teachers',deleteTeacher);

module.exports = router;