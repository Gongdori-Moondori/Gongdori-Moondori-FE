'use client';
import React from 'react';
import {
  IoCheckmarkCircle,
  IoTrashOutline,
  IoPencilOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from 'react-icons/io5';

interface EditableShoppingItemProps {
  item: string;
  index: number;
  isEditing: boolean;
  editingText: string;
  onStartEdit: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: (index: number) => void;
  onEditTextChange: (text: string) => void;
  onEditKeyPress: (e: React.KeyboardEvent) => void;
  onItemClick?: (item: string) => void; // 아이템 클릭 시 호출될 함수 (선택적)
  allowTextClick?: boolean; // 텍스트 클릭으로 편집 허용 여부
}

export default function EditableShoppingItem({
  item,
  index,
  isEditing,
  editingText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onEditTextChange,
  onEditKeyPress,
  onItemClick,
  allowTextClick = true,
}: EditableShoppingItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3 flex-1">
        <IoCheckmarkCircle className="text-primary-500" size={20} />
        {isEditing ? (
          <input
            type="text"
            value={editingText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={onEditKeyPress}
            className="flex-1 px-3 py-1 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <span
            className={`text-gray-800 flex-1 ${onItemClick ? 'cursor-pointer hover:text-primary-600' : allowTextClick ? 'cursor-pointer hover:text-primary-600' : ''} transition-colors`}
            onClick={() => {
              if (onItemClick) {
                onItemClick(item);
              } else if (allowTextClick) {
                onStartEdit(index);
              }
            }}
          >
            {item}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={onSaveEdit}
              className="text-primary-500 hover:text-primary-700 p-1"
              disabled={!editingText.trim()}
            >
              <IoCheckmarkOutline size={18} />
            </button>
            <button
              onClick={onCancelEdit}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <IoCloseOutline size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEdit(index)}
              className="text-primary-500 hover:text-primary-700 p-1"
            >
              <IoPencilOutline size={16} />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <IoTrashOutline size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
