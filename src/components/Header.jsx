import { useRef, useState } from 'react';
import { Download, Sparkles, Trash2, Wand2, FileSearch, Settings } from 'lucide-react';
import ApiKeyModal from './ApiKeyModal';
import { extractTextFromPDF } from '../utils/pdfParser';
import { extractTextFromDOCX } from '../utils/docxParser';
import { parseResumeWithAI } from '../utils/aiClient';

/**
 * Header 组件
 * 作用：展示 Logo 和顶部操作区（如一键填充、清空、PDF导出按钮）。
 */
export default function Header({ onFillExample, onClearData, onPrint, viewMode, setViewMode, onAiParsed }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 清空 file input，以便下次同名文件能再次触发 change
    e.target.value = '';

    const apiKey = localStorage.getItem('resume_ai_api_key');
    if (!apiKey) {
      alert('请先配置您的 AI 模型 API Key！');
      setIsModalOpen(true);
      return;
    }

    try {
      setIsParsing(true);
      let text = '';
      
      // 1. 提取文本
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (fileExt === 'pdf') {
        console.log('正在读取 PDF...');
        text = await extractTextFromPDF(file);
      } else if (fileExt === 'docx') {
        console.log('正在读取 DOCX...');
        text = await extractTextFromDOCX(file);
      } else {
        throw new Error('不支持的文件格式，目前仅支持 PDF 和 DOCX。');
      }
      
      // 2. 发起大模型请求
      console.log('正在请求 AI 解析...');
      const baseURL = localStorage.getItem('resume_ai_base_url') || undefined;
      const modelName = localStorage.getItem('resume_ai_model_name') || undefined;
      const resultJson = await parseResumeWithAI(text, apiKey, baseURL, modelName);
      
      // 3. 将成功解析的 JSON 传回上层
      if (onAiParsed) {
        onAiParsed(resultJson);
      }
      
    } catch (error) {
      alert('解析失败:\n' + error.message);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-blue-500" />
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Resume Master</h1>
      </div>

      {/* 中间：视图分屏切换器 */}
      <div className="hidden md:flex bg-gray-100 p-1 rounded-lg border border-gray-200">
        <button 
          onClick={() => setViewMode('split')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          分屏视图
        </button>
        <button 
          onClick={() => setViewMode('edit')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          集中编辑
        </button>
        <button 
          onClick={() => setViewMode('preview')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
        >
          全屏预览
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        {/* ✨ AI 导入 PDF 下拉 / 按钮组 */}
        <div className="flex bg-blue-50/50 border border-blue-100 rounded-lg p-0.5 mr-2">
          <button 
            onClick={() => {
              if (!localStorage.getItem('resume_ai_api_key')) {
                setIsModalOpen(true);
              } else {
                fileInputRef.current?.click();
              }
            }}
            disabled={isParsing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-50"
            title="上传现有的 PDF 或 DOCX 简历，通过 AI 智能提取并填入表单"
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FileSearch className="w-4 h-4" />
            )}
            <span>{isParsing ? '解析中...' : '智能导入 PDF/DOCX'}</span>
          </button>
          <div className="w-px bg-blue-200 mx-0.5 my-1"></div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-1.5 text-blue-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
            title="配置 API 大脑"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* 隐藏的 File Input */}
        <input 
          type="file" 
          accept=".pdf,.docx" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
        />

        <button 
          onClick={onClearData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          清空
        </button>
        <button 
          onClick={onFillExample}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          一键填充示例
        </button>
        <button 
          onClick={onPrint}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          导出 PDF
        </button>
      </div>

      <ApiKeyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(key, url, model) => {
          console.log('AI API Key 已配置保存');
        }}
      />
    </header>
  );
}
