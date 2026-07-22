'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useAuth } from '@/app/_components/providers/auth-provider';
import { Card } from '@/app/_components/ui/card';

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'Tiếng Anh', native: 'English', href: '/learn?lang=en' },
  { code: 'zh', flag: '🇨🇳', name: 'Tiếng Trung', native: '中文', href: '/learn?lang=zh' },
  { code: 'ja', flag: '🇯🇵', name: 'Tiếng Nhật', native: '日本語', href: '/learn?lang=ja' },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-neutral-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Chào, {user.name || user.email.split('@')[0]}!
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 sm:text-base">
          Bạn muốn học ngôn ngữ nào hôm nay?
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {languages.map((lang) => (
          <motion.div key={lang.code} variants={item}>
            <Card
              hover
              className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex flex-col items-center gap-4 py-8 text-center sm:py-10">
                <span className="text-5xl transition-transform duration-200 group-hover:scale-110 sm:text-6xl">
                  {lang.flag}
                </span>
                <div>
                  <p className="text-lg font-semibold text-neutral-900">
                    {lang.name}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-500">{lang.native}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 transition-colors duration-200 group-hover:bg-brand-100 ">
                  Bắt đầu
                  <span className="text-sm">→</span>
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
