import express from 'express';
import { createClass, deleteClass, createNotes,getAllAttendance, deleteNotes, viewClassAttendance,getClassAttendance } from '../controllers/teacherController.js';
import verifyToken from '../middleware/verifyToken.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router.post('/create', verifyToken, upload.single('class_video_url'), createClass);
router.delete('/delete/:class_id', verifyToken, deleteClass);
router.post('/notes/create', verifyToken, upload.single('notes_url'), createNotes);
router.delete('/notes/delete/:note_id', verifyToken, deleteNotes);
router.get('/attendance/:class_id', verifyToken, viewClassAttendance);
router.get('/class-attendance/:class_id/:year/:branch/:section', verifyToken, getClassAttendance);
router.get('/all-attendance/:class_id', verifyToken, getAllAttendance);

export default router;
