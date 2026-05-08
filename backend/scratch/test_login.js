const MOCK_ADMINS = [
  { email: 'admin@gmail.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'admin1@gmail.com', password: 'admin321', role: 'super-admin', name: 'Super Admin User' }
];

const email = 'admin@gmail.com';
const password = 'admin123';

const mockUser = MOCK_ADMINS.find(u => u.email === email && u.password === password);
console.log('Mock user found:', mockUser);
