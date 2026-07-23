import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập — LangBook',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
