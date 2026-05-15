const http = require('http');

const data = JSON.stringify({
  name: 'Test Student',
  dob: '2010-01-01',
  gender: 'Male',
  studentClass: 'Class 1',
  feesPaid: true
});

const options = {
  hostname: 'localhost',
  port: 5004,
  path: '/api/students/6a0295f3c1f0b5b2c2bc2380',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
