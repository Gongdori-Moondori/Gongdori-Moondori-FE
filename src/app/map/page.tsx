'use client';

import PageHeader from '@/components/layout/PageHeader';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MapPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageHeader title="지도" />
      <main className="flex-1 p-6 pb-24">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold">지도</h2>
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default MapPage;
