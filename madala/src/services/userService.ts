import User, { IUser } from '@/models/User';
import connectToDB from '@/lib/db';
import bcrypt from 'bcryptjs';

export class UserService {
  // Lấy tất cả users với phân trang và tìm kiếm
  static async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    try {
      await connectToDB();
      
      const skip = (page - 1) * limit;
      let query = {};
      
      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { roles: { $regex: search, $options: 'i' } }
          ]
        };
      }
      
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await User.countDocuments(query);
      
      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Lấy user theo ID
  static async getUserById(id: string) {
    try {
      await connectToDB();
      const user = await User.findById(id).select('-password').lean();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // Tạo user mới
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
    image?: string;
    roles?: string;
  }) {
    try {
      await connectToDB();
      
      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Tạo user mới
      const user = new User({
        ...userData,
        password: hashedPassword,
        roles: userData.roles || 'user'
      });
      
      await user.save();
      
      // Return user without password
      const userObject = user.toObject();
      delete userObject.password;
      
      return userObject;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Cập nhật user
  static async updateUser(id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    image?: string;
    roles?: string;
  }) {
    try {
      await connectToDB();
      
      // Kiểm tra user tồn tại
      const existingUser = await User.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }
      
      // Kiểm tra email unique nếu có thay đổi
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await User.findOne({ email: userData.email });
        if (emailExists) {
          throw new Error('User with this email already exists');
        }
      }
      
      // Hash password nếu có thay đổi
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12);
      }
      
      // Cập nhật user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      ).select('-password').lean();
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Xóa user
  static async deleteUser(id: string) {
    try {
      await connectToDB();
      
      const deletedUser = await User.findByIdAndDelete(id).select('-password');
      if (!deletedUser) {
        throw new Error('User not found');
      }
      
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Lấy thống kê users
  static async getUserStats() {
    try {
      await connectToDB();
      
      const totalUsers = await User.countDocuments();
      const adminUsers = await User.countDocuments({ roles: 'admin' });
      const regularUsers = await User.countDocuments({ roles: 'user' });
      
      // Users được tạo trong 30 ngày qua
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      // Users được tạo trong 7 ngày qua
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weeklyUsers = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });
      
      return {
        totalUsers,
        adminUsers,
        regularUsers,
        recentUsers,
        weeklyUsers,
        userGrowth: {
          weekly: weeklyUsers,
          monthly: recentUsers
        }
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }

  // Cập nhật role của user
  static async updateUserRole(id: string, role: string) {
    try {
      await connectToDB();
      
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { roles: role } },
        { new: true, runValidators: true }
      ).select('-password').lean();
      
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
}
