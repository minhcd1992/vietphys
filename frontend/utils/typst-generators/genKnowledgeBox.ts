export const generateKnowledgeBox = (node: any): string => {
  const props = node.properties || {};
  
  const title = props.title || '';
  const content = props.content || 'Nhập nội dung vào đây...';
  const type = props.boxType || 'definition';
  const color = props.color || '#1890FF';

  // Sử dụng cú pháp khối nội dung [] của Typst cho content
  return `
#vp-knowledge-box(
  title: "${title}",
  type: "${type}",
  color: rgb("${color}")
)[
  ${content}
]`.trim();
};