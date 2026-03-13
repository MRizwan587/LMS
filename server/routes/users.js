import express from 'express';
import { protect } from '../middleware/auth.js';
import { getStudents, updateStudentStatus, updateStudent } from '../controllers/userController.js';

const router = express.Router();
router.use(protect);

router.get('/students', getStudents);
router.patch('/students/:id/status', updateStudentStatus);
router.patch('/students/:id', updateStudent);

export default router;
