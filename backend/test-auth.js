// Test script để kiểm tra authentication
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('🔧 Testing JWT authentication...');
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Tạo token test
const testUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'admin@example.com',
    role: 'admin'
};

try {
    const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Token created successfully:');
    console.log('Token:', token);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully:');
    console.log('Decoded:', decoded);
} catch (error) {
    console.error('❌ JWT Error:', error.message);
}


<<<<<<< HEAD









=======
>>>>>>> origin/main
