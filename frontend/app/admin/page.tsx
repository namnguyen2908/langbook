'use client';

import { useEffect, useState } from 'react';
import { Key, Plug } from '@phosphor-icons/react';
import { Card } from '@/app/_components/ui/card';
import { useAuth } from '@/app/_components/providers/auth-provider';
import { apiGet } from '@/app/_lib/api';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<{ providers: number; keys: number } | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiGet('/admin/api-providers'),
      apiGet('/admin/api-keys'),
    ]).then(([providers, keys]) => {
      setStats({
        providers: Array.isArray(providers) ? providers.length : 0,
        keys: Array.isArray(keys) ? keys.length : 0,
      });
    }).catch(() => {});
  }, [token]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500">Quản lý API keys và providers</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-50">
              <Plug className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">Providers</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.providers ?? '...'}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-cyan-50">
              <Key className="h-6 w-6 text-accent-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-500">API Keys</p>
              <p className="text-2xl font-bold text-neutral-900">{stats?.keys ?? '...'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
