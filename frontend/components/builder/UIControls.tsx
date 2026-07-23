import React, { useState, useRef } from "react";
import { VP_COLORS } from "./config";

export const Accordion = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-3 px-4 font-bold text-gray-700 hover:bg-gray-50 text-[11px] uppercase tracking-wider">
        {title} <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="p-4 bg-white space-y-5">{children}</div>}
    </div>
  );
};

export const ColorControl = ({ label, value, onChange }: any) => {
  const getHex = (v: string) => {
    if (!v || v === 'none') return '#ffffff';
    const preset = VP_COLORS.find(c => c.val === v);
    if (preset) return preset.hex;
    if (v.startsWith('#')) return v;
    return '#ffffff';
  };
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 mb-2">{label}</label>
      <div className="flex gap-2 items-center">
        <div className="relative w-8 h-8 rounded border border-gray-300 shadow-sm flex-shrink-0" 
             style={
                value === 'none' 
                ? { backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAhjg////Pwz4ACNAYtRmRBXjM4wQwwEAi1YIEW8180EAAAAASUVORK5CYII=)', backgroundSize: '10px 10px' }
                : { backgroundColor: value }
             }>
             <input type="color" value={getHex(value)} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </div>
        <input type="text" value={value || 'none'} onChange={(e) => onChange(e.target.value)} className="flex-1 border p-1.5 text-xs rounded font-mono text-gray-600 outline-none focus:border-blue-500" />
        <button onClick={() => onChange('none')} className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 border rounded text-[10px] font-bold text-gray-500" title="Xóa màu">✕</button>
      </div>
    </div>
  );
};

export const NumberUnitControl = ({ label, value, onChange, min=0, max=100 }: any) => {
  const num = value ? parseFloat(value) : "";
  const unit = value?.toString().replace(/[0-9.-]/g, '') || 'pt';
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-[11px] font-bold text-gray-500">{label}</label>
        <select className="text-[10px] border border-gray-200 rounded px-1 outline-none text-gray-500" value={unit} onChange={(e) => onChange(`${num}${e.target.value}`)}>
          <option value="pt">PT</option><option value="px">PX</option><option value="cm">CM</option><option value="%">%</option>
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <input type="range" min={min} max={max} value={num || 0} onChange={(e) => onChange(`${e.target.value}${unit}`)} className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        <input type="number" value={num} onChange={(e) => onChange(`${e.target.value}${unit}`)} className="w-16 border p-1 text-xs rounded text-center outline-none focus:border-blue-500 font-mono [&::-webkit-inner-spin-button]:opacity-100" />
      </div>
    </div>
  );
};

