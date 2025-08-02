// Script để tạo admin user đầu tiên
// Chạy: node scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - thay đổi theo config của bạn
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/madala';

// User Schema (copy từ model)
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    roles: {
      type: String, 
      default: 'user',
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Kiểm tra xem đã có admin chưa
    const existingAdmin = await User.findOne({ roles: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Thông tin admin user - thay đổi theo ý muốn
    const adminData = {
      name: 'Admin Madala',
      email: 'admin@madala.com',
      password: 'admin123456', // Đổi mật khẩu mạnh hơn
      roles: 'admin',
      image: null
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Tạo admin user
    const adminUser = new User({
      ...adminData,
      password: hashedPassword
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('⚠️  Remember to change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminUser();
