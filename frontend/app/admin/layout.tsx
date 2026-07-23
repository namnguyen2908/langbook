'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Gauge, Plug, SignOut, List } from '@phosphor-icons/react';
import { useAuth } from '@/app/_components/providers/auth-provider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.replace('/');
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Đang tải...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Gauge },
    { href: '/admin/providers', label: 'Providers', icon: Plug },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
        <Link href="/admin" className="flex items-center gap-1">
          <span className="text-xl font-bold text-brand-500">Lang</span>
          <span className="text-xl font-bold text-neutral-700">Book</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-neutral-500 hover:bg-neutral-200 lg:hidden"
          aria-label="Đóng menu"
        >
          <List className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'
              }`}
            >
              <item.icon className="h-5 w-5" weight={active ? 'fill' : 'regular'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-[10px] px-4 py-2.5 text-sm font-medium text-neutral-500 transition-all duration-150 hover:bg-neutral-200 hover:text-error"
        >
          <SignOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-neutral-500 shadow-md transition-all duration-150 hover:bg-neutral-100 active:scale-[0.97] lg:hidden"
        aria-label="Mở menu"
      >
        <List className="h-5 w-5" />
      </button>

      <aside className="hidden w-64 flex-shrink-0 border-r border-neutral-200 bg-neutral-100 lg:block">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 lg:hidden ${
          sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200 bg-neutral-100 transition-transform duration-200 ease-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
