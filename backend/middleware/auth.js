const jwt = require('jsonwebtoken');

const xacThuc = (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.header('Authorization');
    console.log('🔍 Auth header:', authHeader);
    
    if (!authHeader) {
        console.log('❌ No auth header');
        return res.status(401).json({ message: 'Không tìm thấy token, quyền truy cập bị từ chối' });
    }

    try {
        // Kiểm tra format "Bearer TOKEN"
        const token = authHeader.split(' ')[1];
        console.log('🔍 Token:', token ? token.substring(0, 50) + '...' : 'null');
        
        if (!token) {
            console.log('❌ No token in header');
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }

        // Xác thực token
        const JWT_SECRET = process.env.JWT_SECRET || 'group05-super-secret-jwt-key-2024';
        console.log('🔍 JWT_SECRET:', JWT_SECRET);
        
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token verified:', decoded);
        
        // Thêm thông tin user vào request
        req.user = decoded;
        next();
    } catch (err) {
        console.log('❌ Token verification failed:', err.message);
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

module.exports = {
    xacThuc
};