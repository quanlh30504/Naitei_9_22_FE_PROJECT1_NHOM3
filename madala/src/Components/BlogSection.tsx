"use client";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import blogImage from "../../public/blog-section-bourjois-velvet.jpg"

export default function BlogSection() {
  return (
    <div>
      <SectionTitle title="BLOG" />

      <div>
        <Image
          src={blogImage}
          alt="blog"
          className="w-full h-40 object-cover rounded-md mb-3"
        />
        <p className="text-sm font-semibold text-gray-800 ">
          Review son kem Bourjois Velvet
        </p>
        <p className="text-sm text-gray-600 mt-1 text-justify border-t border-gray-300 ">
          Hi, chào các nàng… sau nhiều lời hứa hão thì hôm nay tớ quay lại hâm
          nóng cái Blog này vào một ngày đầu hè nóng oi bứa, khi mà dân tình đổ
          xô nhau đi tắm Free để giải nhiệt.
        </p>
        <span className="mt-2 flex justify-between text-xs text-gray-500">
          {" "}
          Bởi NamTram (27/05/2015)
        </span>
        <div className="mt-2 flex justify-between text-xs text-gray-500 border-t border-gray-300">
          <span className="hover:underline cursor-pointer">Đọc thêm </span>
          <span className="hover:underline cursor-pointer">23 Bình luận</span>
        </div>
      </div>
    </div>
  );
}
