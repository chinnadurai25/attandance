async function test() {
  try {
    console.log('Testing Attendance Save with fetch...');
    const payload = {
      date: '2026-05-15',
      studentClass: 'Class 1',
      attendanceData: [
        { studentId: '6a0295f3c1f0b5b2c2bc2380', status: 'Present' }
      ]
    };
    
    const res = await fetch('http://localhost:5004/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
