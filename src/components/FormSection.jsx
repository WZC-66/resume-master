import { Plus } from 'lucide-react';

/**
 * FormSection 组件
 * 作用：统一列表类表单（如教育经历、工作经验）的外部容器和“添加”按钮的 UI。
 */
export default function FormSection({ title, icon: Icon, onAdd, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          {title}
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        )}
      </div>
      
      {/* 渲染具体的列表表单项 */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
