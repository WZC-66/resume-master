export const defaultResumeData = {
  // 定义大板块先后顺序 (包含内置版块的 ID 与可能的自建版块的 ID)
  // 内置类型：'personalInfo', 'summary', 'workExperience', 'projectExperience', 'education', 'skills'
  sectionOrder: [
    { id: 'personalInfo', type: 'personalInfo', title: '基本信息' },
    { id: 'summary', type: 'summary', title: '个人总结' },
    { id: 'workExperience', type: 'workExperience', title: '工作经历' },
    { id: 'projectExperience', type: 'projectExperience', title: '项目经验' },
    { id: 'education', type: 'education', title: '教育经历' },
    { id: 'skills', type: 'skills', title: '专业技能' }
  ],
  // 专门收集用户自建出来的纯文本大板块池
  customSections: [],

  personalInfo: {
    fullName: '张三',
    jobTitle: '高级前端开发工程师',
    email: 'zhangsan@example.com',
    phone: '138-1234-5678',
    github: 'github.com/zhangsan',
    // 新增：支持自定义基本信息字段，用数组形式方便管理和渲染
    customFields: [
      { id: 'c1', label: '年龄', value: '25岁' },
      { id: 'c2', label: '政治面貌', value: '党员' }
    ],
    summary: '拥有 5 年前端开发经验，熟练掌握 React、Vue 技术栈。热衷于编写高复用、易维护的“Clean Code”。具备良好的沟通能力与团队协作精神，曾主导实现公司内部低代码平台，将页面交付效率提升 40%。'
  },
  education: [
    {
      id: '1',
      school: '某某大学',
      degree: '计算机科学与技术 - 本科',
      startDate: '2015-09',
      endDate: '2019-06',
      description: '主修课程：数据结构、计算机网络。在校期间连续三年获得一等奖学金。\n曾作为核心成员参加 ACM 竞赛获得省级一等奖。'
    }
  ],
  workExperience: [
    {
      id: '1',
      company: '某大厂科技',
      position: '前端开发工程师',
      startDate: '2019-07',
      endDate: '至今',
      description: '- 主导核心业务系统的前端重构，由 Vue2 升级至 React18，性能提升 30%。\n- 开发并维护企业级组件库，为 10+ 内部系统提供支持。\n- 优化首屏加载时间，搭建前端监控告警系统。'
    }
  ],
  // 新增：项目经验模块数据类型
  projectExperience: [
    {
      id: '1',
      projectName: '企业级低代码平台',
      startDate: '2021-03',
      endDate: '2022-08',
      techStack: 'React, TypeScript, Zustand, TailWind',
      description: '面向内部业务人员的页面拖拽搭建平台，支持自由排列组件及动态发布。',
      role: '前端负责人，主导架构设计及核心画布引擎开发。',
      highlights: '解决画布中 1000+ 节点卡顿问题，FPS 从 25 提升至 55。'
    }
  ],
  skills: [
    { id: 's1', content: '熟练掌握 React 及其生态 (Redux/Zustand、React Router)' },
    { id: 's2', content: '精通 TypeScript，具备良好的类型建设思维和开发习惯' },
    { id: 's3', content: '熟悉 Webpack、Vite 等构建工具及前端工程化配置' },
    { id: 's4', content: '了解 Node.js，能使用 Express 或 Nest.js 进行简单的中间层开发' }
  ]
};
