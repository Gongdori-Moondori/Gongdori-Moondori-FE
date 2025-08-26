import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  title = '지금 전체 상품을 이용하며',
}: ErrorDisplayProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🛒</span>
        <span className="font-bold">{title}</span>
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <div className="text-red-500 mb-2">
          <svg
            className="w-6 h-6 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-sm mb-3">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
