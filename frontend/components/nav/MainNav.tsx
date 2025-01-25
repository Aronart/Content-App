'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

export const MainNav = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              Content App
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavItem href="/config">Configuration</NavItem>
                <NavItem href="/analytics">Analytics</NavItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