export const FourWaySpacing = ({ label, prefix, properties, onChange, isRadius = false }: any) => {
  const [unit, setUnit] = useState('pt');
  const parseVal = (v: string) => v ? parseFloat(v) : '';
  const handleChange = (key: string, val: string) => val === '' ? onChange(key, '') : onChange(key, `${val}${unit}`);
  const isLinked = properties[`${prefix}Linked`] !== false;
  const items = isRadius ? [{ k: 'TopLeft', l: 'TRÊN TRÁI' }, { k: 'TopRight', l: 'TRÊN PHẢI' }, { k: 'BottomRight', l: 'DƯỚI PHẢI' }, { k: 'BottomLeft', l: 'DƯỚI TRÁI' }] : [{ k: 'Top', l: 'TOP' }, { k: 'Right', l: 'RIGHT' }, { k: 'Bottom', l: 'BOTTOM' }, { k: 'Left', l: 'LEFT' }];

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
         <label className="text-[11px] font-bold text-gray-500">{label}</label>
         <div className="flex gap-2 items-center">
           <button onClick={() => onChange(`${prefix}Linked`, !isLinked)} className={`text-[10px] px-2 py-0.5 rounded ${isLinked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}><i className={`fas ${isLinked ? 'fa-link' : 'fa-unlink'}`}></i></button>
           <select className="text-[10px] border border-gray-200 rounded px-1 outline-none text-gray-500" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="pt">PT</option><option value="px">PX</option><option value="cm">CM</option><option value="%">%</option>
           </select>
         </div>
      </div>
      {isLinked ? (
        <div className="flex items-center gap-2">
          <input type="number" value={parseVal(properties[prefix])} onChange={(e) => {
            const v = e.target.value;
            onChange(prefix, v ? `${v}${unit}` : '');
            items.forEach(i => onChange(`${prefix}${i.k}`, v ? `${v}${unit}` : ''));
          }} className="w-full border p-1.5 text-xs rounded text-center outline-none focus:border-blue-500 font-mono [&::-webkit-inner-spin-button]:opacity-100" />
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          {items.map(item => (
            <div key={item.k} className="flex flex-col items-center gap-1">
                <input type="number" value={parseVal(properties[`${prefix}${item.k}`])} onChange={(e) => handleChange(`${prefix}${item.k}`, e.target.value)} className="w-full border p-1.5 text-xs rounded text-center outline-none focus:border-blue-500 font-mono [&::-webkit-inner-spin-button]:opacity-100" />
                <span className="text-[8px] text-gray-400 text-center leading-tight">{item.l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MiniRichTextEditor = ({ value, onChange }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Trạng thái cho 2 công cụ mới
  const [inlineSize, setInlineSize] = useState('16pt');
  const [vSpace, setVSpace] = useState('-6pt');

  const insertText = (prefix: string, suffix: string = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = value || '';
    onChange(text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, start + prefix.length + (end - start)); }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-md focus-within:border-blue-500 overflow-hidden">
      <div className="flex flex-wrap bg-gray-50 border-b border-gray-200 p-1 gap-1 items-center">
        <button onClick={() => insertText('*', '*')} className="w-7 h-7 hover:bg-gray-200 rounded font-bold" title="In đậm"><i className="fas fa-bold"></i></button>
        <button onClick={() => insertText('_', '_')} className="w-7 h-7 hover:bg-gray-200 rounded italic" title="In nghiêng"><i className="fas fa-italic"></i></button>
        
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        
        {/* Nút Kẻ Line đã được "Ép sát" bằng lệnh #v() */}
        <button onClick={() => insertText(`\n#v(${vSpace})\n#line(length: 60%, stroke: 0.5pt)\n#v(${vSpace})\n`)} className="px-2 h-7 hover:bg-gray-200 rounded text-xs font-bold" title={`Kẻ ngang và hút 2 dòng lại gần nhau (${vSpace})`}><i className="fas fa-minus mr-1"></i> Line</button>
        <button onClick={() => insertText('#context counter(page).final().first()')} className="px-2 h-7 hover:bg-gray-200 rounded text-xs text-blue-600 font-bold bg-blue-50"># Trang</button>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        {/* Công cụ Tùy chỉnh Cỡ chữ */}
        <div className="flex items-center bg-white border rounded">
          <input type="text" value={inlineSize} onChange={e => setInlineSize(e.target.value)} className="w-10 p-1 text-[10px] outline-none text-center font-mono" />
          <button onClick={() => insertText(`#text(size: ${inlineSize})[`, `]`)} className="px-2 py-1 text-[10px] font-bold bg-gray-100 hover:bg-gray-200 border-l" title="Bôi đen văn bản rồi bấm để đổi cỡ chữ">Cỡ chữ</button>
        </div>

        {/* Công cụ Ép khoảng cách */}
        <div className="flex items-center bg-white border rounded">
          <input type="text" value={vSpace} onChange={e => setVSpace(e.target.value)} className="w-10 p-1 text-[10px] outline-none text-center font-mono" />
          <button onClick={() => insertText(`#v(${vSpace})\n`)} className="px-2 py-1 text-[10px] font-bold bg-gray-100 hover:bg-gray-200 border-l" title="Chèn ép sát/đẩy xa (#v)">Chỉnh lề</button>
        </div>
      </div>
      <textarea ref={textareaRef} className="w-full p-3 text-xs outline-none custom-scrollbar min-h-[120px] resize-y font-mono" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export const renderTypstPreview = (text: string) => {
  if (!text) return '';
  let html = text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/#text\(\s*size:\s*([^,)]+)[^)]*\)\s*\[(.*?)\]/g, '<span style="font-size: $1">$2</span>')
    .replace(/#v\(([-0-9.]+)(pt|px|em|cm|%)\)/g, '<div style="margin-top: $1$2"></div>')
    .replace(/#line\(length:\s*(.*?)%?,\s*stroke:\s*(.*?)\)/g, '<hr style="width: $1%; border-top: $2 solid currentColor; margin: 2px auto;" />')
    .replace(/#line\(length:\s*(.*?)%?\)/g, '<hr style="width: $1%; border-top: 1px solid currentColor; margin: 2px auto;" />')
    .replace(/#context counter\(page\)\.final\(\)\.first\(\)/g, '<span class="bg-blue-100 px-1 rounded text-blue-700 border border-blue-200 font-mono text-[10px]">Trang</span>')
    .replace(/\\\s*\n?/g, '<br />') // <--- Dịch dấu \ ép xuống dòng của Typst
    .replace(/\n/g, '<br />');       // <--- Giữ nguyên Enter thông thường

  html = html.replace(/<br \/>\s*<hr/g, '<hr').replace(/<hr(.*?)\/>\s*<br \/>/g, '<hr$1/>');
  html = html.replace(/<br \/>\s*<div style="margin-top/g, '<div style="margin-top').replace(/<\/div>\s*<br \/>/g, '</div>');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};