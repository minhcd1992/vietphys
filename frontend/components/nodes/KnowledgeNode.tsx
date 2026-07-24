import React from 'react';

const KnowledgeNode = ({ node }: { node: any }) => {
  const p = node.properties || {};
  const type = p.boxType || 'definition';
  const color = p.color || '#1890FF';
  const title = p.title || '';
  const content = p.content || 'Nội dung khối kiến thức...';
  const bgLight = `${color}1A`; // Thêm 1A để tạo độ trong suốt 10%

  if (type === 'definition') {
    return (
      <div className="w-full my-4 p-4 rounded-r flex flex-col" style={{ backgroundColor: bgLight, border: `1px solid ${color}`, borderLeft: `4px solid ${color}` }}>
         {title && <div className="font-bold mb-1" style={{ color }}>{title}</div>}
         <div className="text-gray-800">{content}</div>
      </div>
    );
  }
  if (type === 'theorem') {
     return (
      <div className="w-full my-4 p-4 rounded" style={{ backgroundColor: bgLight }}>
         {title && <div className="font-bold mb-1" style={{ color }}>{title}</div>}
         <div className="text-gray-800 italic">{content}</div>
      </div>
    );
  }
  if (type === 'warning') {
     return (
      <div className="w-full my-4 p-3 rounded flex gap-3 items-start border" style={{ borderColor: '#FF3B1D' }}>
         <div className="text-[#FF3B1D] font-bold text-lg leading-none mt-1"><i className="fas fa-exclamation-triangle"></i></div>
         <div className="flex-1">
             {title && <div className="font-bold text-[#FF3B1D] mb-1">{title}</div>}
             <div className="text-gray-800">{content}</div>
         </div>
      </div>
    );
  }
  // Mặc định: Note (Lưu ý)
  return (
      <div className="w-full my-4 pl-4 py-1" style={{ borderLeft: `3px solid ${color}` }}>
         {title && <div className="font-bold mb-1" style={{ color }}>{title}</div>}
         <div className="text-gray-800">{content}</div>
      </div>
  );
};
export default KnowledgeNode;