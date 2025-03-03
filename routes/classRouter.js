import express from 'express';
import { getClasses, getClassesByTeacherId, getClassesByStudentId, getClassById ,getLiveClasses,getPreviousClasses} from '../controllers/classController.js';
 import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/all', verifyToken, getClasses);
router.get('/teacher/:teacher_id', verifyToken, getClassesByTeacherId);
router.get('/student/:student_id', verifyToken, getClassesByStudentId);
router.get('/student/:student_id/live', verifyToken, getLiveClasses);
router.get('/student/:student_id/previous', verifyToken, getPreviousClasses);
router.get('/:class_id', verifyToken, getClassById);

export default router;
