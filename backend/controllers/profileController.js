const User = require('../models/user');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
        }
        console.log('📋 GET /profile - User data:', {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            hasAvatar: !!user.avatar
        });
        res.json({ message: 'Lấy thông tin profile thành công', user });
    } catch (error) {
        console.error('Lỗi khi lấy profile:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!name || !email) {
            return res.status(400).json({ message: 'Tên và email là bắt buộc' });
        }

        // Kiểm tra email trùng lặp (trừ chính user hiện tại)
        const existingUser = await User.findOne({ 
            email: email.toLowerCase().trim(),
            _id: { $ne: req.user.userId }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Email đã được sử dụng bởi tài khoản khác' });
        }

        // Build profile object
        const profileFields = {
            name: name.trim(),
            email: email.toLowerCase().trim()
        };
        if (age !== undefined && age !== null && age !== '') {
            profileFields.age = Number(age);
        }

        // Update user profile
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: profileFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
        }

        res.json({ 
            message: 'Cập nhật thông tin profile thành công', 
            user 
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật profile:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin profile' });
    }
};