"use client";
import Link from "next/link";
import SectionTitle from "./SectionTitle";

export default function AboutSection() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700/50 p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-600/50 hover:-translate-y-1 transition-all duration-300">
      <SectionTitle title="VỀ CHÚNG TÔI" />

      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">
        GIỚI THIỆU CHUNG VỀ MỸ PHẨM HANDMADE MANDALA
      </p>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
        Hi, chào các nàng… sau nhiều lời hứa hão thì hôm nay tớ quay lại hâm
        nóng cái Blog này vào một ngày đầu hè nóng oi bức, khi mà dân tình xô
        nhai đi tắm Free để giải nhiệt. Hi, chào các nàng,... sau khá nhiều lời
        hứa hõa thì hôm nay tớ quay lại hâm nóng cái Blog này vào một ngày đầu
        hè nóng oi bức, khi mà dân tình xô nhai đi tắm Free để giải nhiệt. sau
        khá nhiều lời hứa hão thì hôm nay tớ quay lại hâm nóng cái Blog này vào
        một ngày đầu hè nóng oi bức, khi mà dân tình xô nhai đi tắm Free để giải
        nhiệt.
      </p>
      <Link
        href="/aboutus"
        className="text-sm text-[#8BC34A] dark:text-[#9CCC65] hover:text-[#7CB342] dark:hover:text-[#8BC34A] hover:underline mt-4 inline-block font-medium transition-colors"
      >
        Xem thêm →
      </Link>
    </div>
  );
}
