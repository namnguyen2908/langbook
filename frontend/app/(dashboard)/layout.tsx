import { MainLayout } from '@/app/_components/layout/main-layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
