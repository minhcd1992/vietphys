export const generateChapter = (node: any): string => {
  const props = node.properties || {};
  
  const num = props.num || '1';
  const title = props.title || 'TÊN CHƯƠNG';
  const style = props.template || 'chap_hexagon';
  const color = props.color || '#1E3A8A';
  const font = props.fontFamily || 'Arial';

  // Nhả ra đúng cú pháp gọi hàm của vietphys.typ
  return `#vp-chapter(num: "${num}", title: "${title}", style: "${style}", color: rgb("${color}"), font: "${font}")`;
};