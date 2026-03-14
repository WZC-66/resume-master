import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// 设定使用 3.11.174 版本的标准 worker URL
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * 提取上传的 PDF 文件文本
 * @param {File} file - PDF 文件对象
 * @returns {Promise<string>} 提取出的所有文本拼接的字符串
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // 使用 typed array 初始化 pdfjs
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    
    const numPages = pdf.numPages;
    let fullText = '';
    
    // 逐页提取纯文本
    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // 提取每页所有的文本元素并用空格和换行符拼接
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error("PDF 解析失败:", error);
    throw new Error('解析 PDF 文件时发生意外错误，请确保上传了合法的 PDF 文档。\n详细错误：' + error.message);
  }
}
