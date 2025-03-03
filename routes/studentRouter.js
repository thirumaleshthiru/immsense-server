import express from 'express';
import { getStatistics, giveAttendance } from '../controllers/studentController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/statistics/:student_id', verifyToken, getStatistics);
router.post('/attendance', verifyToken, giveAttendance);

export default router;