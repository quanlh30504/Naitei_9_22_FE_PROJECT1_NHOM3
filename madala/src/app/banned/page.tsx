export default function BannedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Tài khoản của bạn đã bị khóa</h1>
      <p className="text-lg text-gray-700 dark:text-gray-200 mb-8">Bạn đã bị ban bởi quản trị viên và không thể sử dụng website này.</p>
      <p className="text-gray-500 dark:text-gray-400">Nếu bạn nghĩ đây là nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ.</p>
    </div>
  );
}
