import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập — LangBook',
};

export default function LoginPage() {
  return <LoginForm />;
}
