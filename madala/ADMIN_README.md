# Hệ thống Admin Madala

## Tổng quan
Hệ thống admin để quản lý users, sản phẩm và đơn hàng của shop Madala.

## Tính năng quản lý Users

### 1. Xem danh sách Users
- Hiển thị tất cả users với phân trang
- Tìm kiếm theo tên hoặc email
- Hiển thị thông tin: tên, email, role, ngày tạo
- Thống kê tổng quan: tổng users, admin users, user thường, users mới

### 2. Thêm User mới
- Form tạo user với validation
- Các trường: tên, email, mật khẩu, ảnh đại diện, role
- Tự động hash mật khẩu
- Kiểm tra email trùng lặp

### 3. Sửa thông tin User
- Cập nhật thông tin user
- Có thể thay đổi mật khẩu (tùy chọn)
- Validation dữ liệu đầu vào

### 4. Xóa User
- Xóa user với xác nhận
- Cập nhật lại thống kê

### 5. Quản lý Role
- Thay đổi role user/admin trực tiếp từ bảng
- Cập nhật real-time

## API Endpoints

### Users Management
```
GET /api/admin/users              # Lấy danh sách users
POST /api/admin/users             # Tạo user mới
GET /api/admin/users/[id]         # Lấy thông tin user
PUT /api/admin/users/[id]         # Cập nhật user
DELETE /api/admin/users/[id]      # Xóa user
PATCH /api/admin/users/[id]/role  # Cập nhật role
GET /api/admin/users/stats        # Lấy thống kê users
```

## Cấu trúc Files

```
src/
├── app/
│   ├── admin/                    # Admin pages
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Admin dashboard
│   │   └── users/
│   │       └── page.tsx         # Users management page
│   └── api/
│       └── admin/
│           └── users/           # User API routes
│               ├── route.ts     # GET, POST users
│               ├── [id]/
│               │   ├── route.ts # GET, PUT, DELETE user
│               │   └── role/
│               │       └── route.ts # PATCH user role
│               └── stats/
│                   └── route.ts # GET user stats
├── services/
│   └── userService.ts           # User business logic
├── Components/
│   └── AdminLink.tsx            # Admin navigation link
├── types/
│   └── admin.ts                 # TypeScript types
├── middleware.ts                # Route protection
└── scripts/
    └── create-admin.js          # Script tạo admin user
```

## Cài đặt và Sử dụng

### 1. Cấu hình môi trường
```bash
# Tạo file .env.local (copy từ .env.local.example)
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your-secret-key-here
AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Tạo Admin User đầu tiên
Có 3 cách để tạo admin user:

#### Cách 1: Tự động tạo admin qua API
```bash
# Truy cập URL này trong browser khi chạy npm run dev
http://localhost:3000/api/setup-admin
```
Sẽ tạo admin với:
- Email: admin@madala.com
- Password: admin123456

#### Cách 2: Đăng ký tài khoản rồi thay đổi role trong database
1. Truy cập `/register` để tạo tài khoản
2. Vào MongoDB và thay đổi field `roles` từ `"user"` thành `"admin"`

#### Cách 3: Trực tiếp thêm vào database
```javascript
// Thêm document vào collection users
{
  "name": "Admin",
  "email": "admin@yourdomain.com",
  "password": "$2a$12$hashedPasswordHere",
  "roles": "admin",
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### 3. Truy cập Admin
1. Đăng nhập với tài khoản admin
2. Truy cập `/admin` để vào dashboard
3. Chọn "Quản lý Users" để quản lý users

### 3. Bảo mật
- Middleware bảo vệ routes admin
- Chỉ users có role `admin` mới truy cập được
- JWT token authentication
- Password hashing với bcrypt

### 4. Validation
- Email format validation
- Password minimum length (6 chars)
- Required fields validation
- Unique email constraint

## Tùy chỉnh

### Thêm fields cho User
1. Cập nhật `User` model trong `src/models/User.ts`
2. Cập nhật `UserService` trong `src/services/userService.ts`
3. Cập nhật form trong `src/app/admin/users/page.tsx`
4. Cập nhật types trong `src/types/admin.ts`

### Thêm tính năng mới
1. Tạo API routes trong `src/app/api/admin/`
2. Tạo service functions
3. Tạo UI components
4. Cập nhật navigation

## Troubleshooting

### Lỗi không truy cập được admin
- Kiểm tra user có role `admin`
- Kiểm tra JWT token trong middleware
- Kiểm tra NEXTAUTH_SECRET trong .env

### Lỗi database
- Kiểm tra MONGODB_URI
- Kiểm tra connection string
- Kiểm tra MongoDB server running

### Lỗi validation
- Kiểm tra required fields
- Kiểm tra email format
- Kiểm tra password length

## Tính năng sắp tới
- [ ] Export users to CSV
- [ ] Bulk operations
- [ ] User activity logs  
- [ ] Advanced filtering
- [ ] Email notifications
- [ ] Profile picture upload
