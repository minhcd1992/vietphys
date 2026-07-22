import React, { useState, useEffect, useRef } from "react";
import { useBuilderStore, useSelectedNode, BuilderNode, ElementType } from "../store/builderStore";

// =====================================================================
// 1. TỪ ĐIỂN MÀU SẮC VIETPHYS
// =====================================================================
const VP_COLORS = [
  { name: 'Trong suốt', val: 'none', hex: 'transparent' },
  { name: 'NiceBlue', val: 'NiceBlue', hex: '#1890FF' },
  { name: 'FlameRed', val: 'FlameRed', hex: '#FF3B1D' },
  { name: 'FireOrange', val: 'FireOrange', hex: '#FF7A1D' },
  { name: 'NiceGreen', val: 'NiceGreen', hex: '#52C41A' },
  { name: 'NiceViolet', val: 'NiceViolet', hex: '#722ED1' },
  { name: 'VPGray', val: 'vpgray', hex: '#606060' },
  { name: 'Đen', val: 'black', hex: '#000000' },
  { name: 'Trắng', val: 'white', hex: '#FFFFFF' },
];

const hexToRgbA = (hex: string, alpha: number) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1).split('');
        if(c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        c = '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return hex;
}

// =====================================================================
// 2. WIDGETS TOOLBOX
// =====================================================================
const TOOLBOX_ITEMS = [
  { type: "Container", moduleName: "Container", icon: "fas fa-box", defaultProps: { direction: "column", gap: "10pt", bgType: "solid", bg: "none", borderLinked: true, borderStyle: "none", borderWidth: "1pt", borderColor: "#cccccc", radiusLinked: true, width: "100%", position: "relative", zIndex: "1" } },
  { type: "Container", moduleName: "Header", icon: "fas fa-arrow-up", defaultProps: { direction: "row", gap: "10pt", paddingBottom: "10pt", bgType: "solid", bg: "none", borderLinked: false, borderBottomStyle: "solid", borderBottomWidth: "1.5pt", borderBottomColor: "#1890FF", width: "100%" } },
  { type: "Container", moduleName: "Footer", icon: "fas fa-arrow-down", defaultProps: { direction: "row", gap: "10pt", paddingTop: "10pt", bgType: "solid", bg: "none", borderLinked: false, borderTopStyle: "solid", borderTopWidth: "1pt", borderTopColor: "#606060", width: "100%" } },
  { type: "Widget", moduleName: "Chapter", icon: "fas fa-book-open", defaultProps: { num: "I", title: "TÊN CHƯƠNG", color: "#1890FF", width: "100%" } },
  { type: "Widget", moduleName: "Lesson", icon: "fas fa-book", defaultProps: { num: "1", title: "TÊN BÀI HỌC", color: "#1890FF", width: "100%" } },
  { type: "Widget", moduleName: "Section", icon: "fas fa-bookmark", defaultProps: { num: "1", title: "TIÊU ĐỀ PHẦN", color: "#1890FF", width: "100%" } },
  { type: "Widget", moduleName: "Form", icon: "fas fa-tasks", defaultProps: { num: "1", title: "Tên dạng bài", color: "#FF3B1D", width: "100%" } },
  { type: "Widget", moduleName: "Box", icon: "fas fa-lightbulb", defaultProps: { boxType: "warning", title: "Chú ý", content: "Nội dung ghi chú...", width: "100%" } },
  { type: "Widget", moduleName: "Text", icon: "fas fa-font", defaultProps: { content: "Nhập văn bản *tại đây*...", align: "center", fontSize: "12", fontUnit: "pt", fontWeight: "regular", color: "#000000", width: "100%" } },
  { type: "Widget", moduleName: "Image", icon: "fas fa-image", defaultProps: { content: "placeholder_hinh_1.png", width: "70%" } },
  { type: "Widget", moduleName: "Icon", icon: "fas fa-star", defaultProps: { iconName: "fa-star", color: "#1890FF", fontSize: "16", fontUnit: "pt", align: "center", width: "auto" } },
];

// =====================================================================
// 3. UI COMPONENTS (ACCORDION, SPINNER, COLOR)
// =====================================================================
const Accordion = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-3 px-4 font-bold text-gray-700 hover:bg-gray-50 text-[11px] uppercase tracking-wider">
        {title} <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="p-4 bg-white space-y-5">{children}</div>}
    </div>
  );
}

