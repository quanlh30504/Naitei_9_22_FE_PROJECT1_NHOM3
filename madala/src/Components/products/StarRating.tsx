import React from "react";
import { Star } from "lucide-react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export type StarRatingSize = 'xs' | 'sm' | 'md' | 'lg';

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: StarRatingSize;
    showValue?: boolean;
    reviewCount?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
    hoverRating?: number;
    setHoverRating?: (rating: number) => void;
    className?: string;
}

const sizeClasses = {
    xs: 'w-4 h-4 text-xs',
    sm: 'w-5 h-5 text-sm',
    md: 'w-6 h-6 text-base',
    lg: 'w-8 h-8 text-lg',
};

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    maxStars = 5,
    size = 'sm',
    showValue = false,
    reviewCount = 0,
    interactive = false,
    onRate,
    hoverRating = 0,
    setHoverRating,
    className = '',
}) => {
    // Render star for display (with half star)
    const renderDisplayStar = (index: number) => {
        const difference = rating - index;
        if (difference >= 1) {
            return <FaStar key={index} className={`${sizeClasses[size]} text-yellow-400`} />;
        } else if (difference >= 0.5) {
            return <FaStarHalfAlt key={index} className={`${sizeClasses[size]} text-yellow-400`} />;
        } else {
            return <FaStar key={index} className={`${sizeClasses[size]} text-gray-300`} />;
        }
    };

    // Render star for interactive rating
    const renderInteractiveStar = (index: number) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        return (
            <button
                key={index}
                type="button"
                aria-label={`Chọn ${starValue} sao`}
                className={`transition-all flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 dark:focus-visible:ring-lime-400/60 ${sizeClasses[size]} ${isFilled ? 'scale-110' : 'scale-100'} ${isFilled ? 'bg-yellow-100 dark:bg-yellow-900' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} ${className}`}
                onMouseEnter={() => setHoverRating && setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating && setHoverRating(0)}
                onClick={() => onRate && onRate(starValue)}
            >
                <Star
                    className={`transition-colors duration-200 ${sizeClasses[size]} ${isFilled ? 'fill-yellow-400 text-yellow-400 drop-shadow dark:fill-yellow-300 dark:text-yellow-300' : 'text-gray-300 dark:text-gray-500'}`}
                />
            </button>
        );
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex">
                {Array.from({ length: maxStars }).map((_, index) =>
                    interactive
                        ? renderInteractiveStar(index)
                        : renderDisplayStar(index)
                )}
            </div>
            {showValue && (
                <span className={`text-gray-600 ${sizeClasses[size]}`}>
                    ({rating.toFixed(1)})
                    {reviewCount > 0 && (
                        <span className="text-gray-500"> • {reviewCount} đánh giá</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default StarRating;
