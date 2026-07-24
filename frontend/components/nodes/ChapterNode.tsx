import React from 'react';

interface Props {
  node: any;
}

const ChapterNode: React.FC<Props> = ({ node }) => {
  const { properties } = node;
  const num = properties?.num || '1';
  const title = properties?.title || 'TÊN CHƯƠNG';
  const style = properties?.template || 'chap_hexagon';
  const color = properties?.color || '#1E3A8A';
  const font = properties?.fontFamily || 'Arial, sans-serif';

  if (style === 'chap_hexagon') {
    return (
      <div className="relative w-full h-[90px] my-6 flex items-center" style={{ fontFamily: font }}>
        {/* Đường kẻ ngang dài 100% */}
        <div className="absolute left-[130px] right-0 h-[2px]" style={{ backgroundColor: color }}></div>
        
        {/* 2 Chấm tròn đuôi */}
        <div className="absolute right-0 w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }}></div>
        <div className="absolute right-[15px] w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }}></div>

        {/* Khối Lục giác CSS */}
        <div 
          className="absolute left-0 w-[100px] h-[80px] bg-white flex flex-col justify-center items-center z-10"
          style={{ 
            border: `3px solid ${color}`,
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
          }}
        >
          <span className="text-[10px] font-bold mt-1" style={{ color }}>CHƯƠNG</span>
          <span className="text-[32px] font-black leading-none" style={{ color }}>{num}</span>
        </div>

        {/* Tên Chương */}
        <div 
          className="absolute left-[140px] top-[20px] text-[24px] font-bold uppercase tracking-wide bg-white px-2 z-10" 
          style={{ color }}
        >
          {title}
        </div>
      </div>
    );
  }

  // Mẫu bo góc cơ bản (Default)
  return (
    <div className="w-full my-6 text-center">
      <div className="inline-block w-full py-4 rounded-xl" style={{ backgroundColor: `${color}1A` }}>
        <div className="text-sm font-bold mb-1" style={{ color }}>CHƯƠNG {num}</div>
        <div className="text-2xl font-black uppercase" style={{ color }}>{title}</div>
      </div>
    </div>
  );
};

export default ChapterNode;