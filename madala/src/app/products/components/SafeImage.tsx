'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { getValidImageUrl } from '@/lib/utils';

interface SafeImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    fallbackClassName?: string;
    priority?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    fallbackClassName = '',
    priority = false
}) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Handle missing or invalid src
    if (hasError || !src) {
        return (
            <div 
                className={`bg-gray-200 flex items-center justify-center ${fallbackClassName || className}`}
                style={{ width, height }}
            >
                <div className="text-center">
                    <div className="text-gray-400 text-2xl mb-2">📷</div>
                    <span className="text-gray-500 text-xs">No Image</span>
                </div>
            </div>
        );
    }

    // Get the properly formatted image URL
    const imageUrl = getValidImageUrl(src);

    return (
        <div className="relative">
            {isLoading && (
                <div 
                    className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
                    style={{ width, height }}
                >
                    <div className="text-gray-400 text-xl">...</div>
                </div>
            )}
            <Image
                src={imageUrl}
                alt={alt}
                width={width}
                height={height}
                className={className}
                priority={priority}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('SafeImage - Failed to load:', imageUrl);
                    }
                    setHasError(true);
                    setIsLoading(false);
                }}
                style={{
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: isLoading ? 0 : 1
                }}
            />
        </div>
    );
};

export default SafeImage;
