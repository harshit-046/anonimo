'use client';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide NavBar on /signin and /signup
  const hideNav = pathname === '/signin' || pathname === '/signup';

  return (
    <>
      {!hideNav && <NavBar />}
      {children}
    </>
  );
}
