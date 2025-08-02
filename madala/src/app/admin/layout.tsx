import AdminAccess from '@/Components/AdminAccess';
import AdminBreadcrumb from '@/Components/AdminBreadcrumb';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAccess>
      <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                Madala Admin Dashboard
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/admin/users"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Quản lý Users
              </Link>
              <Link
                href="/admin/products"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Quản lý Sản phẩm
              </Link>
              <Link
                href="/admin/orders"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Quản lý Đơn hàng
              </Link>
              <Link
                href="/admin/blogs"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Quản lý Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <AdminBreadcrumb />
          {children}
        </div>
      </main>
    </div>
    </AdminAccess>
  );
}
