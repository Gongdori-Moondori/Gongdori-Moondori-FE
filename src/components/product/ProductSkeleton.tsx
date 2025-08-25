import React from 'react';

interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded flex-1"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="space-y-1 mb-3">
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="flex justify-between">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
