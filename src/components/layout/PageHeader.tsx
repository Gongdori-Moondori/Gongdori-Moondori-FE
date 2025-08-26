import BackButton from './BackButton';

interface PageHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  className?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  rightElement,
  className = '',
  onBack,
  showBackButton = true,
}: PageHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between p-4 border-b border-gray-200 ${className}`}
    >
      {showBackButton ? (
        <BackButton onBack={onBack} />
      ) : (
        <div className="w-10" />
      )}
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="w-10 flex justify-center">
        {rightElement || <div className="w-6 h-6" />}
      </div>
    </header>
  );
}
