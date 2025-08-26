'use client';

import BottomNavigation from '@/components/layout/BottomNavigation';
import PageHeader from '@/components/layout/PageHeader';
import {
  ProfileSection,
  MenuSection,
  ActionButtons,
  type UserProfile,
  type MenuItem,
} from '@/components/mypage';

export default function MyPage() {
  // 사용자 프로필 데이터
  const userProfile: UserProfile = {
    name: '이예림',
    profileImage: '/assets/userImage1.svg',
    totalSavings: 14543230000,
  };

  // 메뉴 아이템 데이터 (필요시 커스텀 가능)
  const menuItems: MenuItem[] = [
    {
      id: 'shopping-list',
      title: '나의 장보기 리스트',
      icon: 'shopping-list',
      onClick: () => {
        window.location.href = '/mypage/shopping-list';
      },
    },
    {
      id: 'favorites',
      title: '즐겨찾기',
      icon: 'heart',
      onClick: () => {
        window.location.href = '/mypage/favorites';
      },
    },
    {
      id: 'frequently-purchased',
      title: '자주 구매한 상품',
      icon: 'chart',
      onClick: () => {
        window.location.href = '/mypage/frequently-purchased';
      },
    },
  ];

  // 액션 핸들러들
  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log('로그아웃 클릭');
  };

  const handleDeleteAccount = () => {
    // TODO: 계정 삭제 로직 구현
    console.log('계정 삭제 클릭');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-foreground">
      {/* 헤더 */}
      <PageHeader title="내정보" className="bg-white" />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6 pb-20">
        <div className="space-y-6">
          {/* 프로필 섹션 */}
          <ProfileSection
            name={userProfile.name}
            profileImage={userProfile.profileImage}
            totalSavings={userProfile.totalSavings}
          />

          {/* 메뉴 섹션 */}
          <MenuSection menuItems={menuItems} />

          {/* 액션 버튼들 */}
          <ActionButtons
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}
