import React from 'react';
import Image from 'next/image';

interface IconWithTitleProps {
  iconSrc: string;
  iconAlt: string;
  iconWidth?: number;
  iconHeight?: number;
  title: string;
  className?: string;
}

export default function IconWithTitle({
  iconSrc,
  iconAlt,
  iconWidth = 40,
  iconHeight = 40,
  title,
  className = '',
}: IconWithTitleProps) {
  return (
    <div className={`flex flex-col items-start gap-3 ${className}`}>
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={iconWidth}
        height={iconHeight}
      />
      <span className="font-semibold">{title}</span>
    </div>
  );
}
