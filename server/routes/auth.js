import express from 'express';
import { signup, login, regenerateOtp, verifyOtp, resetPassword} from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/regenerate-otp', regenerateOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;