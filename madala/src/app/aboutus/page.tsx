"use client";
import Image from "next/image";
import { useState, useCallback, memo, useMemo } from "react";
import Breadcrumb from "@/Components/Breadcrumb";
import { Button } from "@/Components/ui/button";
import aboutUsImg from "../../../public/about-us.jpg";

function AboutUsPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoize full content to prevent recalculation
  const fullContent = useMemo(() => `Hi, chào các nàng ... sau khi nhiều lần lũi lũi hóa hơ thơm nay tớ quay lại hăm nóng cái Blog này vào một ngày đầu hè thiệt nóng bức, mà tình cờ xô nhau đã đâm Free để giải nhiệt...

  Mandala Store được thành lập từ năm 2020 với sứ mệnh mang đến những sản phẩm mỹ phẩm handmade chất lượng cao, an toàn cho làn da của phụ nữ Việt Nam. Chúng tôi tin rằng vẻ đẹp tự nhiên là vẻ đẹp bền vững nhất.

  Với đội ngũ chuyên gia có nhiều năm kinh nghiệm trong lĩnh vực làm đẹp, chúng tôi không ngừng nghiên cứu và phát triển các sản phẩm từ những nguyên liệu thiên nhiên tốt nhất. Mỗi sản phẩm của Mandala đều được chế tác tỉ mỉ, cẩn thận với công thức độc quyền được phát triển riêng.

  Không chỉ đơn thuần là những sản phẩm làm đẹp, Mandala Store còn mong muốn trở thành người bạn đồng hành đáng tin cậy trong hành trình chăm sóc sắc đẹp của mỗi phụ nữ. Chúng tôi cam kết mang đến những trải nghiệm mua sắm tuyệt vời nhất cho khách hàng.`, []);

  // Memoize short content calculation
  const shortContent = useMemo(() => fullContent.substring(0, 200) + "...", [fullContent]);

  // Memoize toggle function
  const toggleContent = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Memoize display content
  const displayContent = useMemo(() => {
    return isExpanded ? fullContent : shortContent;
  }, [isExpanded, fullContent, shortContent]);
  return (
    <main>
      <div className="px-4 md:px-20 py-10 bg-white">
        <Breadcrumb items={[{ label: "Về chúng tôi" }]} />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">VỀ CHÚNG TÔI</h1>

        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-shrink-0 w-full md:w-1/2">
            <Image
              src={aboutUsImg}
              alt="Giới thiệu"
              className="rounded-md w-full h-auto object-cover"
              priority
            />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              GIỚI THIỆU CHUNG VỀ MỸ PHẨM HANDMADE MANDALA
            </h2>

            <p className="text-gray-600 text-justify leading-relaxed whitespace-pre-line">
              {displayContent}
            </p>

            <Button
              onClick={toggleContent}
              variant="link"
              className="mt-4 text-green-600 hover:text-green-700 p-0 h-auto font-medium"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(AboutUsPage);
