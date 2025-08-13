import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  return (
    <div className="text-sm text-gray-500 mb-4 border-b border-gray-300 pb-2">
      <Link href="/" className="hover:underline">
        Home
      </Link>
      {items.map((item, index) => (
        <span key={index}>
          {" "}&gt;{" "}
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-green-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
