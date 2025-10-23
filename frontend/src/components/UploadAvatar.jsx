import React, { useState, useRef } from 'react';
import api from '../services/api';
import './UploadAvatar.css';

const UploadAvatar = ({ currentUser, onAvatarUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentUser?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
        setIsSuccess(false);
        return;
      }

      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setMessage('Vui lòng chọn file hình ảnh.');
        setIsSuccess(false);
        return;
      }

      setSelectedFile(file);
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Vui lòng chọn file ảnh trước khi upload.');
      setIsSuccess(false);
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await api.post('/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setIsSuccess(true);
        setSelectedFile(null);
        
        // Cập nhật avatar cho user
        if (onAvatarUpdate) {
          onAvatarUpdate(response.data.data.user);
        }
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi upload. Vui lòng thử lại.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    setMessage('');

    try {
      const response = await api.delete('/avatar/remove');

      if (response.data.success) {
        setMessage(response.data.message);
        setIsSuccess(true);
        setPreview('');
        setSelectedFile(null);
        
        // Cập nhật avatar cho user
        if (onAvatarUpdate) {
          onAvatarUpdate(response.data.data.user);
        }
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Lỗi xóa avatar:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa avatar. Vui lòng thử lại.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(currentUser?.avatar || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessage('');
  };

  return (
    <div className="upload-avatar-container">
      <div className="upload-avatar-card">
        <h3>📸 Quản Lý Avatar</h3>
        
        {/* Hiển thị avatar hiện tại */}
        <div className="current-avatar">
          <h4>Avatar hiện tại:</h4>
          {preview ? (
            <div className="avatar-preview">
              <img src={preview} alt="Avatar hiện tại" />
            </div>
          ) : (
            <div className="no-avatar">
              <div className="no-avatar-icon">👤</div>
              <p>Chưa có avatar</p>
            </div>
          )}
        </div>

        {/* Upload form */}
        <div className="upload-form">
          <div className="file-input-container">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
              disabled={isUploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="select-file-btn"
              disabled={isUploading}
            >
              {selectedFile ? '📁 Đã chọn file' : '📁 Chọn ảnh mới'}
            </button>
          </div>

          {selectedFile && (
            <div className="file-info">
              <p><strong>Tên file:</strong> {selectedFile.name}</p>
              <p><strong>Kích thước:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Loại:</strong> {selectedFile.type}</p>
            </div>
          )}

          <div className="action-buttons">
            {selectedFile && (
              <>
                <button
                  onClick={handleUpload}
                  className="upload-btn"
                  disabled={isUploading}
                >
                  {isUploading ? '⏳ Đang upload...' : '⬆️ Upload Avatar'}
                </button>
                <button
                  onClick={handleClearSelection}
                  className="clear-btn"
                  disabled={isUploading}
                >
                  ❌ Hủy
                </button>
              </>
            )}
            
            {preview && !selectedFile && (
              <button
                onClick={handleRemoveAvatar}
                className="remove-btn"
                disabled={isUploading}
              >
                {isUploading ? '⏳ Đang xóa...' : '🗑️ Xóa Avatar'}
              </button>
            )}
          </div>
        </div>

        {/* Hiển thị thông báo */}
        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {isSuccess ? '✅' : '❌'} {message}
          </div>
        )}

        {/* Hướng dẫn */}
        <div className="instructions">
          <h4>📋 Hướng dẫn:</h4>
          <ul>
            <li>Chọn file ảnh có định dạng: JPG, PNG, GIF</li>
            <li>Kích thước file tối đa: 5MB</li>
            <li>Ảnh sẽ được tự động resize về kích thước 300x300px</li>
            <li>Ảnh sẽ được lưu trữ trên Cloudinary</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadAvatar;

