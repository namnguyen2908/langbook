'use client';

import { List, SignOut } from '@phosphor-icons/react';
import { useAuth } from '@/app/_components/providers/auth-provider';
import { Badge } from '@/app/_components/ui/badge';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-[10px] text-neutral-500 transition-all duration-150 hover:bg-neutral-100 hover:text-neutral-700 active:scale-[0.97] lg:hidden"
        aria-label="Mở menu"
      >
        <List className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        {user?.role === 'admin' && <Badge variant="accent">Admin</Badge>}

        <span className="hidden truncate text-sm font-medium text-neutral-700 sm:block">
          {user?.name || user?.email}
        </span>

        <button
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-neutral-500 transition-all duration-150 hover:bg-neutral-100 hover:text-error active:scale-[0.97]"
          aria-label="Đăng xuất"
        >
          <SignOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
