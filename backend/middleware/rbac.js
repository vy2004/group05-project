const User = require('../models/user');

// Middleware kiểm tra quyền Admin
const kiemTraQuyenAdmin = async (req, res, next) => {
    try {
        // Kiểm tra xem user đã được xác thực chưa
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ 
                message: 'Chưa đăng nhập hoặc token không hợp lệ' 
            });
        }

        // Tìm user trong database để kiểm tra role
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông tin người dùng' 
            });
        }

        // Kiểm tra quyền admin
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Chỉ Admin mới có quyền truy cập chức năng này' 
            });
        }

        // Thêm thông tin user vào request để sử dụng ở các middleware tiếp theo
        req.userInfo = user;
        next();
    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền Admin:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi kiểm tra quyền truy cập' 
        });
    }
};

// Middleware kiểm tra quyền User hoặc Admin
const kiemTraQuyenUserHoacAdmin = async (req, res, next) => {
    try {
        // Kiểm tra xem user đã được xác thực chưa
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ 
                message: 'Chưa đăng nhập hoặc token không hợp lệ' 
            });
        }

        // Tìm user trong database để kiểm tra role
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông tin người dùng' 
            });
        }

        // Kiểm tra quyền user hoặc admin
        if (user.role !== 'user' && user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Không có quyền truy cập chức năng này' 
            });
        }

        // Thêm thông tin user vào request
        req.userInfo = user;
        next();
    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền User/Admin:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi kiểm tra quyền truy cập' 
        });
    }
};

// Middleware kiểm tra quyền tự xóa (chỉ có thể xóa chính mình hoặc admin có thể xóa bất kỳ ai)
const kiemTraQuyenXoaUser = async (req, res, next) => {
    try {
        const { id } = req.params; // ID của user cần xóa
        const currentUserId = req.user.userId; // ID của user hiện tại

        // Tìm user hiện tại trong database
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông tin người dùng hiện tại' 
            });
        }

        // Admin có thể xóa bất kỳ user nào
        if (currentUser.role === 'admin') {
            req.userInfo = currentUser;
            return next();
        }

        // User thường chỉ có thể xóa chính mình
        if (currentUserId === id) {
            req.userInfo = currentUser;
            return next();
        }

        // Không có quyền xóa user khác
        return res.status(403).json({ 
            message: 'Bạn chỉ có thể xóa tài khoản của chính mình' 
        });

    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền xóa user:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi kiểm tra quyền xóa user' 
        });
    }
};

module.exports = {
    kiemTraQuyenAdmin,
    kiemTraQuyenUserHoacAdmin,
    kiemTraQuyenXoaUser
};
