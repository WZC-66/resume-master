import { useState, useEffect } from 'react';
import { KeyRound, X, Save, ShieldCheck } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [baseURL, setBaseURL] = useState('https://dashscope.aliyuncs.com/compatible-mode/v1');
  const [modelName, setModelName] = useState('qwen-max');

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('resume_ai_api_key') || '');
      setBaseURL(localStorage.getItem('resume_ai_base_url') || 'https://dashscope.aliyuncs.com/compatible-mode/v1');
      setModelName(localStorage.getItem('resume_ai_model_name') || 'qwen-max');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('resume_ai_api_key', apiKey.trim());
    localStorage.setItem('resume_ai_base_url', baseURL.trim());
    localStorage.setItem('resume_ai_model_name', modelName.trim());
    onSave(apiKey.trim(), baseURL.trim(), modelName.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">配置 AI 解析大脑</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 text-blue-800 text-sm mb-6">
            <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
            <p className="leading-relaxed">
              您的 API Key 将<strong>仅保存在本地浏览器中</strong>，不经过任何中间服务器，完全保障您的隐私安全。当前默认支持阿里云百炼（通义千问）接口，也兼容任何 OpenAI 格式节点。
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">API Key (必填)</label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxx"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base URL (选填, 兼容 OpenAI 格式)</label>
            <input 
              type="text" 
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Model (模型代号)</label>
            <input 
              type="text" 
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="qwen-max"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors rounded-lg"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors rounded-lg flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>保存配置</span>
          </button>
        </div>
      </div>
    </div>
  );
}
