import OpenAI from "openai";

// AI 提取简历的大规模 Prompt
const RESUME_PARSER_PROMPT = `
你是一个极为专业的资深 HR 及简历内容抓取解析器。
请尽全力从下列用户提供的未格式化的简历文本串中，抽取并结构化出下面所定义的 JSON 数据对象。

### JSON 数据结构模板：
\`\`\`json
{
  "personalInfo": {
    "fullName": "姓名（如张三）",
    "jobTitle": "求职职位或头衔（如：前端开发工程师，没有则为空）",
    "email": "电子邮箱",
    "phone": "手机号",
    "github": "Github链接或个人主页",
    "customFields": [
      { "id": "唯一随机字符串", "label": "年龄/政治面貌等自定义属性名", "value": "对应的属性值" }
    ],
    "summary": "一段关于个人的综合能力和经验的简短自我评价"
  },
  "education": [
    {
      "id": "唯一随机字符串",
      "school": "学校名称",
      "degree": "学历或专业名称（如：计算机科学与技术 - 本科）",
      "startDate": "入学时间（YYYY-MM）",
      "endDate": "毕业时间（YYYY-MM）",
      "description": "主修课程、奖学金情况等附加信息"
    }
  ],
  "workExperience": [
    {
      "id": "唯一随机字符串",
      "company": "公司名称",
      "position": "担任的职务",
      "startDate": "入职时间（YYYY-MM）",
      "endDate": "离职时间（YYYY-MM 或 至今）",
      "description": "主要负责的业务范畴或成就（提炼整理为连贯的陈述段落或带换行符的多条描述）"
    }
  ],
  "projectExperience": [
    {
      "id": "唯一随机字符串",
      "projectName": "项目名称",
      "startDate": "开始时间（YYYY-MM）",
      "endDate": "结束时间（YYYY-MM）",
      "techStack": "项目使用的技术栈",
      "description": "项目整体描述",
      "role": "个人核心职责",
      "highlights": "项目难点或亮点（如何解决等）"
    }
  ],
  "skills": [
    { "id": "唯一随机字符串", "content": "提炼出来的一个具体的技能描述（例如：熟练掌握 React 及其周边生态，并了解 Node.js 开发）" }
  ]
}
\`\`\`

### 解析要求与规则：
1. **严格返回 JSON**：你的回复必须且只能包含一个合法的 JSON 对象，不要含有任何 Markdown 的 \`\`\`json 标记，绝对不要带有任何除了 JSON 对象外的解析说明、思考过程文字等。
2. **灵活兼容补全**：如果某些字段在原文本中无法找到，请填入空字符串 \`""\` 或空数组 \`[]\`。切勿瞎编乱造或者留 \`null\`，比如找不到 Github，就是 \`"github": ""\`。
3. **补充 \`id\`**：对于需要 \`id\` 的数组项目，请自行生成随机且简短的英数字符串作为唯一 \`id\`（例如 \`"e1"、"w1"、"p1"、"s1"\` 等）。
4. **格式规整**：工作与项目经验的描述文字如果很长，请合理添加换行符 \`\\n\` 以保证排版美观。
5. **智能归类**：尝试分辨诸如“年龄”、“籍贯”、“婚姻状况”等杂项基本信息，如果发现请放入 \`personalInfo.customFields\` 数组中。

### 待解析原文如下：
`;

/**
 * 调用通用的大模型接口以解析 PDF 长文本为 JSON
 * @param {string} text - 提取出来的 PDF 原文
 * @param {string} apiKey - 用户的 API Key
 * @param {string} baseURL - OpenAI 兼容格式的基础 URL（默认阿里云百炼）
 * @param {string} modelName - 要使用的模型代号
 * @returns {Promise<Object>} 解析出的合规 Resume JSON 数据
 */
export async function parseResumeWithAI(text, apiKey, baseURL = 'https://dashscope.aliyuncs.com/compatible-mode/v1', modelName = 'qwen-max') {
  if (!apiKey) {
    throw new Error('未检测到有效的 API Key。请先配置大模型接口配置！');
  }

  try {
    // 在本地开发环境中，如果基础 URL 是通配阿里百炼平台，通过 vite proxy 发请求以规避跨域或浏览器本地代理（如 VPN 插件）拦截导致的连接关闭
    const finalBaseURL = (import.meta.env.DEV && baseURL.includes('dashscope.aliyuncs.com')) 
                         ? window.location.origin + baseURL.replace('https://dashscope.aliyuncs.com', '/dashscope')
                         : baseURL;

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: finalBaseURL,
      dangerouslyAllowBrowser: true // 允许前端直接调用
    });

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a helpful assistant specialized in parsing messy resume texts into highly structured JSON format." },
        { role: "user", content: RESUME_PARSER_PROMPT + "\n\n" + text }
      ],
      temperature: 0.1, // 尽量低随机性，确保结构返回一致性
    });

    let replyContent = completion.choices[0].message.content.trim();

    // 剔除可能会附带的 markdown json 标记
    if (replyContent.startsWith("```json")) {
      replyContent = replyContent.replace(/^```json/, "");
    }
    if (replyContent.startsWith("```")) {
        replyContent = replyContent.replace(/^```/, "");
    }
    if (replyContent.endsWith("```")) {
      replyContent = replyContent.substring(0, replyContent.length - 3);
    }
    
    // 清除可能的前后多余不可见字符
    replyContent = replyContent.trim();

    // 解析 JSON
    const parsedJson = JSON.parse(replyContent);
    return parsedJson;
  } catch (error) {
    console.error("AI 智能解析失败:", error);
    if (error.status === 401 || (error.message && error.message.includes("401"))) {
      throw new Error("401 鉴权失败！您填写的 API Key (密钥) 无效或不存在。\n请检查顶部齿轮设置中的 API Key 是否复制完整（通常是 sk- 开头的字符串），确保没有多余的空格，并在阿里云百炼平台确认您的密钥状态。");
    }
    throw new Error("模型解析返回数据时失败：" + error.message);
  }
}
