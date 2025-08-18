import { memo } from "react";

interface SectionTitleProps {
    title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
    return (
        <>
            <h2 className="text-lg font-semibold mb-2 text-gray-800 text-center">
                {title}
            </h2>

            <div className="flex justify-center mb-5">
                <div className="relative w-40 h-4 flex items-center justify-center">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300"></div>
                    <div className="relative z-10 bg-white px-2 flex gap-1">
                        <span className="text-gray-500 text-sm">///////</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(SectionTitle);
