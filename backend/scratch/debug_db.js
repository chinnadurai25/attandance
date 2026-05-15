const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const count = await Student.countDocuments();
    console.log(`Total Students in DB: ${count}`);
    
    const all = await Student.find().limit(5);
    console.log('Sample Students:', JSON.stringify(all, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
