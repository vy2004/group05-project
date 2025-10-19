const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Không tìm thấy token, quyền truy cập bị từ chối' });
    }

    try {
        // Kiểm tra format "Bearer TOKEN"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token không hợp lệ' });
        }

        // Xác thực token
        const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Thêm thông tin user vào request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};