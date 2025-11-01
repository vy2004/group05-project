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

// Middleware kiểm tra quyền xóa user
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

        // Tìm user cần xóa
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ 
                message: 'Không tìm thấy user cần xóa' 
            });
        }

        // Admin có thể xóa bất kỳ user nào (trừ chính mình)
        if (currentUser.role === 'admin') {
            if (currentUserId === id) {
                return res.status(400).json({ 
                    message: 'Admin không thể xóa tài khoản của chính mình' 
                });
            }
            req.userInfo = currentUser;
            return next();
        }

        // Moderator KHÔNG thể xóa user nào (kể cả user thường)
        if (currentUser.role === 'moderator') {
            return res.status(403).json({ 
                message: 'Moderator không có quyền xóa user' 
            });
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

// Middleware kiểm tra quyền theo role cụ thể (có thể check nhiều role)
const checkRole = (...allowedRoles) => {
    return async (req, res, next) => {
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

            // Kiểm tra role có trong danh sách được phép không
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ 
                    message: `Chỉ ${allowedRoles.join(', ')} mới có quyền truy cập chức năng này` 
                });
            }

            // Thêm thông tin user vào request
            req.userInfo = user;
            next();
        } catch (error) {
            console.error('Lỗi khi kiểm tra quyền:', error);
            res.status(500).json({ 
                message: 'Lỗi server khi kiểm tra quyền truy cập' 
            });
        }
    };
};

// Middleware kiểm tra quyền sửa user
const kiemTraQuyenSuaUser = async (req, res, next) => {
    try {
        const { id } = req.params; // ID của user cần sửa
        const currentUserId = req.user.userId; // ID của user hiện tại

        // Tìm user hiện tại trong database
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông tin người dùng hiện tại' 
            });
        }

        // Tìm user cần sửa
        const userToEdit = await User.findById(id);
        if (!userToEdit) {
            return res.status(404).json({ 
                message: 'Không tìm thấy user cần sửa' 
            });
        }

        // Admin có thể sửa bất kỳ user nào
        if (currentUser.role === 'admin') {
            req.userInfo = currentUser;
            return next();
        }

        // Moderator chỉ có thể sửa user thường (không được sửa admin/moderator)
        if (currentUser.role === 'moderator') {
            if (userToEdit.role !== 'user') {
                return res.status(403).json({ 
                    message: 'Moderator chỉ có thể sửa user thường, không thể sửa admin hoặc moderator khác' 
                });
            }
            req.userInfo = currentUser;
            return next();
        }

        // User thường chỉ có thể sửa chính mình
        if (currentUserId === id) {
            req.userInfo = currentUser;
            return next();
        }

        // Không có quyền sửa user khác
        return res.status(403).json({ 
            message: 'Bạn chỉ có thể sửa thông tin của chính mình' 
        });

    } catch (error) {
        console.error('Lỗi khi kiểm tra quyền sửa user:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi kiểm tra quyền sửa user' 
        });
    }
};

module.exports = {
    kiemTraQuyenAdmin,
    kiemTraQuyenUserHoacAdmin,
    kiemTraQuyenXoaUser,
    kiemTraQuyenSuaUser,
    checkRole
};
