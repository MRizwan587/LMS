import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';

export const signup = async (req, res) => {
  const { name, email, password, role, rollNumber, librarianId, authorId } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (role === 'student' && !rollNumber) {
    return res.status(400).json({ message: 'Roll number is required for students' });
  }

  if (role === 'librarian' && !librarianId) {
    return res.status(400).json({ message: 'Librarian ID is required for librarians' });
  }

  if (role === 'author' && !authorId) {
    return res.status(400).json({ message: 'Author ID is required for authors' });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      }
      await User.deleteOne({ email });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({name, email, password: hashedPassword, role, rollNumber: role === 'student' ? rollNumber : undefined, otp, otpExpires, isVerified: false });
    await newUser.save();
    try {
      await sendEmail(newUser, otp);
      return res.status(201).json({
        message: 'User registered successfully. OTP sent to your email for verification.'
      });
    } catch (emailError) {
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || user.isActive === false) {
            return res.status(400).json({ message: 'User not found or inactive' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = signToken(user._id, user.role);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.isVerified) {
        return res.status(400).json({ message: 'Account already verified' });
      }
      if (!user.otp || user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      if (!user.otpExpires || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired. Please regenerate OTP.' });
      }
  
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      const token = signToken(user._id, user.role);
      res.json({
        message: 'OTP verified successfully! Account is now active.',
        user: user,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const regenerateOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.isVerified = false;
      await user.save();
      await sendEmail(user, otp);
      return res.status(200).json({ message: 'OTP regenerated successfully. Please check your email for the new OTP.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();
    const token = signToken(user._id, user.role);
    return res.status(200).json({ message: 'Password reset successfully', user: user, token: token });
};