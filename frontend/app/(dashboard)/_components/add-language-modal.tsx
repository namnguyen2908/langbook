'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from '@phosphor-icons/react';
import { apiPost } from '@/app/_lib/api';

const allLanguages = [
  { code: 'en', flag: '🇬🇧', name: 'Tiếng Anh', native: 'English' },
  { code: 'zh', flag: '🇨🇳', name: 'Tiếng Trung', native: '中文' },
  { code: 'ja', flag: '🇯🇵', name: 'Tiếng Nhật', native: '日本語' },
];

const levels = ['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

const levelLabels: Record<string, string> = {
  a0: 'Mới bắt đầu',
  a1: 'Sơ cấp',
  a2: 'Cơ bản',
  b1: 'Trung cấp',
  b2: 'Trung cao',
  c1: 'Cao cấp',
  c2: 'Thành thạo',
};

interface Props {
  open: boolean;
  existingCodes: string[];
  onClose: () => void;
  onAdded: () => void;
}

export function AddLanguageModal({ open, existingCodes, onClose, onAdded }: Props) {
  const [step, setStep] = useState<'language' | 'level'>('language');
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('a0');
  const [saving, setSaving] = useState(false);

  const available = allLanguages.filter((l) => !existingCodes.includes(l.code));

  function handleLangPick(code: string) {
    setSelectedLang(code);
    setStep('level');
  }

  async function handleConfirm() {
    if (!selectedLang) return;
    setSaving(true);
    try {
      await apiPost('/user-languages', {
        languageCode: selectedLang,
        currentLevel: selectedLevel,
      });
      onAdded();
      handleReset();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setStep('language');
    setSelectedLang(null);
    setSelectedLevel('a0');
    onClose();
  }

  const header = step === 'language' ? 'Chọn ngôn ngữ' : 'Trình độ hiện tại';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={handleReset}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm rounded-[14px] border border-neutral-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="text-base font-semibold text-neutral-900">{header}</h2>
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-4 w-4" weight="bold" />
              </button>
            </div>

            <div className="px-6 py-5">
              {step === 'language' ? (
                <div className="flex flex-col gap-2">
                  {available.length === 0 ? (
                    <p className="py-4 text-center text-sm text-neutral-400">
                      Bạn đã thêm tất cả ngôn ngữ
                    </p>
                  ) : (
                    available.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangPick(lang.code)}
                        className="flex items-center gap-4 rounded-[10px] border border-neutral-200 px-4 py-3 text-left transition-all duration-150 hover:border-brand-200 hover:bg-brand-50"
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{lang.name}</p>
                          <p className="text-xs text-neutral-500">{lang.native}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`flex items-center justify-between rounded-[10px] border px-4 py-3 text-left transition-all duration-150 ${
                        selectedLevel === level
                          ? 'border-brand-200 bg-brand-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {level.toUpperCase()}
                        </p>
                        <p className="text-xs text-neutral-500">{levelLabels[level]}</p>
                      </div>
                      {selectedLevel === level && (
                        <Check className="h-4 w-4 text-brand-500" weight="bold" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {step === 'level' && (
              <div className="flex justify-end gap-3 border-t border-neutral-100 px-6 py-4">
                <button
                  onClick={() => setStep('language')}
                  className="rounded-[10px] px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={saving}
                  className="rounded-[10px] bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-brand-600 active:scale-[0.97] disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
