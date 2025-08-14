import { useState, useCallback } from "react";
import { BlogFormData } from "@/types/blog";

export const useBlogForm = (initialData?: Partial<BlogFormData>) => {
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        tags: [],
        isPublished: false,
        isFeatured: false,
        ...initialData
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
        }));
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, slug: e.target.value }));
    };

    const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, excerpt: e.target.value }));
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, content: e.target.value }));
    };

    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, featuredImage: url }));
    };

    const handleTagsChange = (tags: string[]) => {
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleFeaturedChange = (featured: boolean) => {
        setFormData(prev => ({ ...prev, isFeatured: featured }));
    };

    const handlePublishedChange = (published: boolean) => {
        setFormData(prev => ({ ...prev, isPublished: published }));
    };

    const updateFormData = useCallback((data: Partial<BlogFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    }, []);

    return {
        formData,
        handleTitleChange,
        handleSlugChange,
        handleExcerptChange,
        handleContentChange,
        handleImageChange,
        handleTagsChange,
        handleFeaturedChange,
        handlePublishedChange,
        updateFormData,
        setFormData
    };
};