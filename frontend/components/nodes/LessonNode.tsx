import React from 'react';
import { hexToRgbA } from '../builder/config';

interface Props { node: any; currentTplId: string; themeColor: string; }

const LessonNode: React.FC<Props> = ({ node, currentTplId, themeColor }) => {
  const p = node.properties || {};
  const num = p.num || '1';
  const title = p.title || 'TÊN BÀI HỌC';
  const fontSize = p.titleSize?.replace('pt','px') || '18px';
  
  if (currentTplId === 'A') return <div className="p-3 text-white font-bold flex items-center gap-3 mt-2 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" style={{ backgroundColor: themeColor, borderLeft: `6px solid #FF7A1D` }}><i className="fas fa-pen text-lg"></i> <span className="text-lg">BÀI {num}: {title}</span></div>;
  if (currentTplId === 'B') return <div className="p-2.5 font-bold text-center mt-2 rounded-full border-2" style={{ borderColor: themeColor, color: themeColor, backgroundColor: hexToRgbA(themeColor, 0.1) }}><span className="text-lg">BÀI {num}: {title}</span></div>;
  
  if (currentTplId === 'less_ribbon_pen') {
     return <div className="p-3 text-white font-bold flex items-center gap-3 mt-2 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" style={{ backgroundColor: themeColor, borderLeft: `6px solid #FF3B1D` }}><i className="fas fa-pen text-lg"></i> <span style={{ fontSize }}>BÀI {num}: {title}</span></div>;
  }
  return null;
};
export default LessonNode;