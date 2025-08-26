interface ActionButtonsProps {
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export default function ActionButtons({
  onLogout,
  onDeleteAccount,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      <button
        className="mobile-button touch-feedback w-full bg-gray-400 text-white py-4 rounded-lg font-medium"
        onClick={onLogout}
      >
        로그아웃
      </button>

      <button
        className="mobile-button touch-feedback w-full py-3 rounded-lg font-medium text-gray-600 text-sm border-none bg-transparent"
        onClick={onDeleteAccount}
      >
        계정 삭제 하기
      </button>
    </div>
  );
}
