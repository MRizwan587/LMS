import User from '../models/User.js';

// GET /users/students — list all students (librarian only)
export const getStudents = async (req, res) => {
  try {
    if (req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarians can view the students list' });
    }
    const students = await User.find({ role: 'student' })
      .select('name email rollNumber role isActive createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /users/students/:id/status — toggle student active (librarian only)
export const updateStudentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarians can update student status' });
    }
    const { id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }
    const user = await User.findOne({ _id: id, role: 'student' });
    if (!user) return res.status(404).json({ message: 'Student not found' });
    user.isActive = isActive;
    await user.save();
    const student = await User.findById(id).select('name email rollNumber role isActive createdAt').lean();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /users/students/:id — update student (librarian only)
export const updateStudent = async (req, res) => {
  try {
    if (req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Only librarians can update students' });
    }
    const { id } = req.params;
    const { name, email, rollNumber } = req.body;
    const user = await User.findOne({ _id: id, role: 'student' });
    if (!user) return res.status(404).json({ message: 'Student not found' });
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (rollNumber !== undefined) user.rollNumber = rollNumber;
    await user.save();
    const student = await User.findById(id).select('name email rollNumber role isActive createdAt').lean();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
