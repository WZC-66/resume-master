import { useState, useEffect } from 'react';
import { defaultResumeData } from '../utils/defaultData';

/**
 * useResumeData Hook
 * 作用：统一管理整个简历的状态，保证各个组件（特别是左侧表单和右侧预览）引用的是同一个“单项数据流”。
 * 增加持久化数据到 LocalStorage 和状态更新功能
 */
export function useResumeData() {
  const LOCAL_STORAGE_KEY = 'resume_master_data_v1';

  // 初始化时，先尝试从 localStorage 读取历史数据，没有则使用空结构
  const [resumeData, setResumeData] = useState(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // 防范上个版本存入的旧数据里没有新版本引入的拖拽管理数组
        return {
          ...parsed,
          sectionOrder: parsed.sectionOrder || [...defaultResumeData.sectionOrder],
          customSections: parsed.customSections || [],
          projectExperience: parsed.projectExperience || [],
          workExperience: parsed.workExperience || [],
          education: parsed.education || [],
          skills: parsed.skills || [],
          personalInfo: {
            ...parsed.personalInfo,
            customFields: parsed.personalInfo?.customFields || []
          }
        };
      }
    } catch (error) {
      console.error('从 localStorage 读取数据失败:', error);
    }
    
    return {
      sectionOrder: [...defaultResumeData.sectionOrder],
      customSections: [],
      personalInfo: { 
        fullName: '', 
        jobTitle: '', 
        email: '', 
        phone: '', 
        github: '', 
        avatar: '', // 新增照片
        customFields: [], // 新增自定义字段 [{id, label, value}]
        summary: '' 
      },
      education: [],
      workExperience: [],
      projectExperience: [], // 新增项目经历
      skills: [] // 改为了数组格式存储专业技能
    };
  });

  // 使用 useEffect 监听数据的实时变化以自动保存到磁盘
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
  }, [resumeData]);

  // 更新个人信息（包括修改基本字符串字段和自定义字段）
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  // 针对个人信息的自定义字段进行特别的 CRUD 操作
  const addCustomField = () => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customFields: [...prev.personalInfo.customFields, { id: Date.now().toString(), label: '', value: '' }]
      }
    }));
  };

  const updateCustomField = (id, fieldName, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customFields: prev.personalInfo.customFields.map(cf => cf.id === id ? { ...cf, [fieldName]: value } : cf)
      }
    }));
  };

  const removeCustomField = (id) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customFields: prev.personalInfo.customFields.filter(cf => cf.id !== id)
      }
    }));
  };

  // 更新数组型状态的某一项 (如教育或工作经验的某个字段)
  const updateArrayItem = (listName, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [listName]: prev[listName].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  // 新增数组型状态的某一项
  const addArrayItem = (listName, newItem) => {
    setResumeData(prev => ({
      ...prev,
      [listName]: [...prev[listName], { id: Date.now().toString(), ...newItem }]
    }));
  };

  // 移除数组型状态的某一项
  const removeArrayItem = (listName, id) => {
    setResumeData(prev => ({
      ...prev,
      [listName]: prev[listName].filter(item => item.id !== id)
    }));
  };

  // 一键填充示例数据以便测试和演示
  const fillExampleData = () => {
    if (window.confirm("使用模板库将覆盖您当前正在输入的信息，是否继续？")) {
      setResumeData(defaultResumeData);
    }
  };

  // 清空数据 (不删自带版块，且过滤掉纯粹的自定义板块)
  const clearData = () => {
    if (window.confirm("确定要清空所有简历内容吗？此操作无法撤销。")) {
      setResumeData(prev => ({
        ...prev,
        sectionOrder: [...defaultResumeData.sectionOrder].filter(s => s.type !== 'custom'),
        customSections: [],
        personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', github: '', avatar: '', customFields: [], summary: '' },
        education: [],
        workExperience: [],
        projectExperience: [],
        skills: []
      }));
    }
  };

  // 通过 AI 导入解析成功的 JSON 数据
  const importFromJson = (parsedData) => {
    setResumeData(prev => {
      // 保持现有的 avatar 头像不被清空
      const currentAvatar = prev.personalInfo?.avatar || '';
      return {
        ...prev,
        personalInfo: {
          ...parsedData.personalInfo,
          avatar: currentAvatar
        },
        education: parsedData.education || [],
        workExperience: parsedData.workExperience || [],
        projectExperience: parsedData.projectExperience || [],
        skills: parsedData.skills || []
      };
    });
  };

  // 添加全新大板块（仅含标题与多行内容）到导航栏末尾
  const addCustomSection = () => {
    const newId = `custom_${Date.now()}`;
    setResumeData(prev => {
      // 获取当前的板块顺序，若没有则用默认的打底
      const curOrder = prev.sectionOrder || [...defaultResumeData.sectionOrder];
      // 保证把新增的板块扔到数组末尾
      return {
        ...prev,
        sectionOrder: [...curOrder, { id: newId, type: 'custom', title: '自定义标题' }],
        customSections: [...(prev.customSections || []), { id: newId, title: '自定义标题', content: '' }]
      };
    });
  };

  // 移出当前已定义的自定义大板块
  const removeCustomSection = (id) => {
     if (window.confirm("确定要删除此板块吗？将会连同内容一起消失！")) {
        setResumeData(prev => ({
           ...prev,
           sectionOrder: prev.sectionOrder.filter(s => s.id !== id),
           customSections: prev.customSections.filter(s => s.id !== id)
        }));
     }
  };

  // 全局修改 custom section 的字面量（更新它在 customSections 和 sectionOrder 中的 title 或内容）
  const updateCustomSection = (id, field, value) => {
    setResumeData(prev => {
      const updatedCustoms = prev.customSections.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      );
      const updatedOrder = prev.sectionOrder.map(s => 
        (s.id === id && field === 'title') ? { ...s, title: value } : s
      );
      return {
        ...prev,
        customSections: updatedCustoms,
        sectionOrder: updatedOrder
      };
    });
  };

  // 用户手拉拖拽结束调用的 API：更新整个排版数组的位置关系
  const setSectionOrder = (newOrderArr) => {
     setResumeData(prev => ({
         ...prev,
         sectionOrder: newOrderArr
     }));
  };

  return {
    resumeData,
    setResumeData,
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
  };
}
