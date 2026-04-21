import bcrypt from 'bcryptjs';

const password = 'admin123';
const hash = await bcrypt.hash(password, 12);
console.log(hash);

// Visit localhost:3000/admin/dashboard
// Admin username: admin
// Admiin password: admin123