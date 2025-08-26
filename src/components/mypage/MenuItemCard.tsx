'use client';

import { ReactNode } from 'react';

interface MenuItemCardProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
}

export default function MenuItemCard({
  icon,
  title,
  onClick,
}: MenuItemCardProps) {
  return (
    <div
      className="bg-white rounded-lg p-4 flex items-center justify-between touch-feedback cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-gray-800">{title}</span>
      </div>
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
}
