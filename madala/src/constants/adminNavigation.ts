import { 
  LayoutDashboard, 
  Package, 
  FolderTree,
  FileText, 
  Users, 
  Settings
} from 'lucide-react';

export const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Blog',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    title: 'Người dùng',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings,
  },
];

export type AdminNavItem = typeof adminNavItems[0];
