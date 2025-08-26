import BackButton from './BackButton';

interface PageHeaderProps {
  title: string;
  rightElement?: React.ReactNode;
  className?: string;
  onBack?: () => void;
}

export default function PageHeader({
  title,
  rightElement,
  className = '',
  onBack,
}: PageHeaderProps) {
  return (
    <header
      className={`flex items-center justify-between p-4 border-b border-gray-200 ${className}`}
    >
      <BackButton onBack={onBack} />
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="w-10 flex justify-center">
        {rightElement || <div className="w-6 h-6" />}
      </div>
    </header>
  );
}
