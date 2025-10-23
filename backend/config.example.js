// File cấu hình mẫu - copy thành config.js và điền thông tin thực
module.exports = {
  // Cấu hình Email (Gmail)
  email: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Sử dụng App Password của Gmail
  },
  
  // Cấu hình Cloudinary
  cloudinary: {
    cloud_name: 'your-cloud-name',
    api_key: 'your-api-key',
    api_secret: 'your-api-secret'
  },
  
  // Cấu hình JWT
  jwt: {
    secret: 'your-jwt-secret-key'
  }
};

