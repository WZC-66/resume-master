/**
 * ResumePreview 组件
 * 作用：右侧的 A4 预览区，由于支持大板块自由排序，该区使用提取后的内部渲染器遍历输出。
 */
export default function ResumePreview({ data }) {
  // 辅助函数：渲染小标题栏
  const SectionTitle = ({ title }) => (
    <h2 className="text-xl font-bold text-gray-800 mb-4 mt-6 uppercase tracking-widest relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-px after:bg-gray-200">
      <span className="relative z-10 bg-white pr-4">{title}</span>
    </h2>
  );

  const renderPersonalInfo = () => (
    <div className={`flex justify-between items-center mb-8 ${data.personalInfo.avatar ? 'border-b border-gray-200 pb-8' : ''}`}>
      <div className={`flex-1 ${data.personalInfo.avatar ? 'text-left' : 'text-center'}`}>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          {data.personalInfo.fullName || '姓名'}
        </h1>
        <p className="text-xl text-gray-600 font-medium tracking-wide mb-4">
          {data.personalInfo.jobTitle || '求职意向'}
        </p>
        <div className={`flex flex-wrap items-center gap-y-2 text-sm text-gray-600 ${data.personalInfo.avatar ? 'justify-start' : 'justify-center'}`}>
          {[
            data.personalInfo.phone,
            data.personalInfo.email,
            data.personalInfo.github,
            ...(data.personalInfo.customFields || []).map(cf => cf.label ? `${cf.label}: ${cf.value}` : cf.value)
          ].filter(Boolean).map((text, i, arr) => (
            <span key={i} className="flex items-center">
              <span>{text}</span>
              {i < arr.length - 1 && <span className="text-gray-300 mx-3">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* 头像展示区 - 3:4 比例 */}
      {data.personalInfo.avatar && (
        <div className="w-[90px] h-[120px] shrink-0 ml-8 rounded-md overflow-hidden shadow-sm border border-gray-200 print:shadow-none bg-gray-50">
          <img src={data.personalInfo.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  const renderSummary = () => {
    if (!data.personalInfo.summary) return null;
    return (
        <div>
          <SectionTitle title="个人总结" />
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {data.personalInfo.summary}
          </p>
        </div>
    );
  };

  const renderWorkExperience = () => {
    if (!data.workExperience || data.workExperience.length === 0) return null;
    return (
        <div>
          <SectionTitle title="工作经验" />
          <div className="space-y-5">
            {data.workExperience.map(work => (
              <div key={work.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-800">{work.company}</h3>
                  <span className="text-sm text-gray-500 font-medium">
                    {work.startDate} - {work.endDate || '至今'}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">{work.position}</div>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                  {work.description}
                </p>
              </div>
            ))}
          </div>
        </div>
    );
  };

  const renderProjectExperience = () => {
    if (!data.projectExperience || data.projectExperience.length === 0) return null;
    return (
        <div>
          <SectionTitle title="项目经验" />
          <div className="space-y-5">
            {data.projectExperience.map(project => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-800">{project.projectName}</h3>
                  <span className="text-sm text-gray-500 font-medium">
                    {project.startDate} - {project.endDate || '至今'}
                  </span>
                </div>
                {project.techStack && <div className="text-sm font-medium text-blue-600 mb-1.5">{project.techStack}</div>}
                
                <div className="space-y-1">
                  {project.description && <div className="text-sm text-gray-700 whitespace-pre-wrap"><span className="font-bold">项目描述：</span>{project.description}</div>}
                  {project.role && <div className="text-sm text-gray-700 whitespace-pre-wrap"><span className="font-bold">核心职责：</span>{project.role}</div>}
                  {project.highlights && <div className="text-sm text-gray-700 whitespace-pre-wrap"><span className="font-bold">项目亮点：</span>{project.highlights}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
    );
  };

  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null;
    return (
        <div>
          <SectionTitle title="教育经历" />
          <div className="space-y-4">
            {data.education.map(edu => (
              <div key={edu.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">{edu.school}</h3>
                    <div className="text-sm font-medium text-blue-600 mt-1">{edu.degree}</div>
                  </div>
                  <span className="text-sm text-gray-500 font-medium whitespace-nowrap ml-4">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
    );
  };

  const renderSkills = () => {
    if (!data.skills || data.skills.length === 0) return null;
    return (
        <div>
          <SectionTitle title="专业技能" />
          <ul className="space-y-1.5 list-none pl-1 mt-3">
            {data.skills.map((skill, i) => skill.content && (
              <li key={skill.id || i} className="text-sm text-gray-700 flex items-start leading-relaxed">
                <span className="text-gray-400 mr-2 shrink-0">·</span>
                <span>{skill.content}</span>
              </li>
            ))}
          </ul>
        </div>
    );
  };

  const renderCustomSection = (sectionId, title) => {
    const customData = data.customSections?.find(c => c.id === sectionId);
    if (!customData || !customData.content) return null;
    return (
        <div key={sectionId}>
          <SectionTitle title={title || "自定义板块"} />
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
            {customData.content}
          </p>
        </div>
    );
  };

  const sectionRendererMap = {
    summary: renderSummary,
    workExperience: renderWorkExperience,
    projectExperience: renderProjectExperience,
    education: renderEducation,
    skills: renderSkills
  };

  const hasAnyDataContent = 
    data.personalInfo.fullName || 
    data.personalInfo.summary || 
    data.education.length > 0 || 
    data.workExperience.length > 0 || 
    (data.projectExperience && data.projectExperience.length > 0) ||
    (data.customSections && data.customSections.some(c => c.content));

  return (
    <div className="bg-white shadow-xl mx-auto w-full max-w-[21cm] min-h-[29.7cm] p-12 print:shadow-none print:m-0 text-gray-800">
      
      {/* 始终把个人头部信息置顶渲染 */}
      {renderPersonalInfo()}

      {/* 依据可拖拽的左侧导航动态渲染正文 */}
      <div className="space-y-2">
        {data.sectionOrder?.filter(s => s.type !== 'personalInfo').map(section => {
          if (section.type === 'custom') {
             return renderCustomSection(section.id, section.title);
          } else if (sectionRendererMap[section.type]) {
             return <div key={section.id}>{sectionRendererMap[section.type]()}</div>;
          }
          return null;
        })}
      </div>

      {/* 空白提示 */}
      {!hasAnyDataContent && (
        <div className="flex flex-col items-center justify-center text-gray-400 mt-32">
          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
            📄
          </div>
          <p>在左侧或中间输入信息，实时预览将在此处生成</p>
        </div>
      )}
    </div>
  );
}
