import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResumeData } from './hooks/useResumeData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';

/**
 * App 根组件
 * 作用：初始化整个页面布局，组装所有子组件并下发状态。
 * 新增了 PDF 打印支持。
 */
export default function App() {
  // 控制视图模式: 'split' | 'edit' | 'preview'
  const [viewMode, setViewMode] = useState('split');

  const { 
    resumeData, 
    updatePersonalInfo, 
    addCustomField,
    updateCustomField,
    removeCustomField,
    updateArrayItem,
    addArrayItem, 
    removeArrayItem, 
    fillExampleData, 
    clearData,
    importFromJson,
    addCustomSection,
    removeCustomSection,
    updateCustomSection,
    setSectionOrder
  } = useResumeData();

  // PDF 打印逻辑 (修正: 直接将 ref 绑定到外层的 div 容器上以确保 react-to-print 完美捕捉)
  const printRef = useRef(null);
  
  const handlePrint = useReactToPrint({
    contentRef: printRef, // 注意：react-to-print >= 3.0 更推荐使用 contentRef 而不是 content 函数
    documentTitle: resumeData.personalInfo.fullName ? `${resumeData.personalInfo.fullName}的简历` : 'Resume_Master',
    onAfterPrint: () => console.log('打印完成'), 
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 font-sans">
      {/* 顶部导航 */}
      <Header 
        onFillExample={fillExampleData} 
        onClearData={clearData} 
        onPrint={handlePrint}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAiParsed={importFromJson}
      />

      {/* 页面主体 */}
      <main className="max-w-[1600px] mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-64px)]">
        
        {/* 最左侧：大尺寸或者非预览模式下显示的 Sidebar 拖拽导航条 */}
        {(viewMode === 'split' || viewMode === 'edit') && (
           <Sidebar 
              sectionOrder={resumeData.sectionOrder}
              setSectionOrder={setSectionOrder}
              onAddCustomSection={addCustomSection}
              onRemoveCustomSection={removeCustomSection}
           />
        )}

        {/* 中间层：表单配置区 */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <section className={`${viewMode === 'edit' ? 'flex-1 max-w-4xl mx-auto' : 'w-[480px] flex-shrink-0'} h-full overflow-y-auto pr-2 custom-scrollbar`}>
            <div className="space-y-6">
              <ResumeForm 
                data={resumeData} 
                updatePersonalInfo={updatePersonalInfo} 
              addCustomField={addCustomField}
              updateCustomField={updateCustomField}
              removeCustomField={removeCustomField}
              updateArrayItem={updateArrayItem}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              updateCustomSection={updateCustomSection}
            />
          </div>
        </section>
        )}

        {/* 右侧：简历预览区 */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <section className="flex-1 h-full overflow-y-auto bg-gray-200/50 rounded-xl custom-scrollbar relative">
            {/* 修复背景无法延伸的问题：外层使用 w-full h-max py-8，并 flex 居中 */}
            <div className="w-full h-max min-h-full py-8 flex justify-center items-start">
              <div ref={printRef} className="w-full flex justify-center transition-all">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </section>
        )}
        
      </main>
    </div>
  );
}
