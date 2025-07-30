"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const actionButtons = [
  {
    href: "/",
    text: "Quay về trang chủ",
    variant: "default" as const
  },
  {
    href: "/products", 
    text: "Xem sản phẩm",
    variant: "outline" as const
  }
];

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Trang không tìm thấy</h2>
          <p className="text-gray-600 mb-6">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <div className="space-y-4">
            {actionButtons.map((button, index) => (
              <Button key={index} variant={button.variant} asChild className="w-full">
                <Link href={button.href}>
                  {button.text}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
