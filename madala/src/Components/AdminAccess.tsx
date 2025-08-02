'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminAccess({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      toast.error('Vui lòng đăng nhập để truy cập trang admin');
      router.push('/login');
      return;
    }

    const userRoles = (session.user as any)?.roles;
    if (userRoles !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang admin. Chỉ admin mới có thể truy cập.');
      router.push('/');
      return;
    }

    setIsChecking(false);
  }, [session, status, router]);

  if (status === 'loading' || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.roles !== 'admin') {
    return null; // Component will redirect, so don't render anything
  }

  return <>{children}</>;
}
