import BlogBasicInfo from "@/Components/admin/blog/BlogBasicInfo";
import BlogContentEditor from "@/Components/admin/blog/BlogContentEditor";

import React from "react";

interface BlogMainContentProps {
    formData: any;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleExcerptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function BlogMainContent({
    formData,
    handleTitleChange,
    handleSlugChange,
    handleExcerptChange,
    handleContentChange,
}: BlogMainContentProps) {
    return (
        <div className="lg:col-span-2 space-y-6">
            <BlogBasicInfo
                formData={formData}
                onTitleChange={handleTitleChange}
                onSlugChange={handleSlugChange}
                onExcerptChange={handleExcerptChange}
            />

            <BlogContentEditor
                content={formData.content}
                onChange={handleContentChange}
            />
        </div>
    );
}
