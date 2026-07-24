import React from 'react';

interface Props { node: any; currentTplId: string; themeColor: string; }

const SectionNode: React.FC<Props> = ({ node, currentTplId, themeColor }) => {
  const p = node.properties || {};
  const num = p.num || 'I';
  const title = p.title || 'TIÊU ĐỀ MỤC';
  const fontSize = p.titleSize?.replace('pt','px') || '18px';
  
  if (currentTplId === 'A') return <div className="flex items-center gap-3 mt-4 mb-2"><div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: themeColor }}><i className="fas fa-star"></i></div><div className="flex-1 border-b-2 pb-1 font-bold text-lg uppercase" style={{ borderColor: `${themeColor}60`, color: themeColor }}>{num}. {title}</div></div>;
  if (currentTplId === 'B') return <div className="mt-4 mb-2 border-b-2 pb-2 font-bold text-lg uppercase" style={{ borderColor: themeColor, color: themeColor }}>{num}. {title}</div>;
  
  if (currentTplId === 'sec_star_underline') {
     return <div className="flex items-center gap-3 mt-4 mb-2"><div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: themeColor }}><i className="fas fa-star"></i></div><div className="flex-1 border-b-2 pb-1 font-bold uppercase" style={{ borderColor: `${themeColor}60`, color: themeColor, fontSize }}>{num}. {title}</div></div>;
  }
  return null;
};
export default SectionNode;