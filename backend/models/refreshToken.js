const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { 
      type: String, 
      required: true, 
      unique: true,
      index: true // Index để tìm kiếm nhanh
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true
    },
    expiresAt: { 
      type: Date, 
      required: true,
      index: true // Index để xóa token hết hạn
    },
    createdByIp: { 
      type: String 
    },
    revokedAt: { 
      type: Date 
    },
    revokedByIp: { 
      type: String 
    },
    replacedByToken: { 
      type: String 
    }
  },
  { 
    timestamps: true 
  }
);

// Virtual để check token còn active không
refreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expiresAt;
});

refreshTokenSchema.virtual('isActive').get(function() {
  return !this.revokedAt && !this.isExpired;
});

// Method để revoke token
refreshTokenSchema.methods.revoke = function(ip, replacedByToken) {
  this.revokedAt = Date.now();
  this.revokedByIp = ip;
  if (replacedByToken) {
    this.replacedByToken = replacedByToken;
  }
  return this.save();
};

// Index compound để query hiệu quả
refreshTokenSchema.index({ userId: 1, expiresAt: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);

