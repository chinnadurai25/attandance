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

// --- Auth Logic ---
const MOCK_ADMINS = [
  { email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'admin1@gmail.com', password: 'admin321', role: 'super-admin', name: 'Super Admin User' }
];

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const mockUser = MOCK_ADMINS.find(u => u.email === email && u.password === password);
    let user;
    if (mockUser) {
      user = mockUser;
    } else {
      user = await User.findOne({ email });
      if (!user || user.password !== password) {
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

// Root route
app.get('/', (req, res) => {
  res.send('Attendance API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
