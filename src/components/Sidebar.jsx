import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusCircle, Compass } from 'lucide-react';
import SortableNavItem from './SortableNavItem';

export default function Sidebar({ sectionOrder, setSectionOrder, onAddCustomSection, onRemoveCustomSection }) {
  // 定义传感：如何算作发生拖拽（鼠标点按 或者 键盘操作）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 必须至少移动 3 像素才算做开始拖拽，防止误触点击
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 当拖拽松手时：计算原来在哪里，被放到了哪里
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sectionOrder.findIndex((item) => item.id === active.id);
      const newIndex = sectionOrder.findIndex((item) => item.id === over.id);

      // 生成被交换排序后的新数组
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      
      // 更新全局顶层树
      setSectionOrder(newOrder);
    }
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50/50 flex flex-col h-full sticky top-16">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2 text-gray-800">
          <Compass className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-sm">板块导航</h2>
        </div>
        <button
          onClick={onAddCustomSection}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
          title="新增自定义排版板块"
        >
          <PlusCircle className="w-4 h-4" />
          <span>添加</span>
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sectionOrder.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sectionOrder.map((section) => (
                <SortableNavItem 
                  key={section.id} 
                  id={section.id} 
                  title={section.title} 
                  type={section.type}
                  onRemove={onRemoveCustomSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
