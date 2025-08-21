'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Eye } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import BannerSlider from '@/Components/banner/BannerSlider';

interface BannerPreviewProps {
    type: 'sale' | 'advertisement';
    trigger?: React.ReactNode;
}

export default function BannerPreview({ type, trigger }: BannerPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);

    const defaultTrigger = (
        <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Xem trước Slider
        </Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Xem trước Banner Slider - {type === 'sale' ? 'Sale' : 'Advertisement'}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <BannerSlider
                            type={type}
                            autoPlay={true}
                            autoPlayInterval={3000}
                            showControls={true}
                            showIndicators={true}
                            className="w-full"
                        />
                    </motion.div>

                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h3 className="font-semibold text-sm mb-2">Tính năng Slider:</h3>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Tự động chuyển slide sau 5 giây</li>
                            <li>• Điều khiển prev/next khi hover</li>
                            <li>• Indicators để chuyển slide trực tiếp</li>
                            <li>• Nút play/pause để điều khiển tự động</li>
                            <li>• Hiển thị thông tin banner và counter</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
