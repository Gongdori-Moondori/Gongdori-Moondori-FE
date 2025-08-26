import MenuItemCard from './MenuItemCard';
import { ShoppingListIcon, HeartIcon, ChartIcon } from './MenuIcons';
import { MenuItem } from './types';

interface MenuSectionProps {
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  {
    id: 'shopping-list',
    title: '나의 장보기 리스트',
    icon: 'shopping-list',
  },
  {
    id: 'favorites',
    title: '즐겨찾기',
    icon: 'heart',
  },
  {
    id: 'frequently-purchased',
    title: '자주 구매한 상품',
    icon: 'chart',
  },
];

function getIconComponent(iconType: MenuItem['icon']) {
  switch (iconType) {
    case 'shopping-list':
      return <ShoppingListIcon />;
    case 'heart':
      return <HeartIcon />;
    case 'chart':
      return <ChartIcon />;
    default:
      return <ShoppingListIcon />;
  }
}

export default function MenuSection({
  menuItems = defaultMenuItems,
}: MenuSectionProps) {
  return (
    <div className="space-y-3">
      {menuItems.map((item) => (
        <MenuItemCard
          key={item.id}
          icon={getIconComponent(item.icon)}
          title={item.title}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
