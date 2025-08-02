'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminLink() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  // Chỉ hiển thị link admin nếu user có role admin
  if (!session?.user || (session.user as any).roles !== 'admin') {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium bg-red-50 hover:bg-red-100 border border-red-200"
    >
      🛠️ Admin Dashboard
    </Link>
  );
}
