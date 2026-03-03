import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['student', 'librarian', 'author'],
        required: true
    },
    rollNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    otp: {
        type: String,          
      },
      otpExpires: {
        type: Date,            
      },
      isVerified: {
        type: Boolean,
        default: false,        
      },
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

export default User;