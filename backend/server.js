const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Database & Schema ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' },
  name: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  class: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

const attendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
  class: { type: String, required: true }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// --- Auth Logic ---
const MOCK_ADMINS = [
  { email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'admin1@gmail.com', password: 'admin321', role: 'super-admin', name: 'Super Admin User' }
];

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPassword = password?.trim();
  
  console.log('Login attempt:', { cleanEmail, passwordLength: cleanPassword?.length });

  try {
    const mockUser = MOCK_ADMINS.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
    let user;
    if (mockUser) {
      user = mockUser;
    } else {
      user = await User.findOne({ email: cleanEmail });
      if (!user || user.password !== cleanPassword) {
        console.log('Login failed for:', cleanEmail);
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    const payload = {
      user: {
        id: user._id || 'mock-id',
        role: user.role,
        email: user.email,
        name: user.name
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// --- Student Logic ---
app.post('/api/students', async (req, res) => {
  const { name, dob, gender, studentClass } = req.body;
  try {
    const student = new Student({ name, dob, gender, class: studentClass });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.put('/api/students/:id', async (req, res) => {
  const { name, dob, gender, studentClass } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, dob, gender, class: studentClass },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    // Optional: Delete student's attendance records
    await Attendance.deleteMany({ studentId: req.params.id });
    
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// --- Attendance Logic ---
app.post('/api/attendance', async (req, res) => {
  const { date, attendanceData, studentClass } = req.body;
  try {
    // Delete existing attendance for this date and class to avoid duplicates
    await Attendance.deleteMany({ date, class: studentClass });
    
    const records = attendanceData.map(item => ({
      date,
      studentId: item.studentId,
      status: item.status,
      class: studentClass
    }));
    
    await Attendance.insertMany(records);
    res.status(201).json({ message: 'Attendance recorded successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/api/attendance', async (req, res) => {
  const { date, studentClass } = req.query;
  try {
    const records = await Attendance.find({ date, class: studentClass });
    res.json(records);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.get('/api/attendance/summary', async (req, res) => {
  const { month, studentClass } = req.query; // YYYY-MM
  try {
    let query = { date: { $regex: `^${month}` } };
    if (studentClass) {
      query.class = studentClass;
    }
    const records = await Attendance.find(query);
    
    // Group by date and count statuses
    const summary = records.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { Present: 0, Absent: 0, Leave: 0 };
      }
      acc[curr.date][curr.status]++;
      return acc;
    }, {});
    
    res.json(summary);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Attendance API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
