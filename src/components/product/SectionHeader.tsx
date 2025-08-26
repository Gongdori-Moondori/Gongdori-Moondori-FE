import React from 'react';
import IconWithTitle from '@/components/ui/IconWithTitle';

interface SectionHeaderProps {
  maxSavings: number;
  marketName?: string;
  title?: string;
  subtitle?: string;
}

export default function SectionHeader({
  maxSavings,
  marketName,
  title,
  subtitle = '대형마트보다 최대',
}: SectionHeaderProps) {
  const defaultTitle = marketName
    ? `지금 ${marketName}을 이용하면`
    : '지금 전통시장을 이용하면';
  const displayTitle = title || defaultTitle;
  return (
    <>
      <IconWithTitle
        iconSrc="/assets/cart.svg"
        iconAlt="카트"
        title={displayTitle}
      />
      <p className="text-lg text-gray-500 font-medium ">
        {subtitle}{' '}
        <span className="text-primary-400 font-semibold">
          {maxSavings.toLocaleString()}원
        </span>
        이 싸요
      </p>
    </>
  );
}
