import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

export default function SortableNavItem({ id, title, type, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`
        group flex items-center justify-between p-3 mb-2 rounded-lg border bg-white
        transition-all shadow-sm hover:shadow-md cursor-default
        ${isDragging ? 'opacity-50 border-blue-400 scale-[1.02] shadow-xl z-50' : 'border-gray-200'}
      `}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {/* 拖拽把手区 */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-gray-700 truncate select-none">
          {title}
        </span>
      </div>

      {/* 当属于用户自定义生成的板块时，才展示删除按钮 */}
      {type === 'custom' && (
        <button
          onClick={() => onRemove(id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
          title="删除此自定义板块"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
