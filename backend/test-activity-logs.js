// backend/test-activity-logs.js
// SV3: Test script để kiểm tra lưu và truy vấn activity logs

const mongoose = require('mongoose');
const ActivityLog = require('./models/activityLog');
require('dotenv').config();

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 
      'mongodb+srv://tranminhkhang05121964_db_user:CuGgfSW59SWTz9Hz@cluster0.lwvtbtn.mongodb.net/groupDB?retryWrites=true&w=majority&appName=groupDB'
    );
    console.log('✅ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

async function testActivityLogs() {
  console.log('🧪 Testing Activity Logs Functionality');
  console.log('==========================================\n');

  try {
    await connectDB();

    // 1. Test tạo log mới
    console.log('📋 Bước 1: Tạo activity log mới...');
    const testLog = await ActivityLog.create({
      userId: new mongoose.Types.ObjectId(),
      userEmail: 'test@example.com',
      userName: 'Test User',
      action: 'login',
      ipAddress: '127.0.0.1',
      userAgent: 'Test User Agent',
      endpoint: '/auth/login',
      method: 'POST',
      statusCode: 200,
      success: true
    });
    console.log('✅ Đã tạo log:', testLog._id);
    console.log('   Action:', testLog.action);
    console.log('   User:', testLog.userEmail);
    console.log('   Timestamp:', testLog.createdAt);

    // 2. Test truy vấn logs
    console.log('\n📋 Bước 2: Truy vấn logs...');
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    console.log(`✅ Tìm thấy ${logs.length} logs gần đây:`);
    logs.forEach((log, index) => {
      console.log(`   ${index + 1}. ${log.action} - ${log.userEmail || 'N/A'} - ${log.createdAt}`);
    });

    // 3. Test truy vấn logs theo action
    console.log('\n📋 Bước 3: Truy vấn logs theo action "login"...');
    const loginLogs = await ActivityLog.find({ action: 'login' })
      .sort({ createdAt: -1 })
      .limit(5);
    console.log(`✅ Tìm thấy ${loginLogs.length} login logs`);

    // 4. Test thống kê
    console.log('\n📋 Bước 4: Thống kê logs...');
    const totalLogs = await ActivityLog.countDocuments();
    const successLogs = await ActivityLog.countDocuments({ success: true });
    const failedLogs = await ActivityLog.countDocuments({ success: false });
    
    console.log('✅ Thống kê:');
    console.log('   Tổng số logs:', totalLogs);
    console.log('   Thành công:', successLogs);
    console.log('   Thất bại:', failedLogs);

    // 5. Test aggregation - thống kê theo action
    console.log('\n📋 Bước 5: Thống kê theo action...');
    const actionStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: ['$success', 1, 0] }
          },
          failureCount: {
            $sum: { $cond: ['$success', 0, 1] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('✅ Thống kê theo action:');
    actionStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} (Thành công: ${stat.successCount}, Thất bại: ${stat.failureCount})`);
    });

    // 6. Test query logs trong khoảng thời gian
    console.log('\n📋 Bước 6: Truy vấn logs trong 24h gần đây...');
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    
    const recentLogs = await ActivityLog.countDocuments({
      createdAt: { $gte: last24Hours }
    });
    console.log(`✅ Có ${recentLogs} logs trong 24h gần đây`);

    // 7. Test getLogSummary static method
    console.log('\n📋 Bước 7: Test getLogSummary method...');
    if (testLog.userId) {
      const summary = await ActivityLog.getLogSummary(testLog.userId, 7);
      console.log('✅ Summary cho user:', summary);
    }

    console.log('\n✅ TEST THÀNH CÔNG!');
    console.log('==========================================');

    // Cleanup - xóa test log
    await ActivityLog.findByIdAndDelete(testLog._id);
    console.log('\n🧹 Đã xóa test log');

  } catch (error) {
    console.error('❌ Lỗi khi test:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB');
    process.exit(0);
  }
}

// Chạy test
testActivityLogs();
