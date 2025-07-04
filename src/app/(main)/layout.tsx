import React from 'react';
import Navbar from '@/components/ui/Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
        </div>
    );
}

export default MainLayout;