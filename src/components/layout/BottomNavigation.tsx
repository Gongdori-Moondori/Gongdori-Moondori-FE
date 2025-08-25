'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiHomeSmile2Line, RiHomeSmile2Fill } from 'react-icons/ri';
import { BiFullscreen } from 'react-icons/bi';
import { RiDashboardLine, RiDashboardFill } from 'react-icons/ri';
import { RiUser3Line, RiUser3Fill } from 'react-icons/ri';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon?: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: '홈',
    icon: RiHomeSmile2Line,
    activeIcon: RiHomeSmile2Fill,
  },
  {
    href: '/scan',
    label: '스캔하기',
    icon: BiFullscreen,
  },
  {
    href: '/category',
    label: '카테고리',
    icon: RiDashboardLine,
    activeIcon: RiDashboardFill,
  },
  {
    href: '/mypage',
    label: '마이페이지',
    icon: RiUser3Line,
    activeIcon: RiUser3Fill,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav safe-area-bottom">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent =
            isActive && item.activeIcon ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="touch-feedback flex flex-col items-center p-2 rounded-lg transition-colors"
            >
              <div
                className={`p-1 rounded-lg mb-1 transition-colors ${
                  isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-400'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-blue-500 font-medium' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
