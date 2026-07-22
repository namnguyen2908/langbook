'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  BookOpenText,
  PuzzlePiece,
  Cards,
  ChartBar,
  X,
} from '@phosphor-icons/react';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: House },
  { href: '/learn', label: 'Học tập', icon: BookOpenText },
  { href: '/quiz', label: 'Quiz', icon: PuzzlePiece },
  { href: '/flashcard', label: 'Flashcard', icon: Cards },
  { href: '/vocabulary', label: 'Từ vựng', icon: ChartBar },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-brand-500">Lang</span>
          <span className="text-xl font-bold text-neutral-700">Book</span>
        </Link>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-[10px] text-neutral-500 hover:bg-neutral-200 lg:hidden"
          aria-label="Đóng menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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
    </div>
  );

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 border-r border-neutral-200 bg-neutral-100 lg:block">
        {sidebarContent}
      </aside>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-200 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200 bg-neutral-100 transition-transform duration-200 ease-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
