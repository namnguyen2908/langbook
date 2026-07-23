'use client';

import { motion } from 'motion/react';
import { LoginForm } from './login-form';

function DecorativeArt() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-sm" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ag" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle
        cx="240" cy="100" r="110" fill="url(#bg)"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="300" cy="80" r="75" fill="url(#ag)"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="190" cy="120" r="50" fill="url(#bg)"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="350" cy="130" r="30" fill="#8B5CF6" fillOpacity="0.08"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="140" cy="70" r="20" fill="#06B6D4" fillOpacity="0.08"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {[[180,50,6,"#8B5CF6",0.15],[280,150,5,"#06B6D4",0.12],[320,55,8,"#8B5CF6",0.1],[150,140,4,"#06B6D4",0.15]].map(([cx,cy,r,c,o],i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={r} fill={c as string} fillOpacity={o as number}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-50">
      {/* ── Background layers ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-brand-50 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent-50/60 blur-[100px]" />
        <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-brand-100/40 blur-[90px]" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(139,92,246,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Hero ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-[clamp(32px,6vw,52px)] font-bold tracking-tight leading-[1.1]"
          >
            <span className="text-neutral-900">Học ngoại ngữ</span>
            <br />
            <span className="text-neutral-900">thông minh hơn</span>
            <br />
            <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
              với AI
            </span>
          </motion.h1>

          {/* SVG art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="my-6 w-full"
          >
            <div className="flex justify-center">
              <DecorativeArt />
            </div>
          </motion.div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-md text-base leading-relaxed text-neutral-500"
          >
            LangBook dùng AI để tạo nội dung học tập theo đúng trình độ của bạn.
            Mỗi bài học, flashcard và quiz đều được cá nhân hoá — giúp bạn học
            tiếng Anh, Trung, Nhật hiệu quả hơn mỗi ngày.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 w-full max-w-sm"
          >
            <LoginForm />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
