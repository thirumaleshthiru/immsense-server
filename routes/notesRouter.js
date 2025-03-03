import express from 'express';
import { getAllNotesByTeacherID, getAllNotesByClassID, getNotes } from '../controllers/notesController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/teacher/:teacher_id', verifyToken, getAllNotesByTeacherID);
router.get('/class/:class_id', verifyToken, getAllNotesByClassID);
router.get('/:note_id', verifyToken, getNotes);

export default router;
