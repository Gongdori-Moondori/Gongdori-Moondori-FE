export interface MenuItem {
  id: string;
  title: string;
  icon: 'shopping-list' | 'heart' | 'chart';
  onClick?: () => void;
}

export interface UserProfile {
  name: string;
  profileImage?: string;
  totalSavings: number;
}
