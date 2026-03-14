import mammoth from "mammoth";

/**
 * 提取上传的 DOCX 文件中的纯文本
 * @param {File} file - DOCX 文件对象
 * @returns {Promise<string>} 提取出的所有文本内容
 */
export async function extractTextFromDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // mammoth.extractRawText 会提取文档中的所有文本，并忽略样式
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value; // 返回提取出的字符串
  } catch (error) {
    console.error("DOCX 解析失败:", error);
    throw new Error('解析 DOCX 文件时发生错误。请确保上传了合法的 Word 文件。');
  }
}
