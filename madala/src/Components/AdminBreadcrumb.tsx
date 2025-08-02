'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function AdminBreadcrumb() {
  const pathname = usePathname();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(path => path);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always include Dashboard as first item
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/admin'
    });
    
    // Build breadcrumbs based on path
    if (paths.length > 1) {
      for (let i = 1; i < paths.length; i++) {
        const path = paths[i];
        const href = '/' + paths.slice(0, i + 1).join('/');
        
        let label = '';
        switch (path) {
          case 'users':
            label = 'Quản lý Users';
            break;
          case 'products':
            label = 'Quản lý Sản phẩm';
            break;
          case 'orders':
            label = 'Quản lý Đơn hàng';
            break;
          case 'blogs':
            label = 'Quản lý Blog';
            break;
          default:
            label = path.charAt(0).toUpperCase() + path.slice(1);
        }
        
        breadcrumbs.push({
          label,
          href
        });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-500 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
