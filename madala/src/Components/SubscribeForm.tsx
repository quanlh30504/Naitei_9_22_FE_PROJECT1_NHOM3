"use client";

import { FaPaperPlane } from "react-icons/fa";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import SectionTitle from "./SectionTitle";

export default function SubscribeForm() {
  return (
    <div>
      <SectionTitle title="GỬI EMAIL CHO CHÚNG TÔI" />

      <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
        <p className="text-center text-3xl text-gray-500 font-bold mb-1">
          Gửi email
        </p>
        <p className="text-center text-lg text-gray-500 mb-4">
          để nhận những ưu đãi mới nhất
        </p>

        <form className="space-y-3 flex flex-col items-center">
          <div className="w-full space-y-1">
            <Label htmlFor="fullName">Họ tên*</Label>
            <Input id="fullName" type="text" placeholder="Nhập họ tên của bạn" required />
          </div>
          
          <div className="w-full space-y-1">
            <Label htmlFor="phone">Số điện thoại*</Label>
            <Input id="phone" type="tel" placeholder="Nhập số điện thoại" required />
          </div>
          
          <div className="w-full space-y-1">
            <Label htmlFor="email">Email*</Label>
            <Input id="email" type="email" placeholder="Nhập địa chỉ email" required />
          </div>

          <Button
            type="submit"
            variant="mandala"
            size="sm"
          >
            <FaPaperPlane />
            GỬI EMAIL
          </Button>
        </form>
      </div>
    </div>
  );
}
