import { useSavingsStatistics } from '@/lib/api/hooks';

interface ProfileSectionProps {
  name: string;
  profileImage?: string;
  totalSavings: number;
}

export default function ProfileSection({
  name,
  profileImage = '/assets/userImage1.svg',
}: ProfileSectionProps) {
  const { data: savingsStatistics } = useSavingsStatistics();

  return (
    <div className="bg-white rounded-2xl p-6 text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white border-4 border-[#14b8a6] flex items-center justify-center">
        <img src={profileImage} alt="프로필" className="w-16 h-16" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">{name}님</h2>

      {/* 절약 금액 섹션 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/assets/money.svg" alt="돈" className="w-8 h-8" />
          <span className="text-sm text-gray-600">
            <span className="font-bold text-primary-500">알지</span>로 아낀 총
            할인금액은
          </span>
        </div>
        <p className="text-2xl font-bold text-primary-500">
          {savingsStatistics?.data.totalSavings.toLocaleString()}원{' '}
          <span className="text-sm font-normal text-gray-600">이에요!</span>
        </p>
      </div>
    </div>
  );
}
