import { generateChapter } from './genChapter';
import { generateKnowledgeBox } from './genKnowledgeBox';
import { generateQuestion } from './genQuestion';

// Hàm đệ quy duyệt qua cây JSON và gọi đúng máy dịch tương ứng
export const generateTypstCode = (nodes: any[]): string => {
  let typstCode = '';

  for (const node of nodes) {
    switch (node.type) {
      case 'Chapter':
        typstCode += generateChapter(node) + '\n';
        break;
      case 'KnowledgeBox':
        typstCode += generateKnowledgeBox(node) + '\n';
        break;
      case 'QuestionBlock':
        typstCode += generateQuestion(node) + '\n';
        break;
      case 'Container':
        // Nếu là Container thì gọi đệ quy các con của nó
        if (node.children && node.children.length > 0) {
           typstCode += generateTypstCode(node.children);
        }
        break;
      default:
        // Các Component khác sẽ bổ sung sau
        typstCode += `// Chưa hỗ trợ dịch: ${node.type}\n`;
    }
  }

  return typstCode;
};

// Hàm wrap mã nguồn thành file Typst hoàn chỉnh
export const buildFullTypstDocument = (bodyCode: string): string => {
  return `
#import "@local/vietphys:0.1.0": * // Giả sử thầy sẽ đóng gói thư viện này

#show: doc => vp-page-setup(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  body: doc
)

// --- NỘI DUNG TÀI LIỆU ---
${bodyCode}
  `.trim();
};