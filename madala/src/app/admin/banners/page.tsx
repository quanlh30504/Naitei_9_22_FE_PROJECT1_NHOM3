import React from 'react';
import { AdminGuard } from '@/Components/admin/AdminGuard';
import { AdminLayout } from '@/Components/admin/AdminLayout';
import BannerManager from '@/Components/admin/banner/BannerManager';

export default function BannersAdminPage() {
    return (
        <AdminGuard>
            <AdminLayout>
                <div className="space-y-6">
                    <BannerManager />
                </div>
            </AdminLayout>
        </AdminGuard>
    );
}