const ColorControl = ({ label, value, onChange }: any) => {
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
        <div className="relative w-8 h-8 rounded border border-gray-300 shadow-sm flex-shrink-0" style={{ background: value && value !== 'none' ? getHex(value) : 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAKUlEQVQYlWP8//8/AwgwMTAwMDIwMAJiFAZKAWEoA4Qn6kJUc4B+BAA0HwQxXJp5IwAAAABJRU5ErkJggg==")', backgroundSize: 'cover' }}>
          <input type="color" value={getHex(value)} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        <input type="text" value={value || 'none'} onChange={(e) => onChange(e.target.value)} className="flex-1 border p-1.5 text-xs rounded font-mono text-gray-600 outline-none focus:border-blue-500" />
        <button onClick={() => onChange('none')} className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 border rounded text-[10px] font-bold text-gray-500" title="Xóa màu">✕</button>
      </div>
    </div>
  );
};

const NumberUnitControl = ({ label, value, onChange, min=0, max=100 }: any) => {
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

const FourWaySpacing = ({ label, prefix, properties, onChange, isRadius = false }: any) => {
  const [unit, setUnit] = useState('pt');
  const parseVal = (v: string) => v ? parseFloat(v) : '';
  const handleChange = (key: string, val: string) => {
     if (val === '') onChange(key, '');
     else onChange(key, `${val}${unit}`);
  };

  const isLinked = properties[`${prefix}Linked`] !== false;
  const toggleLink = () => onChange(`${prefix}Linked`, !isLinked);

  const items = isRadius
    ? [{ k: 'TopLeft', l: 'TRÊN TRÁI' }, { k: 'TopRight', l: 'TRÊN PHẢI' }, { k: 'BottomRight', l: 'DƯỚI PHẢI' }, { k: 'BottomLeft', l: 'DƯỚI TRÁI' }]
    : [{ k: 'Top', l: 'TOP' }, { k: 'Right', l: 'RIGHT' }, { k: 'Bottom', l: 'BOTTOM' }, { k: 'Left', l: 'LEFT' }];

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
         <label className="text-[11px] font-bold text-gray-500">{label}</label>
         <div className="flex gap-2 items-center">
           <button onClick={toggleLink} className={`text-[10px] px-2 py-0.5 rounded ${isLinked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`} title={isLinked ? "Đang liên kết" : "Nhập độc lập"}><i className={`fas ${isLinked ? 'fa-link' : 'fa-unlink'}`}></i></button>
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

// =====================================================================
// MINI RICH-TEXT EDITOR CHO TEXT WIDGET
// =====================================================================
const MiniRichTextEditor = ({ value, onChange }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);
    
    onChange(before + prefix + selected + suffix + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-md focus-within:border-blue-500 overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex bg-gray-50 border-b border-gray-200 p-1 gap-1 items-center">
        <button onClick={() => insertText('*', '*')} className="w-7 h-7 hover:bg-gray-200 rounded text-gray-700 font-bold" title="In đậm (Bold)"><i className="fas fa-bold"></i></button>
        <button onClick={() => insertText('_', '_')} className="w-7 h-7 hover:bg-gray-200 rounded text-gray-700 italic" title="In nghiêng (Italic)"><i className="fas fa-italic"></i></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button onClick={() => insertText('\n#line(length: 60%, stroke: 0.5pt)\n')} className="px-2 h-7 hover:bg-gray-200 rounded text-xs text-gray-700 font-bold" title="Đường kẻ ngang"><i className="fas fa-minus mr-1"></i> Line</button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button onClick={() => insertText('#context counter(page).final().first()')} className="px-2 h-7 hover:bg-gray-200 rounded text-xs text-blue-600 font-bold bg-blue-50" title="Biến: Tổng số trang"># Trang</button>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full p-3 text-xs outline-none custom-scrollbar min-h-[120px] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập nội dung tại đây. Có thể quét khối rồi bấm nút ở trên..."
      />
    </div>
  );
};

// PARSER ĐỂ HIỂN THỊ TYPST TRONG REACT PREVIEW
const renderTypstPreview = (text: string) => {
  if (!text) return '';
  let html = text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/#line\(length:\s*(.*?)%?,\s*stroke:\s*(.*?)\)/g, '<hr style="width: $1%; border-top: $2 solid currentColor; margin: 6px auto;" />')
    .replace(/#line\(length:\s*(.*?)%?\)/g, '<hr style="width: $1%; border-top: 1px solid currentColor; margin: 6px auto;" />')
    .replace(/#context counter\(page\)\.final\(\)\.first\(\)/g, '<span class="bg-blue-100 px-1 rounded text-blue-700 border border-blue-200 font-mono text-[10px]" title="Tổng số trang">Trang</span>')
    .replace(/\n/g, '<br />');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// =====================================================================
// 4. MAIN BUILDER APP
// =====================================================================
export default function WebBuilderTab() {
  const { rootNode, addNode, moveNode, updateNodeProps, removeNode, selectedNodeId, setSelectedNode } = useBuilderStore();
  const selectedNode = useSelectedNode();
  
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [activeTab, setActiveTab] = useState<"content" | "style" | "advanced">("content");
  const [generatedTypst, setGeneratedTypst] = useState("");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedTypst);
    alert("Đã sao chép mã Typst vào khay nhớ tạm!");
  };

  // -------------------------------------------------------------------
  // TRÌNH BIÊN DỊCH TYPST THÔNG MINH
  // -------------------------------------------------------------------
  useEffect(() => {
    let headerCode = ""; let footerCode = ""; let bodyCode = "";

    const formatColor = (c?: string) => {
      if (!c || c === 'none') return 'none';
      if (c.startsWith('#')) return `rgb("${c}")`;
      return c;
    };

    const formatBorder = (style?: string, width?: string, color?: string) => {
      if (!style || style === 'none') return 'none';
      const c = formatColor(color) || 'black';
      if (style === 'solid') return `${width || '1pt'} + ${c}`;
      return `(paint: ${c}, thickness: ${width || '1pt'}, dash: "${style}")`;
    };

    const getSpacingDict = (p: any, prefix: string) => {
      if (p[`${prefix}Linked`] !== false && p[prefix]) return p[prefix];
      const t = p[`${prefix}Top`]; const r = p[`${prefix}Right`];
      const b = p[`${prefix}Bottom`]; const l = p[`${prefix}Left`];
      let dict: string[] = [];
      if (t && t !== '0pt') dict.push(`top: ${t}`);
      if (r && r !== '0pt') dict.push(`right: ${r}`);
      if (b && b !== '0pt') dict.push(`bottom: ${b}`);
      if (l && l !== '0pt') dict.push(`left: ${l}`);
      if (dict.length === 0) return '0pt';
      return `(${dict.join(', ')})`;
    };

    const getRadiusDict = (p: any) => {
      if (p.radiusLinked !== false && p.radius) return p.radius;
      const tl = p.radiusTopLeft; const tr = p.radiusTopRight;
      const br = p.radiusBottomRight; const bl = p.radiusBottomLeft;
      let dict: string[] = [];
      if (tl && tl !== '0pt') dict.push(`top-left: ${tl}`);
      if (tr && tr !== '0pt') dict.push(`top-right: ${tr}`);
      if (br && br !== '0pt') dict.push(`bottom-right: ${br}`);
      if (bl && bl !== '0pt') dict.push(`bottom-left: ${bl}`);
      if (dict.length === 0) return '0pt';
      return `(${dict.join(', ')})`;
    };

    const getBorderDict = (p: any) => {
      if (p.borderLinked !== false) return formatBorder(p.borderStyle, p.borderWidth, p.borderColor);
      const sides: string[] = [];
      ['Top', 'Right', 'Bottom', 'Left'].forEach(s => {
         const b = formatBorder(p[`border${s}Style`], p[`border${s}Width`], p[`border${s}Color`]);
         if (b !== 'none') sides.push(`${s.toLowerCase()}: ${b}`);
      });
      if (sides.length === 0) return 'none';
      return `(${sides.join(', ')})`;
    };

    const renderNode = (node: BuilderNode, indent = ""): string => {
      const p = node.properties;
      let out = "";
      
      if (node.type === "Container") {
        const isHF = node.moduleName === "Header" || node.moduleName === "Footer";
        const flexDir = p.direction === 'row' ? 'ltr' : 'ttb';
        
        let bgCode = formatColor(p.bg);
        if (p.bgType === 'gradient' && p.bgGradientStart && p.bgGradientEnd) {
          bgCode = `gradient.linear(${formatColor(p.bgGradientStart)}, ${formatColor(p.bgGradientEnd)})`;
        }

        let boxProps = `bg: ${bgCode}, padding: ${getSpacingDict(p, 'padding')}, radius: ${getRadiusDict(p)}, border: ${getBorderDict(p)}`;

        let innerContent = "";
        if (p.direction === 'row') {
           const colWidths = node.children?.map(c => {
             const cw = c.properties.width;
             return (!cw || cw === '100%') ? '1fr' : cw;
           }).join(', ') || '1fr';
           innerContent = `${indent}  #grid(columns: (${colWidths}), column-gutter: ${p.gap || '0pt'}, align: horizon)[\n`;
           node.children?.forEach(c => { innerContent += `${indent}    [\n${renderNode(c, indent + "      ")}${indent}    ],\n`; });
           innerContent += `${indent}  ]\n`;
        } else {
           innerContent = `${indent}  #stack(dir: ttb, spacing: ${p.gap || '0pt'})[\n`;
           node.children?.forEach(c => innerContent += renderNode(c, indent + "    "));
           innerContent += `${indent}  ]\n`;
        }

        let boxCode = `${indent}#vp-css-box(${boxProps})[\n${innerContent}${indent}]\n`;

        const marginDict = getSpacingDict(p, 'margin');
        if (!isHF && marginDict !== '0pt') {
           out += `${indent}#pad${marginDict}[\n${boxCode}${indent}]\n`;
        } else {
           out += boxCode;
        }
        
      } else {
        const colorArg = p.color ? `, color: ${formatColor(p.color)}` : "";
        const fSize = `${p.fontSize || '12'}${p.fontUnit || 'pt'}`;

        switch (node.moduleName) {
          case "Chapter": out += `${indent}#vp-chapter("${p.num}", "${p.title}"${colorArg})\n`; break;
          case "Lesson": out += `${indent}#vp-lesson("${p.num}", "${p.title}"${colorArg})\n`; break;
          case "Section": out += `${indent}#vp-section("${p.num}", "${p.title}"${colorArg})\n`; break;
          case "Form": out += `${indent}#vp-form("${p.num}", "${p.title}"${colorArg})\n`; break;
          case "Box": out += `${indent}#vp-box(type: "${p.boxType || 'note'}", title: "${p.title}")[\n${indent}  ${p.content}\n${indent}]\n`; break;
          case "Image": out += `${indent}#image("/vietphys-package/img/${p.content}", width: 100%)\n`; break;
          case "Text": 
            // KHÔNG bọc Text trong hàm #text nếu không cần thiết vì có thể phá vỡ #line block bên trong
            // Thay vào đó dùng #set
            out += `${indent}#set text(size: ${fSize}, weight: "${p.fontWeight || 'regular'}", fill: ${formatColor(p.color)})\n${indent}${p.content}\n`; 
            break;
          case "Icon": out += `${indent}#text(size: ${fSize}, fill: ${formatColor(p.color)})[#${p.iconName}()]\n`; break;
        }

        if (p.align && p.align !== 'left') out = `${indent}#align(${p.align})[\n  ${out}${indent}]\n`;
        
        const marginDict = getSpacingDict(p, 'margin');
        if (marginDict !== '0pt') out = `${indent}#pad${marginDict}[\n${out}${indent}]\n`;
      }

      if (p.position === 'absolute') {
         let dx = p.left && p.left !== '0pt' ? `, dx: ${p.left}` : '';
         let dy = p.top && p.top !== '0pt' ? `, dy: ${p.top}` : '';
         out = `${indent}#place(top + left${dx}${dy})[\n${out}${indent}]\n`;
      }

      return out;
    };

    rootNode.children?.forEach(node => {
      if (node.moduleName === "Header") headerCode += renderNode(node, "    ");
      else if (node.moduleName === "Footer") footerCode += renderNode(node, "    ");
      else bodyCode += renderNode(node, "");
    });

    let code = `#import "vietphys-package/my-macros.typ": *\n#set text(lang: "vi")\n\n`;
    code += `#set page(\n  paper: "a4",\n  margin: (top: 2cm, bottom: 2cm, left: 1.5cm, right: 1.5cm),\n`;
    if (headerCode) code += `  header-ascent: 0pt,\n  header: [\n${headerCode}  ],\n`;
    if (footerCode) code += `  footer-descent: 0pt,\n  footer: [\n${footerCode}  ],\n`;
    code += `)\n\n${bodyCode}`;
    setGeneratedTypst(code);
  }, [rootNode]);

  // -------------------------------------------------------------------
  // NATIVE DRAG DROP LOGIC
  // -------------------------------------------------------------------
  const handleDrop = (e: React.DragEvent, targetParentId: string, destIndex: number) => {
    e.preventDefault(); e.stopPropagation();
    const dragType = e.dataTransfer.getData("builder/type");
    const payloadStr = e.dataTransfer.getData("builder/payload");
    if (!dragType || !payloadStr) return;
    const payload = JSON.parse(payloadStr);

    if (dragType === "NEW") {
      addNode(targetParentId, { type: payload.type, moduleName: payload.moduleName, properties: { ...payload.defaultProps }, children: payload.type === "Container" ? [] : undefined }, destIndex);
    } else if (dragType === "MOVE" && payload.id !== targetParentId) {
      moveNode(payload.id, targetParentId, destIndex);
    }
  };

  const DropZone = ({ parentId, index, direction }: any) => {
    const [isOver, setIsOver] = useState(false);
    return (
      <div onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsOver(true); }} onDragLeave={(e) => { e.preventDefault(); setIsOver(false); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsOver(false); handleDrop(e, parentId, index); }}
        className={`z-20 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${direction === 'row' ? 'w-4 h-full -mx-2' : 'h-4 w-full -my-2'}`}>
        <div className={`transition-all duration-200 rounded-full ${isOver ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-transparent'} ${direction === 'row' ? 'w-1 h-full' : 'h-1 w-full'}`} />
      </div>
    );
  };

  const RecursiveNode = ({ node, index }: any) => {
    const isSelected = selectedNodeId === node.id;
    const isSpecial = node.moduleName === "Header" || node.moduleName === "Footer";
    const p = node.properties;
    const themeColor = p.color || '#1890FF';
    
    const buildCssBorder = (side = '') => {
       const style = p[`border${side}Style`];
       if (!style || style === 'none') return 'none';
       return `${p[`border${side}Width`]?.replace('pt','px')} ${style} ${p[`border${side}Color`] || '#ccc'}`;
    };

    let borderCss: any = {};
    if (isSpecial) borderCss = { border: '1px dashed #ffa500' };
    else if (p.borderLinked !== false && p.borderStyle && p.borderStyle !== 'none') borderCss = { border: buildCssBorder() };
    else if (p.borderLinked === false) borderCss = { borderTop: buildCssBorder('Top'), borderRight: buildCssBorder('Right'), borderBottom: buildCssBorder('Bottom'), borderLeft: buildCssBorder('Left') };

    let radiusCss = p.radiusLinked !== false ? p.radius?.replace('pt','px') : `${p.radiusTopLeft?.replace('pt','px')||'0'} ${p.radiusTopRight?.replace('pt','px')||'0'} ${p.radiusBottomRight?.replace('pt','px')||'0'} ${p.radiusBottomLeft?.replace('pt','px')||'0'}`;
    let padCss = p.paddingLinked !== false ? p.padding?.replace('pt','px') : `${p.paddingTop?.replace('pt','px')||'0'} ${p.paddingRight?.replace('pt','px')||'0'} ${p.paddingBottom?.replace('pt','px')||'0'} ${p.paddingLeft?.replace('pt','px')||'0'}`;
    let marCss = p.marginLinked !== false ? p.margin?.replace('pt','px') : `${p.marginTop?.replace('pt','px')||'0'} ${p.marginRight?.replace('pt','px')||'0'} ${p.marginBottom?.replace('pt','px')||'0'} ${p.marginLeft?.replace('pt','px')||'0'}`;

    return (
      <div draggable onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData("builder/type", "MOVE"); e.dataTransfer.setData("builder/payload", JSON.stringify({ id: node.id })); }} onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); setActiveTab("content"); }}
        className={`group transition-all outline-none ${isSelected ? 'ring-2 ring-blue-500 shadow-sm z-30' : 'hover:ring-1 hover:ring-blue-300 z-10'} ${p.position === 'absolute' ? 'absolute' : 'relative'}`}
        style={{ 
          width: p.width || '100%', top: p.position === 'absolute' ? p.top?.replace('pt','px') : 'auto', left: p.position === 'absolute' ? p.left?.replace('pt','px') : 'auto', zIndex: p.zIndex || 1,
          display: p.direction === 'row' ? 'flex' : 'block', flexDirection: p.direction === 'row' ? 'row' : 'column',
          background: p.bgType === 'gradient' ? `linear-gradient(to right, ${p.bgGradientStart || '#ccc'}, ${p.bgGradientEnd || '#ccc'})` : (p.bg !== 'none' ? p.bg : 'transparent'),
          ...borderCss, borderRadius: radiusCss, padding: padCss, margin: marCss, gap: p.gap?.replace('pt','px'),
        }}
      >
        {isSelected && (
          <div className="absolute -top-7 left-0 bg-blue-500 text-white flex items-center rounded-t-md text-[10px] font-bold shadow-md h-7 z-50 cursor-move pointer-events-auto">
            <div className="px-3 h-full flex items-center border-r border-blue-400">✥ {node.moduleName}</div>
            <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} className="px-3 h-full flex items-center hover:bg-red-500 cursor-pointer">✕</button>
          </div>
        )}

        {node.type === "Container" ? (
          <div className={`w-full h-full min-h-[40px] flex ${p.direction === 'row' ? 'flex-row items-center' : 'flex-col'}`} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(e, node.id, node.children?.length || 0); }}>
            {isSpecial && <div className="absolute top-1 left-2 text-[10px] text-orange-500 font-bold uppercase pointer-events-none">{node.moduleName} Area</div>}
            {node.children?.length === 0 ? (
              <div className="flex-1 min-h-[40px] flex items-center justify-center m-1 pointer-events-none text-gray-300 text-[10px] tracking-widest uppercase border border-dashed border-gray-200">Kéo thả vào đây</div>
            ) : (
              <>
                <DropZone parentId={node.id} index={0} direction={p.direction} />
                {node.children?.map((child: any, i: number) => (
                  <React.Fragment key={child.id}><RecursiveNode node={child} index={i} /><DropZone parentId={node.id} index={i + 1} direction={p.direction} /></React.Fragment>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="w-full pointer-events-none px-2 py-1" style={{ textAlign: p.align || 'left' }}>
            {node.moduleName === "Chapter" && <div className="relative border border-dashed mt-4 mb-2 p-6" style={{ borderColor: themeColor }}><div className="absolute -top-4 left-4 px-3 py-1 text-white text-sm font-bold rounded-sm" style={{ backgroundColor: themeColor }}>Chương {p.num}</div><h1 className="text-2xl font-extrabold uppercase text-center" style={{ color: themeColor }}>{p.title}</h1></div>}
            {node.moduleName === "Lesson" && <div className="p-3 text-white font-bold flex items-center gap-3 mt-2 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" style={{ backgroundColor: themeColor, borderLeft: `6px solid #FF7A1D` }}><i className="fas fa-pen text-lg"></i> <span className="text-lg">BÀI {p.num}: {p.title}</span></div>}
            {node.moduleName === "Section" && <div className="flex items-center gap-3 mt-4 mb-2"><div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: themeColor }}><i className="fas fa-bookmark"></i></div><div className="flex-1 border-b-2 pb-1 font-bold text-lg uppercase" style={{ borderColor: `${themeColor}60`, color: themeColor }}>{p.num}. {p.title}</div></div>}
            {node.moduleName === "Form" && <div className="p-3 font-bold text-sm rounded-r-md border-l-4 mt-2" style={{ borderColor: themeColor, color: themeColor, backgroundColor: hexToRgbA(themeColor, 0.1) }}><i className="fas fa-tasks mr-2"></i> Dạng {p.num}: {p.title}</div>}
            {node.moduleName === "Box" && <div className={`border-l-4 p-4 mt-2 bg-gray-50 rounded-r-md shadow-sm ${p.boxType === 'warning' ? 'border-red-500' : p.boxType === 'tip' ? 'border-green-500' : 'border-blue-500'}`}><h5 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: p.boxType === 'warning' ? '#FF3B1D' : p.boxType === 'tip' ? '#52C41A' : '#1890FF' }}><i className={`fas ${p.boxType === 'warning' ? 'fa-exclamation-triangle' : p.boxType === 'tip' ? 'fa-lightbulb' : 'fa-bookmark'}`}></i> {p.title}</h5><p className="text-sm text-gray-700 whitespace-pre-wrap">{p.content}</p></div>}
            {node.moduleName === "Text" && <div style={{ fontSize: `${p.fontSize}px`, fontWeight: p.fontWeight === 'bold' ? 'bold' : 'normal', color: p.color }}>{renderTypstPreview(p.content)}</div>}
            {node.moduleName === "Image" && <div className="bg-gray-100 border border-dashed border-gray-300 text-gray-500 text-center py-4 rounded text-[10px] flex flex-col items-center gap-1" style={{ width: `100%` }}><i className="fas fa-image text-xl"></i> <span>{p.content}</span></div>}
            {node.moduleName === "Icon" && <div style={{ color: p.color, fontSize: `${p.fontSize}px` }}><i className={`fas ${p.iconName}`}></i></div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full bg-[#e9ebee] overflow-hidden font-sans" onClick={() => setSelectedNode(null)}>
      
      {/* ----------------- CỘT TRÁI: PROPERTIES PANEL ----------------- */}
      <div className="w-[320px] bg-white border-r flex flex-col shadow-2xl z-30 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {!selectedNode ? (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-[#333] text-white flex items-center justify-between">
              <span className="font-bold text-sm tracking-wide">HỌC KAGE</span><span className="text-xs bg-[#b32b55] px-2 py-0.5 rounded shadow">WIDGETS</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar">
              {TOOLBOX_ITEMS.map((item, index) => (
                <div key={index} draggable onDragStart={(e) => { e.dataTransfer.setData("builder/type", "NEW"); e.dataTransfer.setData("builder/payload", JSON.stringify(item)); }}
                  className="h-[76px] bg-gray-50 border border-gray-200 rounded-md flex flex-col items-center justify-center gap-2 cursor-grab hover:bg-white hover:border-blue-400 hover:shadow-md transition-all active:cursor-grabbing">
                  <i className={`${item.icon} text-2xl text-gray-500 pointer-events-none`}></i>
                  <span className="text-[10px] text-center leading-tight font-bold text-gray-500 uppercase pointer-events-none">{item.moduleName}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
            <div className="p-3 bg-[#333] text-white flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="text-xs bg-[#0073aa] px-2 py-0.5 rounded uppercase font-bold tracking-wider">{selectedNode.moduleName}</span></div>
            </div>
            
            <div className="flex border-b bg-white shadow-sm flex-shrink-0">
              <button onClick={() => setActiveTab("content")} className={`flex-1 py-3 text-[11px] font-bold uppercase ${activeTab === 'content' ? 'border-b-[3px] border-[#b32b55] text-[#333]' : 'text-gray-400'}`}>✎ Nội dung</button>
              <button onClick={() => setActiveTab("style")} className={`flex-1 py-3 text-[11px] font-bold uppercase ${activeTab === 'style' ? 'border-b-[3px] border-[#b32b55] text-[#333]' : 'text-gray-400'}`}>🎨 Kiểu</button>
              <button onClick={() => setActiveTab("advanced")} className={`flex-1 py-3 text-[11px] font-bold uppercase ${activeTab === 'advanced' ? 'border-b-[3px] border-[#b32b55] text-[#333]' : 'text-gray-400'}`}>⚙ Nâng cao</button>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              
              {/* === TAB NỘI DUNG === */}
              {activeTab === "content" && (
                <>
                  {selectedNode.type === "Container" && (
                    <Accordion title="Bố cục Container" defaultOpen={true}>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Hướng Flexbox (Direction)</label>
                      <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none" value={selectedNode.properties.direction} onChange={e => updateNodeProps(selectedNode.id, { direction: e.target.value })}>
                        <option value="column">↓ Dọc (Stack Top-to-Bottom)</option><option value="row">→ Ngang (Grid Left-to-Right)</option>
                      </select>
                      <div className="mt-4">
                         <NumberUnitControl label="Khoảng cách giữa (Gap)" value={selectedNode.properties.gap || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { gap: val })} max={100} />
                      </div>
                    </Accordion>
                  )}
                  {selectedNode.properties.num !== undefined && (
                    <Accordion title="Dữ liệu chính" defaultOpen={true}>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Chỉ số (Number)</label>
                      <input type="text" className="w-full border p-2 text-xs mb-3 rounded" value={selectedNode.properties.num} onChange={e => updateNodeProps(selectedNode.id, { num: e.target.value })}/>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Tiêu đề (Title)</label>
                      <input type="text" className="w-full border p-2 text-xs rounded" value={selectedNode.properties.title} onChange={e => updateNodeProps(selectedNode.id, { title: e.target.value })}/>
                    </Accordion>
                  )}
                  {selectedNode.properties.content !== undefined && (
                    <Accordion title={selectedNode.moduleName === "Image" ? "Nguồn Ảnh" : "Văn bản & Định dạng"} defaultOpen={true}>
                      {selectedNode.moduleName === "Text" ? (
                         <MiniRichTextEditor value={selectedNode.properties.content} onChange={(val: string) => updateNodeProps(selectedNode.id, { content: val })} />
                      ) : (
                         <textarea className="w-full border p-2 text-xs rounded min-h-[100px] custom-scrollbar" value={selectedNode.properties.content} onChange={e => updateNodeProps(selectedNode.id, { content: e.target.value })} />
                      )}
                    </Accordion>
                  )}
                  {selectedNode.properties.width !== undefined && selectedNode.moduleName === "Image" && (
                    <Accordion title="Kích thước ảnh" defaultOpen={true}>
                       <NumberUnitControl label="Độ rộng (%)" value={`${selectedNode.properties.width}%`} onChange={(val: string) => updateNodeProps(selectedNode.id, { width: val.replace('%','') })} min={10} max={100} />
                    </Accordion>
                  )}
                  {selectedNode.properties.iconName !== undefined && (
                    <Accordion title="FontAwesome Icon" defaultOpen={true}>
                      <label className="block text-[11px] font-bold text-gray-500 mb-2">Chọn Icon (Typst Native)</label>
                      <div className="grid grid-cols-5 gap-2">
                        {['fa-star', 'fa-bolt', 'fa-check', 'fa-pen', 'fa-info-circle', 'fa-exclamation-triangle', 'fa-bookmark', 'fa-lightbulb', 'fa-tasks', 'fa-graduation-cap', 'fa-book-open', 'fa-arrow-right', 'fa-arrow-left', 'fa-arrow-up', 'fa-arrow-down'].map(ic => (
                          <button key={ic} onClick={() => updateNodeProps(selectedNode.id, { iconName: ic })} title={ic} className={`p-2 border rounded hover:bg-gray-100 flex justify-center items-center ${selectedNode.properties.iconName === ic ? 'bg-blue-100 border-blue-500 shadow-inner' : ''}`}>
                             <i className={`fas ${ic} text-gray-700 text-lg`}></i>
                          </button>
                        ))}
                      </div>
                    </Accordion>
                  )}
                </>
              )}

              {/* === TAB KIỂU DÁNG === */}
              {activeTab === "style" && (
                <>
                  <Accordion title="Kích thước (Width)" defaultOpen={true}>
                     <label className="block text-[11px] font-bold text-gray-500 mb-1">Độ rộng</label>
                     <input type="text" className="w-full border p-2 text-xs rounded mb-1" placeholder="100%, 1fr, 50pt, auto..." value={selectedNode.properties.width || "100%"} onChange={e => updateNodeProps(selectedNode.id, { width: e.target.value })}/>
                     <span className="text-[10px] text-gray-400 italic">Nhập phần trăm (30%, 70%) hoặc '1fr' để chia cột khi nằm trong Container ngang.</span>
                  </Accordion>

                  {selectedNode.properties.color !== undefined && (
                    <Accordion title="Màu sắc (Color)" defaultOpen={true}>
                      <ColorControl label="Theme Color" value={selectedNode.properties.color} onChange={(val: string) => updateNodeProps(selectedNode.id, { color: val })} />
                    </Accordion>
                  )}

                  {selectedNode.properties.fontSize !== undefined && (
                    <Accordion title="Kiểu chữ (Typography)" defaultOpen={true}>
                      <NumberUnitControl label="Kích thước (Font Size)" value={`${selectedNode.properties.fontSize}${selectedNode.properties.fontUnit}`} onChange={(val: string) => updateNodeProps(selectedNode.id, { fontSize: parseFloat(val) || 12, fontUnit: val.replace(/[0-9.-]/g, '') || 'pt' })} max={72} />
                      <label className="block text-[11px] font-bold text-gray-500 mt-4 mb-1">Độ đậm (Weight)</label>
                      <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none" value={selectedNode.properties.fontWeight} onChange={e => updateNodeProps(selectedNode.id, { fontWeight: e.target.value })}>
                        <option value="regular">Bình thường (Regular)</option><option value="bold">Đậm (Bold)</option>
                      </select>
                    </Accordion>
                  )}

                  {selectedNode.properties.align !== undefined && (
                    <Accordion title="Căn chỉnh (Alignment)" defaultOpen={true}>
                      <div className="flex bg-gray-200 p-1 rounded gap-1">
                        {['left', 'center', 'right', 'justify'].map(a => (
                          <button key={a} onClick={() => updateNodeProps(selectedNode.id, { align: a })} className={`flex-1 py-1.5 text-xs rounded transition-colors ${selectedNode.properties.align === a ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:bg-gray-300'}`}><i className={`fas fa-align-${a}`}></i></button>
                        ))}
                      </div>
                    </Accordion>
                  )}

                  {selectedNode.type === "Container" && (
                    <>
                      <Accordion title="Nền (Background)" defaultOpen={true}>
                        <div className="flex bg-gray-200 p-1 rounded gap-1 mb-4">
                          <button onClick={() => updateNodeProps(selectedNode.id, { bgType: 'solid' })} className={`flex-1 py-1.5 text-xs rounded font-bold ${selectedNode.properties.bgType !== 'gradient' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-300'}`}>Màu Đơn</button>
                          <button onClick={() => updateNodeProps(selectedNode.id, { bgType: 'gradient' })} className={`flex-1 py-1.5 text-xs rounded font-bold ${selectedNode.properties.bgType === 'gradient' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-300'}`}>Gradient</button>
                        </div>
                        {selectedNode.properties.bgType !== 'gradient' ? (
                          <ColorControl label="Màu nền (Solid)" value={selectedNode.properties.bg} onChange={(val: string) => updateNodeProps(selectedNode.id, { bg: val })} />
                        ) : (
                          <div className="space-y-4">
                            <ColorControl label="Màu Bắt đầu (Start)" value={selectedNode.properties.bgGradientStart || "#1890FF"} onChange={(val: string) => updateNodeProps(selectedNode.id, { bgGradientStart: val })} />
                            <ColorControl label="Màu Kết thúc (End)" value={selectedNode.properties.bgGradientEnd || "#722ED1"} onChange={(val: string) => updateNodeProps(selectedNode.id, { bgGradientEnd: val })} />
                          </div>
                        )}
                      </Accordion>

                      <Accordion title="Đường Viền (Border)">
                        <div className="flex justify-between items-center mb-3">
                           <label className="text-[11px] font-bold text-gray-500">Tùy chỉnh Cạnh</label>
                           <button onClick={() => updateNodeProps(selectedNode.id, { borderLinked: selectedNode.properties.borderLinked === false })} className={`text-[10px] px-2 py-1 rounded ${selectedNode.properties.borderLinked !== false ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}><i className={`fas ${selectedNode.properties.borderLinked !== false ? 'fa-link' : 'fa-unlink'}`}></i> {selectedNode.properties.borderLinked !== false ? 'Viền chung' : 'Từng cạnh'}</button>
                        </div>

                        {selectedNode.properties.borderLinked !== false ? (
                          <div className="space-y-3">
                            <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none" value={selectedNode.properties.borderStyle} onChange={e => updateNodeProps(selectedNode.id, { borderStyle: e.target.value })}>
                              <option value="none">Không viền</option><option value="solid">Nét liền (Solid)</option><option value="dashed">Nét đứt (Dashed)</option><option value="dotted">Chấm bi (Dotted)</option>
                            </select>
                            {selectedNode.properties.borderStyle !== 'none' && selectedNode.properties.borderStyle && (
                              <>
                                <NumberUnitControl label="Độ dày viền (Width)" value={selectedNode.properties.borderWidth || "1pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { borderWidth: val })} max={20} />
                                <ColorControl label="Màu viền (Color)" value={selectedNode.properties.borderColor || "#cccccc"} onChange={(val: string) => updateNodeProps(selectedNode.id, { borderColor: val })} />
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {['Top', 'Right', 'Bottom', 'Left'].map(side => (
                              <div key={side} className="border-b pb-3 mb-3 border-gray-100 last:border-0 last:pb-0 last:mb-0">
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-2">Viền {side}</label>
                                <div className="flex gap-2 mb-2">
                                  <select className="flex-1 border p-1 text-xs rounded" value={selectedNode.properties[`border${side}Style`] || 'none'} onChange={e => updateNodeProps(selectedNode.id, { [`border${side}Style`]: e.target.value })}>
                                    <option value="none">Không</option><option value="solid">Liền</option><option value="dashed">Đứt</option><option value="dotted">Chấm</option>
                                  </select>
                                  <input type="number" placeholder="Độ dày (pt)" value={parseFloat(selectedNode.properties[`border${side}Width`]) || 0} onChange={e => updateNodeProps(selectedNode.id, { [`border${side}Width`]: `${e.target.value}pt` })} className="w-16 border p-1 text-xs rounded [&::-webkit-inner-spin-button]:opacity-100" />
                                </div>
                                {selectedNode.properties[`border${side}Style`] !== 'none' && selectedNode.properties[`border${side}Style`] && (
                                  <ColorControl label={`Màu viền ${side}`} value={selectedNode.properties[`border${side}Color`]} onChange={(val: string) => updateNodeProps(selectedNode.id, { [`border${side}Color`]: val })} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 border-t pt-4">
                          <FourWaySpacing label="Bo góc (Border Radius)" prefix="radius" properties={selectedNode.properties} onChange={(k:string, v:string) => updateNodeProps(selectedNode.id, { [k]: v })} isRadius={true} />
                        </div>
                      </Accordion>
                    </>
                  )}
                </>
              )}

              {/* === TAB NÂNG CAO === */}
              {activeTab === "advanced" && (
                <>
                  <Accordion title="Padding (Lề trong khối)" defaultOpen={true}>
                    <FourWaySpacing label="Padding" prefix="padding" properties={selectedNode.properties} onChange={(k:string, v:string) => updateNodeProps(selectedNode.id, { [k]: v })} />
                  </Accordion>

                  {selectedNode.moduleName !== "Header" && selectedNode.moduleName !== "Footer" && (
                     <Accordion title="Margin (Khoảng cách bên ngoài)">
                       <FourWaySpacing label="Margin" prefix="margin" properties={selectedNode.properties} onChange={(k:string, v:string) => updateNodeProps(selectedNode.id, { [k]: v })} />
                     </Accordion>
                  )}

                  <Accordion title="Định vị tuyệt đối (Absolute Position)">
                    <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none mb-4" value={selectedNode.properties.position} onChange={e => updateNodeProps(selectedNode.id, { position: e.target.value })}>
                      <option value="relative">Mặc định (Trong luồng)</option><option value="absolute">Tuyệt đối (Trôi nổi lên trên)</option>
                    </select>
                    {selectedNode.properties.position === 'absolute' && (
                      <div className="space-y-3">
                        <NumberUnitControl label="Cách lề trên (Top / dy)" value={selectedNode.properties.top || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { top: val })} min={-500} max={1000} />
                        <NumberUnitControl label="Cách lề trái (Left / dx)" value={selectedNode.properties.left || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { left: val })} min={-500} max={1000} />
                        <div><label className="block text-[10px] text-gray-500 mb-1">Z-Index (Độ nổi)</label><input type="number" className="w-full border p-1.5 text-xs rounded" value={selectedNode.properties.zIndex || 1} onChange={e => updateNodeProps(selectedNode.id, { zIndex: e.target.value })}/></div>
                      </div>
                    )}
                  </Accordion>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ----------------- CỘT PHẢI: CANVAS & CODE ----------------- */}
      <div className="flex-1 flex flex-col relative h-full">
        <div className="h-12 bg-white flex justify-between items-center border-b px-4 shadow-sm z-20">
           <div className="font-bold text-gray-700 text-sm"><span>📄</span> Document Canvas</div>
           <div className="flex gap-4 items-center">
             <div className="flex bg-gray-100 p-1 rounded">
               <button onClick={() => setViewMode("preview")} className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-eye mr-1"></i> Trực quan</button>
               <button onClick={() => setViewMode("code")} className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-code mr-1"></i> Mã Typst</button>
             </div>
             {viewMode === "code" && (
               <button onClick={handleCopyCode} className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded shadow transition-colors"><i className="fas fa-copy mr-1"></i> Copy Code</button>
             )}
           </div>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex justify-center pb-40 bg-[#e9ebee]">
          {viewMode === "preview" ? (
            <div className="w-[850px] min-h-[1000px] bg-white shadow-xl flex flex-col relative" onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(e, rootNode.id, rootNode.children?.length || 0); }}>
              <DropZone parentId={rootNode.id} index={0} direction={rootNode.properties.direction} />
              {rootNode.children?.map((child, index) => (
                <React.Fragment key={child.id}>
                  <RecursiveNode node={child} parentId={rootNode.id} index={index} />
                  <DropZone parentId={rootNode.id} index={index + 1} direction={rootNode.properties.direction} />
                </React.Fragment>
              ))}
              {rootNode.children?.length === 0 && <div className="absolute inset-14 border-4 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-2xl font-bold rounded-2xl pointer-events-none">Kéo Widget vào đây</div>}
            </div>
          ) : (
            <div className="w-[850px] bg-[#1e1e1e] p-6 rounded-lg font-mono text-[13px] leading-relaxed text-[#d4d4d4] whitespace-pre-wrap shadow-2xl border border-gray-700">{generatedTypst}</div>
          )}
        </div>
      </div>
    </div>
  );
}