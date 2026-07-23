'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Plus, Lightning, ChartBar, Star } from '@phosphor-icons/react';
import { useAuth } from '@/app/_components/providers/auth-provider';
import { apiGet } from '@/app/_lib/api';
import { Card } from '@/app/_components/ui/card';
import { AddLanguageModal } from './_components/add-language-modal';


interface UserLanguage {
  id: string;
  languageCode: string;
  currentLevel: string;
  streakDays: number;
  totalXp: number;
}

const langMeta: Record<string, { flag: string; name: string; native: string }> = {
  en: { flag: '🇬🇧', name: 'Tiếng Anh', native: 'English' },
  zh: { flag: '🇨🇳', name: 'Tiếng Trung', native: '中文' },
  ja: { flag: '🇯🇵', name: 'Tiếng Nhật', native: '日本語' },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [languages, setLanguages] = useState<UserLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLanguages = useCallback(async () => {
    try {
      const data = await apiGet('/user-languages');
      setLanguages(data as UserLanguage[]);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }
    if (user) fetchLanguages();
  }, [user, authLoading, router, fetchLanguages]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-neutral-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Chào, {user.name || user.email.split('@')[0]}!
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 sm:text-base">
          {languages.length === 0
            ? 'Hãy chọn ngôn ngữ để bắt đầu học'
            : 'Tiếp tục học tập nào'}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-neutral-400">Đang tải dữ liệu...</p>
        </div>
      ) : languages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Card className="flex flex-col items-center gap-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
              <Star className="h-8 w-8 text-brand-400" weight="fill" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Chưa có ngôn ngữ nào</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Thêm ngôn ngữ bạn muốn học để bắt đầu hành trình
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-[10px] bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-brand-600 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4" weight="bold" />
              Thêm ngôn ngữ
            </button>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {languages.map((lang) => {
            const meta = langMeta[lang.languageCode];
            return (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  hover
                  onClick={() => router.push(`/learn?lang=${lang.languageCode}`)}
                  className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex flex-col gap-4 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{meta?.flag}</span>
                      <div>
                        <p className="text-base font-semibold text-neutral-900">{meta?.name}</p>
                        <p className="text-xs text-neutral-500">{meta?.native}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                        {lang.currentLevel.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Lightning className="h-3.5 w-3.5 text-accent-500" weight="fill" />
                        {lang.streakDays} ngày
                      </span>
                      <span className="flex items-center gap-1">
                        <ChartBar className="h-3.5 w-3.5 text-brand-400" weight="fill" />
                        {lang.totalXp} XP
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {languages.length < 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setModalOpen(true)}
                className="flex h-full w-full items-center justify-center rounded-[14px] border-2 border-dashed border-neutral-200 py-10 text-sm font-medium text-neutral-400 transition-all duration-150 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
              >
                <div className="flex flex-col items-center gap-2">
                  <Plus className="h-5 w-5" weight="bold" />
                  <span>Thêm ngôn ngữ</span>
                </div>
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      <AddLanguageModal
        open={modalOpen}
        existingCodes={languages.map((l) => l.languageCode)}
        onClose={() => setModalOpen(false)}
        onAdded={fetchLanguages}
      />
    </div>
  );
}
