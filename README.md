# 🚀 Resume Master - 全栈感简历生成器

这是一个基于 React 和 Vite 构建的高性能、极简风格简历生成器。采用“左侧编辑、右侧实时预览”的双栏布局，支持一键导出 A4 比例的 PDF 简历。

## ✨ 核心特性

- **🤖 AI 简历智能解析** (New!)：接入基于纯前端架构的大模型驱动方案，上传 **PDF** 或 **Word (.docx)** 简历，即可自动结构化解析并填入左侧表单（支持 DeepSeek / 阿里千问 / OpenAI 标准格式接口，配置的 API Key 仅保存在您的浏览器本地，绝对安全保护隐私）。
- **双栏同步预览**：左侧填写表单，右侧 A4 纸比例实时渲染，所见即所得。
- **三维视图切换**：提供“分屏视图”、“集中编辑”和“全屏预览”三种模式，适应不同创作阶段。
- **丰富的模块支持**：
  - **基本信息**：支持上传 3:4 证件照，并可动态添加自定义字段（如：年龄、籍贯等）。
  - **工作经历**：支持多段工作经验的增删改。
  - **项目经验**：多维度项目描述，包含技术栈、个人职责、项目亮点。
  - **教育经历**：详细描述在校表现。
  - **专业技能**：支持逐条添加，预览区自动生成项目符号。
- **持久化存储**：集成 LocalStorage，实时保存您的输入进度，刷新或重启浏览器数据不丢失。
- **一键导出 PDF**：基于 `react-to-print` 实现，像素级还原 A4 纸排版，无背景溢出。
- **防滑保护**：清空或加载示例数据时均有二次确认提示，保护创作成果。

## 🛠️ 技术栈

- **前端框架**：[React 18](https://react.dev/)
- **构建工具**：[Vite](https://vitejs.dev/)
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/)
- **图标库**：[Lucide React](https://lucide.dev/)
- **PDF 方案**：[react-to-print](https://github.com/gregnb/react-to-print)

## 🚀 快速开始

### 1. 安装依赖
在项目根目录下运行：
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
之后在浏览器访问 `http://localhost:5173` 即可开始使用。

## 📁 目录结构

```text
src/
├── components/     # UI 组件 (Header, ResumeForm, ResumePreview 等)
├── hooks/          # 自定义 Hook (状态管理与持久化逻辑)
├── utils/          # 工具函数与默认示例数据
├── App.jsx         # 主布局与视图调度
└── index.css       # Tailwind 配置与全局样式
```

## 📝 开发者说明
本项目采用“单一数据流”设计模式，所有简历数据均由 `useResumeData` Hook 统一调度，方便后续二次开发或对接后端 API。
