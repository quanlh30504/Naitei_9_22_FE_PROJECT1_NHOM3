'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng đến với trang quản trị Madala
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Hành động nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/users"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                  👥
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý Users
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thêm, sửa, xóa và quản lý thông tin người dùng
                </p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                  📦
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý Sản phẩm
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thêm, sửa, xóa và quản lý danh mục sản phẩm
                </p>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600 ring-4 ring-white">
                  🛒
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý Đơn hàng
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và xử lý các đơn hàng từ khách hàng
                </p>
              </div>
            </Link>

            <Link
              href="/admin/blogs"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                  📝
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý Blog
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo, chỉnh sửa và quản lý các bài viết blog
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
