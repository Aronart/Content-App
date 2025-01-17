'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                href="/config/source-configs"
                className={
                  pathname === '/config/source-configs'
                    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-indigo-600'
                    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              >
                Sources
              </Link>
              <Link
                href="/config/editing-pipelines"
                className={
                  pathname === '/config/editing-pipelines'
                    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-indigo-600'
                    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              >
                Pipelines
              </Link>
              <Link
                href="/config/destination-accounts"
                className={
                  pathname === '/config/destination-accounts'
                    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-indigo-600'
                    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              >
                Destinations
              </Link>
              <Link
                href="/config/content-flows"
                className={
                  pathname === '/config/content-flows'
                    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-indigo-600'
                    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              >
                Flows
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}