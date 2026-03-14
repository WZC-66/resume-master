import { useRef } from 'react';
import FormSection from './FormSection';
import { User, GraduationCap, Briefcase, Code, FileText, Trash2, FolderGit2, Plus, Camera, LayoutList } from 'lucide-react';

/**
 * ResumeForm 组件
 * 作用：左侧的表单输入区统筹管理组件，根据设定好的 sectionOrder 动态调度各个版块
 */
export default function ResumeForm({ 
  data, 
  updatePersonalInfo, 
  addCustomField,
  updateCustomField,
  removeCustomField,
  updateArrayItem, 
  addArrayItem, 
  removeArrayItem,
  updateCustomSection
}) {
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 定义各个内置板块的内部表单组装逻辑 ---
  
  const renderPersonalInfo = () => (
    <FormSection key="personalInfo" title="基本信息" icon={User} onAdd={addCustomField}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* 头像上传区 - 3:4 */}
          <div 
            className="w-[96px] h-[128px] shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
            title="点击添加照片"
          >
            {data.personalInfo.avatar ? (
              <>
                <img src={data.personalInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-[11px] text-gray-500 font-medium tracking-wide">添加照片</span>
                <span className="text-[9px] text-gray-400 mt-0.5">3:4</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input 
              type="text" 
              value={data.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="例如：张三"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">期望岗位</label>
            <input 
              type="text" 
              value={data.personalInfo.jobTitle}
              onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="例如：前端开发工程师"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
            <input 
              type="text" 
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="例如：138-1234-5678"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input 
              type="email" 
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="例如：zhangsan@example.com"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Github / 个人主页</label>
            <input 
              type="text" 
              value={data.personalInfo.github}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="例如：github.com/zhangsan"
            />
          </div>
          {data.personalInfo.customFields?.map((field) => (
            <div key={field.id} className="col-span-2 flex items-end gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">字段名称（如：年龄）</label>
                <input 
                  type="text" 
                  value={field.label}
                  onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="字段名"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">内容</label>
                <input 
                  type="text" 
                  value={field.value}
                  onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="内容"
                />
              </div>
              <button 
                onClick={() => removeCustomField(field.id)}
                className="mb-1 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          </div>
        </div>
      </FormSection>
  );

  const renderSummary = () => (
    <FormSection key="summary" title="个人总结" icon={FileText}>
        <div>
          <textarea 
            rows="4"
            value={data.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-y"
            placeholder="建议：简短精炼地描述你的核心优势、擅长技术栈以及工作亮点..."
          />
        </div>
      </FormSection>
  );

  const renderWorkExperience = () => (
    <FormSection 
      key="workExperience"
      title="工作经验" 
      icon={Briefcase}
      onAdd={() => addArrayItem('workExperience', { company: '', position: '', startDate: '', endDate: '', description: '' })}
    >
        {data.workExperience.map((work, index) => (
          <div key={work.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
            <button 
              onClick={() => removeArrayItem('workExperience', work.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-3 mb-3 pr-8">
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="公司名称"
                value={work.company}
                onChange={(e) => updateArrayItem('workExperience', work.id, 'company', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="职位名称"
                value={work.position}
                onChange={(e) => updateArrayItem('workExperience', work.id, 'position', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="开始时间 (如 2019-07)"
                value={work.startDate}
                onChange={(e) => updateArrayItem('workExperience', work.id, 'startDate', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="结束时间 (如 至今)"
                value={work.endDate}
                onChange={(e) => updateArrayItem('workExperience', work.id, 'endDate', e.target.value)}
              />
            </div>
            <textarea 
              rows="3"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
              placeholder="主要工作内容与成绩 (支持换行表现多点)"
              value={work.description}
              onChange={(e) => updateArrayItem('workExperience', work.id, 'description', e.target.value)}
            />
          </div>
        ))}
        {data.workExperience.length === 0 && <p className="text-sm text-gray-400 text-center py-2">暂无工作经验</p>}
      </FormSection>
  );

  const renderProjectExperience = () => (
    <FormSection 
      key="projectExperience"
      title="项目经验" 
      icon={FolderGit2}
      onAdd={() => addArrayItem('projectExperience', { projectName: '', startDate: '', endDate: '', techStack: '', description: '', role: '', highlights: '' })}
    >
        {data.projectExperience?.map((project, index) => (
          <div key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
            <button 
              onClick={() => removeArrayItem('projectExperience', project.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-3 mb-3 pr-8">
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="项目名称"
                value={project.projectName}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'projectName', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="技术栈 (如 Vue, Node.js)"
                value={project.techStack}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'techStack', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="开始时间 (如 2021-03)"
                value={project.startDate}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'startDate', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="结束时间"
                value={project.endDate}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'endDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <textarea 
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                placeholder="项目描述"
                value={project.description}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'description', e.target.value)}
              />
              <textarea 
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                placeholder="个人职责"
                value={project.role}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'role', e.target.value)}
              />
              <textarea 
                rows="2"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                placeholder="项目亮点与难点突破"
                value={project.highlights}
                onChange={(e) => updateArrayItem('projectExperience', project.id, 'highlights', e.target.value)}
              />
            </div>
          </div>
        ))}
        {(!data.projectExperience || data.projectExperience.length === 0) && <p className="text-sm text-gray-400 text-center py-2">暂无项目经验</p>}
      </FormSection>
  );

  const renderEducation = () => (
    <FormSection 
      key="education"
      title="教育经历" 
      icon={GraduationCap}
      onAdd={() => addArrayItem('education', { school: '', degree: '', startDate: '', endDate: '' })}
    >
        {data.education.map((edu, index) => (
          <div key={edu.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
            <button 
              onClick={() => removeArrayItem('education', edu.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-3 pr-8">
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="学校"
                value={edu.school}
                onChange={(e) => updateArrayItem('education', edu.id, 'school', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="专业与学历 (如 计算机科学 - 本科)"
                value={edu.degree}
                onChange={(e) => updateArrayItem('education', edu.id, 'degree', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="开始时间"
                value={edu.startDate}
                onChange={(e) => updateArrayItem('education', edu.id, 'startDate', e.target.value)}
              />
              <input 
                className="col-span-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm" 
                placeholder="结束时间"
                value={edu.endDate}
                onChange={(e) => updateArrayItem('education', edu.id, 'endDate', e.target.value)}
              />
            </div>
            <textarea 
              rows="2"
              className="w-full px-3 py-2 mt-2 border border-gray-200 rounded-md text-sm"
              placeholder="详细说明 (在校成绩、主修课程、奖学金等，支持换行)"
              value={edu.description || ''}
              onChange={(e) => updateArrayItem('education', edu.id, 'description', e.target.value)}
            />
          </div>
        ))}
        {data.education.length === 0 && <p className="text-sm text-gray-400 text-center py-2">暂无教育经历</p>}
      </FormSection>
  );

  const renderSkills = () => (
    <FormSection 
      key="skills"
      title="专业技能" 
      icon={Code}
      onAdd={() => addArrayItem('skills', { content: '' })}
    >
        {data.skills?.map((skill, index) => (
          <div key={skill.id} className="flex gap-2 items-start relative group bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input 
              type="text" 
              value={skill.content}
              onChange={(e) => updateArrayItem('skills', skill.id, 'content', e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              placeholder="例如：熟练掌握 React 及其周边生态..."
            />
            <button 
              onClick={() => removeArrayItem('skills', skill.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(!data.skills || data.skills.length === 0) && <p className="text-sm text-gray-400 text-center py-2">添加您的专业技能，建议分点描述</p>}
      </FormSection>
  );

  const renderCustomSection = (sectionId, title) => {
    // 找到具体的 custom section 实体字典
    const customData = data.customSections?.find(c => c.id === sectionId) || { title: '', content: '' };
    return (
      <FormSection key={sectionId} title={title || "自定义板块"} icon={LayoutList}>
         <div className="space-y-3">
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">板块主标题（如：获奖情况 / 兴趣爱好）</label>
               <input 
                 className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500/20" 
                 placeholder="输入板块名称"
                 value={customData.title}
                 onChange={(e) => updateCustomSection(sectionId, 'title', e.target.value)}
               />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 mb-1">板块内容（支持回车多段落展示）</label>
               <textarea 
                 rows="4"
                 className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm leading-relaxed"
                 placeholder="输入内容..."
                 value={customData.content}
                 onChange={(e) => updateCustomSection(sectionId, 'content', e.target.value)}
               />
            </div>
         </div>
      </FormSection>
    )
  };

  // 映射关系簿
  const sectionRendererMap = {
    personalInfo: renderPersonalInfo,
    summary: renderSummary,
    workExperience: renderWorkExperience,
    projectExperience: renderProjectExperience,
    education: renderEducation,
    skills: renderSkills
  };

  return (
    <div className="space-y-6">
      {/* 极简映射渲染引擎：按照 sectionOrder 数组依次调用对应的 render 组件以实现动态重排 */}
      {data.sectionOrder?.map(section => {
        if (section.type === 'custom') {
          return renderCustomSection(section.id, section.title);
        } else if (sectionRendererMap[section.type]) {
          return sectionRendererMap[section.type]();
        }
        return null; // 处理安全降级
      })}
    </div>
  );
}
