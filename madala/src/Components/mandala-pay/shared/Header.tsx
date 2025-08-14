'use client';

import { Bell, History, QrCode, LucideProps } from 'lucide-react';
import MandalaPayLogo from './MandalaPayLogo';
import { Button } from '@/Components/ui/button';
import Link from 'next/link';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface HeaderAction {
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    ariaLabel: string;
}

const headerActions: HeaderAction[] = [
    { href: '/notifications', icon: Bell, ariaLabel: 'Thông báo' },
    { href: '/history', icon: History, ariaLabel: 'Lịch sử giao dịch' },
    { href: '/scan-qr', icon: QrCode, ariaLabel: 'Quét mã QR' },
];


const HeaderActionIcon = ({ href, icon: Icon, ariaLabel }: HeaderAction) => (
    <Button variant="ghost" size="icon" aria-label={ariaLabel} asChild>
        <Link href={href}>
            <Icon className="w-5 h-5" />
        </Link>
    </Button>
);


const Header = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto">
                <MandalaPayLogo />
                <div className="flex items-center space-x-2">
                    {headerActions.map((action) => (
                        <HeaderActionIcon key={action.href} {...action} />
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
