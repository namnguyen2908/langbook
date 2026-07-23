'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/_components/providers/auth-provider';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const token = searchParams.get('token');
    if (token) {
      done.current = true;
      setAuth(token).then((user) => {
        router.replace(user?.role === 'admin' ? '/admin' : '/');
      });
    } else {
      router.replace('/login');
    }
  }, [searchParams, setAuth, router]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <p className="text-neutral-500">Đang đăng nhập...</p>
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
