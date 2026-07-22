'use client';

import { motion } from 'motion/react';
import { GoogleLogo, FacebookLogo } from '@phosphor-icons/react';

const langs = [
  { code: 'en', flag: '🇬🇧', name: 'Tiếng Anh' },
  { code: 'zh', flag: '🇨🇳', name: 'Tiếng Trung' },
  { code: 'ja', flag: '🇯🇵', name: 'Tiếng Nhật' },
];

export function LoginForm() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative overflow-hidden rounded-[14px] border border-neutral-200 bg-white shadow-lg "
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500" />

      <div className="flex flex-col items-center gap-8 px-8 pb-10 pt-12">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-4xl font-bold tracking-tight text-neutral-900"
          >
            LangBook
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mt-2 text-sm leading-relaxed text-neutral-500"
          >
            Học ngôn ngữ với nội dung AI cá nhân hoá
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex w-full flex-col gap-3"
        >
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-neutral-200 bg-white text-sm font-medium text-neutral-700 shadow-sm transition-all duration-150 hover:bg-neutral-50 hover:shadow-md active:scale-[0.97] "
          >
            <GoogleLogo className="h-5 w-5" weight="bold" />
            Tiếp tục với Google
          </a>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-neutral-200 bg-white text-sm font-medium text-neutral-700 shadow-sm transition-all duration-150 hover:bg-neutral-50 hover:shadow-md active:scale-[0.97] "
          >
            <FacebookLogo className="h-5 w-5" weight="bold" />
            Tiếp tục với Facebook
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs text-neutral-400">Học 3 ngôn ngữ</p>
          <div className="flex gap-4">
            {langs.map((lang) => (
              <span
                key={lang.code}
                className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 "
              >
                <span className="text-sm">{lang.flag}</span>
                {lang.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
