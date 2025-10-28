// Debug JWT authentication
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('🔧 Debug JWT Authentication');
console.log('==========================================');

// 1. Kiểm tra JWT_SECRET
console.log('1. JWT_SECRET from .env:', process.env.JWT_SECRET);

// 2. Tạo token test
const testUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'admin@example.com',
    role: 'admin'
};

console.log('\n2. Creating test token...');
const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log('Test token:', token);

// 3. Verify token
console.log('\n3. Verifying token...');
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);
} catch (error) {
    console.error('❌ Token verification failed:', error.message);
}

// 4. Test với token cũ (nếu có)
console.log('\n4. Testing with old token format...');
const oldSecret = 'dev_secret_key_change_me';
try {
    const oldToken = jwt.sign(testUser, oldSecret, { expiresIn: '1h' });
    console.log('Old token:', oldToken);
    
    // Thử verify với secret mới
    try {
        const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
        console.log('✅ Old token works with new secret');
    } catch (err) {
        console.log('❌ Old token does not work with new secret:', err.message);
    }
} catch (error) {
    console.error('❌ Error creating old token:', error.message);
}

console.log('\n==========================================');
console.log('Debug completed');











