"use client";
import Link from "next/link";
import SectionTitle from "./SectionTitle";

export default function AboutSection() {
  return (
    <div>
      <SectionTitle title="VỀ CHÚNG TÔI" />

      <p className="text-sm text-gray-600">
        GIỚI THIỆU CHUNG VỀ MỸ PHẨM HANDMADE MANDALA
      </p>
      <p className="mt-4 text-sm text-gray-600 text-justify">
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
        className="text-sm text-gray-800 hover:underline mt-2 inline-block"
      >
        Xem thêm
      </Link>
    </div>
  );
}
