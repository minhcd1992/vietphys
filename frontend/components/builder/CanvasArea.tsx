import React, { useState, useEffect } from "react";
import { useBuilderStore } from "../../store/builderStore";
import { generateTypstCode } from "../../utils/typstParser";
import { renderTypstPreview } from "./UIControls";
import { hexToRgbA } from "./config";

export default function CanvasArea() {
  const { rootNode, addNode, moveNode, removeNode, selectedNodeId, setSelectedNode } = useBuilderStore();
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [generatedTypst, setGeneratedTypst] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const [customChapterTpls, setCustomChapterTpls] = useState<any[]>([]);
  const [customLessonTpls, setCustomLessonTpls] = useState<any[]>([]);
  const [customSectionTpls, setCustomSectionTpls] = useState<any[]>([]);

  useEffect(() => {
    setGeneratedTypst(generateTypstCode(rootNode));
    try {
        const storedChap = localStorage.getItem('vp_custom_chapter_tpls');
        if (storedChap) setCustomChapterTpls(JSON.parse(storedChap));
        const storedLess = localStorage.getItem('vp_custom_lesson_tpls');
        if (storedLess) setCustomLessonTpls(JSON.parse(storedLess));
        const storedSec = localStorage.getItem('vp_custom_section_tpls');
        if (storedSec) setCustomSectionTpls(JSON.parse(storedSec));
    } catch (e) {}
  }, [rootNode]);

  const paperSize = rootNode.properties?.paperSize || 'a4';
  const canvasWidth = paperSize === 'a5' ? 559 : 794; 
  const canvasMinHeight = paperSize === 'a5' ? 794 : 1123;

  const getPx = (val?: string, defaultVal = '15') => parseInt(val?.replace('pt', '') || defaultVal);
  const paddingTop = getPx(rootNode.properties?.marginTop);
  const paddingRight = getPx(rootNode.properties?.marginRight);
  const paddingBottom = getPx(rootNode.properties?.marginBottom);
  const paddingLeft = getPx(rootNode.properties?.marginLeft);

  // 🌟 HÀM BƠM DATA VÀ THEME
  const injectDataToTemplate = (tplNode: any, data: {num?: string, title?: string}, themeProps?: any): any => {
      const clone = JSON.parse(JSON.stringify(tplNode)); 
      const replaceText = (str: string) => {
          if (!str || typeof str !== 'string') return str;
          return str.replace(/\{\{num\}\}/g, data.num || '').replace(/\{\{title\}\}/g, data.title || '');
      };
      const traverse = (n: any) => {
          if (n.id && !n.id.startsWith('virtual_')) n.id = `virtual_${Math.random().toString(36).substr(2, 9)}`; 
          
          if (n.properties) {
              if (n.properties.content) n.properties.content = replaceText(n.properties.content);
              if (n.properties.title) n.properties.title = replaceText(n.properties.title);

              if (themeProps) {
                  if (themeProps.color) n.properties.color = themeProps.color;
                  if (themeProps.fontFamily && n.moduleName === "Text") n.properties.fontFamily = themeProps.fontFamily;
              }
          }
          if (n.children) n.children.forEach(traverse);
      };
      traverse(clone);
      return clone;
  };

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

  const handleClearCanvas = () => {
    if (window.confirm("Cảnh báo: Thầy có chắc chắn muốn XÓA TOÀN BỘ Canvas không?")) {
      rootNode.children?.forEach((c: any) => removeNode(c.id));
    }
  };

  // 🌟 HÀM LƯU GHI ĐÈ TEMPLATE
  const handleSaveTemplate = (e: any, nodeToSave: any, templateType: 'chapter' | 'lesson' | 'section' = 'chapter') => {
    e.stopPropagation();
    const storageKey = `vp_custom_${templateType}_tpls`;
    let currentTpls = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const existingIndex = currentTpls.findIndex((t: any) => t.id === nodeToSave.id);

    if (existingIndex >= 0) {
        if (window.confirm(`Mẫu này đã tồn tại trong kho. Thầy có muốn GHI ĐÈ cập nhật mới không?`)) {
            currentTpls[existingIndex].nodeData = nodeToSave;
            localStorage.setItem(storageKey, JSON.stringify(currentTpls));
            alert("✅ Đã cập nhật (ghi đè) Mẫu thành công!");
        }
    } else {
        const tplName = window.prompt("Nhập tên cho Mẫu thiết kế này:", "Mẫu Tùy Chỉnh Mới");
        if (!tplName) return; 
        currentTpls.push({ id: nodeToSave.id, name: tplName, nodeData: nodeToSave });
        localStorage.setItem(storageKey, JSON.stringify(currentTpls));
        alert("✅ Đã lưu Mẫu MỚI thành công!");
    }
  };

  const handleDownloadPDF = async () => {
    setIsCompiling(true);
    try {
      const res = await fetch("http://localhost:8000/api/compile-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typst_code: generatedTypst })
      });
      if (!res.ok) throw new Error("Lỗi Server");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = "tai-lieu-hoc-kage.pdf";
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch (error: any) { alert("Lỗi biên dịch PDF:\n" + error.message); } 
    finally { setIsCompiling(false); }
  };

  const DropZone = ({ parentId, index, direction }: any) => {
    const [isOver, setIsOver] = useState(false);
    return (
      <div onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsOver(true); }} onDragLeave={() => setIsOver(false)} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsOver(false); handleDrop(e, parentId, index); }}
        className={`z-20 flex items-center justify-center flex-shrink-0 transition-all ${direction === 'row' ? 'w-4 h-full -mx-2' : 'h-4 w-full -my-2'}`}>
        <div className={`transition-all rounded-full ${isOver ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-transparent'} ${direction === 'row' ? 'w-1 h-full' : 'h-1 w-full'}`} />
      </div>
    );
  };

  const extractImgString = (raw: string) => {
    if (!raw) return "";
    let str = raw.trim();
    const match = str.match(/url\(['"]?(.*?)['"]?\)/i);
    if (match) return match[1];
    return str.replace(/['";]+$/, '').trim();
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

    let bgImageCss = 'none';
    let bgColorCss = p.bg !== 'none' ? p.bg : 'transparent';
    let bgSizeCss = undefined;
    let bgPosCss = undefined;
    let bgRepeatCss = undefined;

    if (p.bgType === 'gradient') {
        bgImageCss = `linear-gradient(${p.gradientAngle || 135}deg, ${p.bgGradientStart || '#ccc'}, ${p.bgGradientEnd || '#ccc'})`;
        bgColorCss = 'transparent';
    } else if (p.bgType === 'image' && p.bgImage) {
        bgColorCss = 'transparent';
        let cleanBgImage = extractImgString(p.bgImage);
        
        if (cleanBgImage.startsWith('<svg')) {
            if (!cleanBgImage.includes('preserveAspectRatio')) cleanBgImage = cleanBgImage.replace(/<svg/i, '<svg preserveAspectRatio="none"');
            cleanBgImage = cleanBgImage.replace(/\{\{color\}\}/gi, themeColor);
            cleanBgImage = `data:image/svg+xml,${encodeURIComponent(cleanBgImage)}`;
        } else if (cleanBgImage.startsWith('data:image/svg+xml')) {
            let isBase64 = cleanBgImage.includes(';base64,');
            let svgData = cleanBgImage.substring(cleanBgImage.indexOf(',') + 1);
            let rawSvg = "";
            if (isBase64) {
               try { rawSvg = decodeURIComponent(escape(atob(svgData))); } catch(e) { try { rawSvg = atob(svgData); } catch(err){} }
            } else {
               try { rawSvg = decodeURIComponent(svgData); } catch(e) { rawSvg = unescape(svgData); }
            }
            if (!rawSvg.includes('preserveAspectRatio')) rawSvg = rawSvg.replace(/<svg/i, '<svg preserveAspectRatio="none"');
            rawSvg = rawSvg.replace(/\{\{color\}\}/gi, themeColor);
            cleanBgImage = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(rawSvg)))}`;
        }

        bgImageCss = `url("${cleanBgImage}")`;
        bgSizeCss = p.bgImageDisplay === 'stretch' ? '100% 100%' : (p.bgImageDisplay || 'cover');
        bgPosCss = 'top left'; 
        bgRepeatCss = p.bgImageDisplay === 'pattern' ? 'repeat' : 'no-repeat';
    }

    const inlineStyles: React.CSSProperties = {
      width: p.width || '100%',
      height: p.height && p.height !== 'auto' ? p.height : 'auto',
      backgroundColor: bgColorCss, backgroundImage: bgImageCss, backgroundSize: bgSizeCss, backgroundPosition: bgPosCss, backgroundRepeat: bgRepeatCss,
      ...borderCss, 
      top: p.position === 'absolute' ? p.top?.replace('pt','px') : 'auto', left: p.position === 'absolute' ? p.left?.replace('pt','px') : 'auto', zIndex: p.zIndex || 1,
    };

    return (
      <div draggable onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData("builder/type", "MOVE"); e.dataTransfer.setData("builder/payload", JSON.stringify({ id: node.id })); }} onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
        className={`group transition-all outline-none ${isSelected ? 'ring-2 ring-blue-500 shadow-sm z-30' : 'hover:ring-1 hover:ring-blue-300 z-10'} ${p.position === 'absolute' ? 'absolute' : 'relative'}`}
        style={inlineStyles}
      >
        {isSelected && (
          <div className="absolute -top-7 left-0 bg-blue-500 text-white flex items-center rounded-t-md text-[10px] font-bold shadow-md h-7 z-50 cursor-move pointer-events-auto">
            <div className="px-3 h-full flex items-center border-r border-blue-400">✥ {node.moduleName}</div>
            
            {node.type === "Container" && (
                <div className="flex items-center h-full border-r border-blue-400">
                    <button onClick={(e) => handleSaveTemplate(e, node, 'chapter')} className="px-2 h-full hover:bg-blue-600 transition-colors">💾 Chương</button>
                    <button onClick={(e) => handleSaveTemplate(e, node, 'lesson')} className="px-2 h-full border-l border-blue-400 hover:bg-blue-600 transition-colors">💾 Bài</button>
                    <button onClick={(e) => handleSaveTemplate(e, node, 'section')} className="px-2 h-full border-l border-blue-400 hover:bg-blue-600 transition-colors">💾 Phần</button>
                </div>
            )}

            <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} className="px-3 h-full flex items-center hover:bg-red-500 cursor-pointer">✕</button>
          </div>
        )}

        {node.type === "Container" ? (
          <div 
            className={`w-full ${(!node.children || node.children.length === 0) ? 'min-h-[40px]' : ''}`}
            style={{
              display: p.layoutType === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: p.layoutType === 'grid' ? p.gridCols?.replace(/pt/g, 'px') : undefined,
              flexDirection: p.layoutType !== 'grid' ? (p.direction === 'row' ? 'row' : 'column') : undefined,
              alignItems: p.direction === 'row' || p.layoutType === 'grid' ? 'center' : 'stretch',
              gap: (p.gap || '0pt').replace('pt', 'px'),
              height: '100%',
            }}
            onDragOver={(e) => { if(p.layoutType !== 'grid') { e.preventDefault(); e.stopPropagation(); } }} 
            onDrop={(e) => { if(p.layoutType !== 'grid') { e.preventDefault(); e.stopPropagation(); handleDrop(e, node.id, node.children?.length || 0); } }}
          >
            {p.layoutType === 'grid' ? (() => {
               const cols = p.gridCols ? p.gridCols.split(/\s+/).filter(Boolean).length : 1;
               const childCount = node.children?.length || 0;
               let totalSlots = Math.max(cols, Math.ceil((childCount + 1) / cols) * cols);
               if (childCount === 0) totalSlots = cols;

               const gridCells = [];
               for (let i = 0; i < totalSlots; i++) {
                   if (i < childCount) {
                       gridCells.push(<React.Fragment key={node.children[i].id}><RecursiveNode node={node.children[i]} index={i} /></React.Fragment>);
                   } else {
                       gridCells.push(
                           <div key={`empty-slot-${i}`} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(e, node.id, childCount); }}
                               className="min-h-[45px] h-full w-full border-2 border-dashed border-white/60 bg-black/5 flex items-center justify-center text-[9px] text-white/80 font-bold uppercase tracking-widest hover:bg-blue-500/30 hover:border-blue-300 transition-colors cursor-crosshair rounded-md backdrop-blur-sm shadow-inner">
                               + Ô {i + 1}
                           </div>
                       );
                   }
               }
               return gridCells;
            })() : (
               node.children?.length === 0 ? (
                 <div className="flex-1 min-h-[40px] flex items-center justify-center m-1 pointer-events-none text-gray-300 text-[10px] tracking-widest uppercase border border-dashed border-gray-200">Kéo thả vào đây</div>
               ) : (
                 <>
                   <DropZone parentId={node.id} index={0} direction={p.direction} />
                   {node.children?.map((child: any, i: number) => (
                     <React.Fragment key={child.id}><RecursiveNode node={child} index={i} /><DropZone parentId={node.id} index={i + 1} direction={p.direction} /></React.Fragment>
                   ))}
                 </>
               )
            )}
          </div>
        ) : (
          <div className="w-full pointer-events-none" style={{ textAlign: p.align || 'left' }}>
            
            {/* 🌟 MÔ PHỎNG HIỂN THỊ CÁC MẪU CHƯƠNG TRÊN WEB 🌟 */}
            {node.moduleName === "Chapter" && (() => {
                const currentTplId = p.template && p.template !== 'global' ? p.template : (rootNode.properties.tplChapter || 'A');
                
                if (currentTplId === 'A') return <div className="relative border border-dashed mt-4 mb-2 p-6" style={{ borderColor: themeColor }}><div className="absolute -top-4 left-4 px-3 py-1 text-white text-sm font-bold rounded-sm" style={{ backgroundColor: themeColor }}>Chương {p.num}</div><h1 className="text-2xl font-extrabold uppercase text-center" style={{ color: themeColor }}>{p.title}</h1></div>;
                if (currentTplId === 'B') return <div className="mt-4 mb-2 p-6 rounded-lg text-center" style={{backgroundColor: themeColor}}><div className="text-white text-sm font-bold opacity-80">CHƯƠNG {p.num}</div><h1 className="text-2xl font-extrabold text-white mt-1 uppercase">{p.title}</h1></div>;
                
                // --- 6 MẪU SGK MỚI ---
                if (currentTplId.startsWith('chap_style_')) {
                    let svg = "";
                    let dxNum = "11%", dyNum = "15%", dxTitle = "24%", dyTitle = "35%";
                    let numColor = themeColor, titleColor = themeColor;
                    
                    if (currentTplId === 'chap_style_1') {
                        svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="120" y1="20" x2="680" y2="20" stroke="${themeColor}" stroke-width="1.5"/><circle cx="700" cy="20" r="2" fill="${themeColor}"/><circle cx="715" cy="20" r="2" fill="${themeColor}"/><circle cx="730" cy="20" r="2" fill="${themeColor}"/><line x1="120" y1="80" x2="690" y2="80" stroke="${themeColor}" stroke-width="1.5"/><polygon points="690,80 730,80 730,50" fill="${themeColor}"/><circle cx="15" cy="50" r="3" fill="none" stroke="${themeColor}" stroke-width="1.5"/><line x1="18" y1="50" x2="40" y2="50" stroke="${themeColor}" stroke-width="1.5"/><polygon points="40,50 60,15 110,15 130,50 110,85 60,85" fill="white" stroke="${themeColor}" stroke-width="3"/></svg>`;
                        dxNum = "7%"; dyNum = "15%"; dxTitle = "24%"; dyTitle = "35%";
                    } else if (currentTplId === 'chap_style_2') {
                        svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="85" y="15" width="640" height="70" rx="15" fill="white" stroke="${themeColor}" stroke-width="1.5"/><path d="M 685 15 L 710 15 A 15 15 0 0 1 725 30 L 725 85 A 15 15 0 0 1 710 100 L 685 100 Z" fill="${themeColor}" opacity="0.3"/><path d="M 705 45 v 20 a 8 8 0 1 0 10 0 v -20 a 5 5 0 0 0 -10 0 z" fill="none" stroke="${themeColor}" stroke-width="2"/><circle cx="680" cy="25" r="2" fill="${themeColor}"/><circle cx="690" cy="25" r="2" fill="${themeColor}"/><circle cx="700" cy="25" r="2" fill="${themeColor}"/><circle cx="85" cy="50" r="40" fill="white" stroke="${themeColor}" stroke-width="3"/><path d="M 85 0 A 50 50 0 0 0 35 50 A 50 50 0 0 0 85 100" fill="none" stroke="${themeColor}" stroke-width="3"/><circle cx="85" cy="0" r="3" fill="${themeColor}"/><circle cx="85" cy="100" r="3" fill="${themeColor}"/></svg>`;
                        dxNum = "5%"; dyNum = "22%"; dxTitle = "22%"; dyTitle = "35%";
                    } else if (currentTplId === 'chap_style_3') {
                        svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="25" width="690" height="60" fill="white" stroke="${themeColor}" stroke-width="1.5"/><line x1="35" y1="85" x2="500" y2="85" stroke="white" stroke-width="3"/><line x1="35" y1="85" x2="500" y2="85" stroke="${themeColor}" stroke-width="1.5" stroke-dasharray="8 4"/><polygon points="35,0 120,0 120,70 77.5,95 35,70" fill="${themeColor}"/><polygon points="25,10 35,10 35,25 25,10" fill="${themeColor}" opacity="0.6"/><circle cx="670" cy="45" r="10" fill="none" stroke="${themeColor}" stroke-width="1.5"/><text x="670" y="49" font-family="Arial" font-size="10" font-weight="bold" fill="${themeColor}" text-anchor="middle">V</text><path d="M 620 70 l 10 0 l 5 -10 l 10 20 l 10 -20 l 10 20 l 5 -10 l 10 0" fill="none" stroke="${themeColor}" stroke-width="1.5"/><line x1="670" y1="55" x2="670" y2="70" stroke="${themeColor}" stroke-width="1.5"/></svg>`;
                        dxNum = "4.5%"; dyNum = "15%"; dxTitle = "22%"; dyTitle = "40%";
                        numColor = "white"; titleColor = "#333";
                    } else if (currentTplId === 'chap_style_4') {
                        svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="140" y1="20" x2="720" y2="20" stroke="${themeColor}" stroke-width="1.5"/><circle cx="725" cy="20" r="2.5" fill="${themeColor}"/><path d="M 620 80 l 15 -15 l 20 30 l 20 -30 l 15 15 l 20 0" fill="none" stroke="${themeColor}" stroke-width="1.5"/><line x1="620" y1="80" x2="160" y2="80" stroke="${themeColor}" stroke-width="1.5"/><polygon points="30,90 60,10 140,10 110,90" fill="${themeColor}"/><line x1="145" y1="20" x2="120" y2="80" stroke="${themeColor}" stroke-width="1.5"/><path d="M 115 95 l 10 -10 m 5 10 l 10 -10 m 5 10 l 10 -10 m 5 10 l 10 -10 m 5 10 l 10 -10" fill="none" stroke="${themeColor}" stroke-width="2" opacity="0.4"/></svg>`;
                        dxNum = "6%"; dyNum = "22%"; dxTitle = "26%"; dyTitle = "35%";
                        numColor = "white";
                    } else if (currentTplId === 'chap_style_5') {
                        svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="110" y1="20" x2="720" y2="20" stroke="${themeColor}" stroke-width="1.5"/><circle cx="725" cy="20" r="2.5" fill="${themeColor}"/><line x1="110" y1="80" x2="600" y2="80" stroke="${themeColor}" stroke-width="1.5"/><circle cx="610" cy="80" r="1.5" fill="${themeColor}"/><circle cx="620" cy="80" r="1.5" fill="${themeColor}"/><circle cx="630" cy="80" r="1.5" fill="${themeColor}"/><circle cx="640" cy="80" r="1.5" fill="${themeColor}"/><circle cx="85" cy="50" r="35" fill="white" stroke="${themeColor}" stroke-width="2"/><circle cx="85" cy="50" r="43" fill="none" stroke="${themeColor}" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="85" cy="50" r="50" fill="none" stroke="${themeColor}" stroke-width="1.5"/><circle cx="35" cy="50" r="2.5" fill="${themeColor}"/><circle cx="85" cy="100" r="2.5" fill="${themeColor}"/><path d="M 680 50 l 40 0 M 700 30 l 0 40 M 686 36 l 28 28 M 686 64 l 28 -28" fill="none" stroke="${themeColor}" stroke-width="1.5"/></svg>`;
                        dxNum = "5%"; dyNum = "22%"; dxTitle = "24%"; dyTitle = "35%";
                        titleColor = "#333";
                    } else if (currentTplId === 'chap_style_6') {
                        svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="25" width="650" height="60" fill="white" stroke="${themeColor}" stroke-width="1.5"/><path d="M 660 15 l -15 10 m -5 -10 l -15 10 m -5 -10 l -30 0" fill="none" stroke="${themeColor}" stroke-width="4" opacity="0.6"/><polygon points="35,10 110,10 110,95 72.5,75 35,95" fill="${themeColor}"/><polygon points="110,10 120,10 110,25" fill="${themeColor}" opacity="0.6"/><ellipse cx="670" cy="55" rx="15" ry="6" transform="rotate(30 670 55)" fill="none" stroke="${themeColor}" stroke-width="1.5"/><ellipse cx="670" cy="55" rx="15" ry="6" transform="rotate(90 670 55)" fill="none" stroke="${themeColor}" stroke-width="1.5"/><ellipse cx="670" cy="55" rx="15" ry="6" transform="rotate(150 670 55)" fill="none" stroke="${themeColor}" stroke-width="1.5"/><circle cx="670" cy="55" r="2" fill="${themeColor}"/><circle cx="670" cy="95" r="2" fill="${themeColor}"/><circle cx="680" cy="95" r="2" fill="${themeColor}"/><circle cx="690" cy="95" r="2" fill="${themeColor}"/></svg>`;
                        dxNum = "4.5%"; dyNum = "20%"; dxTitle = "22%"; dyTitle = "40%";
                        numColor = "white"; titleColor = "#333";
                    }

                    const bgUrl = `url('data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}')`;

                    return (
                        <div className="relative w-full h-[90px] mt-4 mb-2 overflow-hidden bg-transparent flex items-center" style={{ backgroundImage: bgUrl, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}>
                            <div className="absolute text-center flex flex-col items-center w-[80px]" style={{ color: numColor, left: dxNum, top: dyNum }}>
                                <div className="text-[10px] font-bold">CHƯƠNG</div>
                                <div className="font-bold leading-none" style={{ fontSize: p.numSize?.replace('pt','px') || '30px' }}>{p.num}</div>
                            </div>
                            <div className="absolute font-bold uppercase" style={{ color: titleColor, left: dxTitle, top: dyTitle, fontSize: p.titleSize?.replace('pt','px') || '24px' }}>{p.title}</div>
                        </div>
                    );
                }

                const customTpl = customChapterTpls.find(t => t.id === currentTplId);
                if (customTpl && customTpl.nodeData) {
                    const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title }, p);
                    return <div className="mt-4 mb-2 relative pointer-events-none"><RecursiveNode node={virtualNode} index={0} /><div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply rounded border border-dashed border-blue-200"></div></div>;
                }
                return <div className="text-red-500 font-bold p-4 border border-red-500 border-dashed">Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!</div>;
            })()}
            
            {node.moduleName === "Lesson" && (() => {
                const currentTplId = p.template && p.template !== 'global' ? p.template : (rootNode.properties.tplLesson || 'A');
                if (currentTplId === 'A') return <div className="p-3 text-white font-bold flex items-center gap-3 mt-2 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" style={{ backgroundColor: themeColor, borderLeft: `6px solid #FF7A1D` }}><i className="fas fa-pen text-lg"></i> <span className="text-lg">BÀI {p.num}: {p.title}</span></div>;
                if (currentTplId === 'B') return <div className="p-2.5 font-bold text-center mt-2 rounded-full border-2" style={{ borderColor: themeColor, color: themeColor, backgroundColor: hexToRgbA(themeColor, 0.1) }}><span className="text-lg">BÀI {p.num}: {p.title}</span></div>;
                
                if (currentTplId === 'less_ribbon_pen') {
                   return <div className="p-3 text-white font-bold flex items-center gap-3 mt-2 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" style={{ backgroundColor: themeColor, borderLeft: `6px solid #FF3B1D` }}><i className="fas fa-pen text-lg"></i> <span style={{ fontSize: p.titleSize?.replace('pt','px') || '18px' }}>BÀI {p.num}: {p.title}</span></div>;
                }

                const customTpl = customLessonTpls.find(t => t.id === currentTplId);
                if (customTpl && customTpl.nodeData) {
                    const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title }, p);
                    return <div className="mt-4 mb-2 relative pointer-events-none"><RecursiveNode node={virtualNode} index={0} /><div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply rounded border border-dashed border-blue-200"></div></div>;
                }
                return <div className="text-red-500 font-bold p-4 border border-red-500 border-dashed">Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!</div>;
            })()}
            
            {node.moduleName === "Section" && (() => {
                const currentTplId = p.template && p.template !== 'global' ? p.template : (rootNode.properties.tplSection || 'A');
                if (currentTplId === 'A') return <div className="flex items-center gap-3 mt-4 mb-2"><div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: themeColor }}><i className="fas fa-star"></i></div><div className="flex-1 border-b-2 pb-1 font-bold text-lg uppercase" style={{ borderColor: `${themeColor}60`, color: themeColor }}>{p.num}. {p.title}</div></div>;
                if (currentTplId === 'B') return <div className="mt-4 mb-2 border-b-2 pb-2 font-bold text-lg uppercase" style={{ borderColor: themeColor, color: themeColor }}>{p.num}. {p.title}</div>;
                
                if (currentTplId === 'sec_star_underline') {
                   return <div className="flex items-center gap-3 mt-4 mb-2"><div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: themeColor }}><i className="fas fa-star"></i></div><div className="flex-1 border-b-2 pb-1 font-bold uppercase" style={{ borderColor: `${themeColor}60`, color: themeColor, fontSize: p.titleSize?.replace('pt','px') || '18px' }}>{p.num}. {p.title}</div></div>;
                }

                const customTpl = customSectionTpls.find(t => t.id === currentTplId);
                if (customTpl && customTpl.nodeData) {
                    const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title }, p);
                    return <div className="mt-4 mb-2 relative pointer-events-none"><RecursiveNode node={virtualNode} index={0} /><div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply rounded border border-dashed border-blue-200"></div></div>;
                }
                return <div className="text-red-500 font-bold p-4 border border-red-500 border-dashed">Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!</div>;
            })()}

            {/* Các Module cơ bản */}
            {node.moduleName === "Text" && <div className="[&>p]:m-0" style={{ fontFamily: p.fontFamily ? `'${p.fontFamily}', sans-serif` : 'inherit', fontSize: `${p.fontSize}px`, fontWeight: p.fontWeight === 'bold' || p.fontWeight === '900' ? p.fontWeight : 'normal', color: p.color, lineHeight: 1.2, letterSpacing: p.letterSpacing ? p.letterSpacing.replace('pt', 'px') : 'normal' }}>{renderTypstPreview(p.content)}</div>}
            
            {node.moduleName === "Image" && <div className="bg-gray-100 border border-dashed border-gray-300 text-gray-500 text-center py-4 rounded text-[10px] flex flex-col items-center gap-1" style={{ width: `100%` }}><i className="fas fa-image text-xl"></i> <span>{p.content}</span></div>}
            
            {node.moduleName === "RawTypst" && (
              <div className="mt-2 mb-2 bg-[#1e1e1e] rounded-md shadow-inner overflow-hidden border border-gray-600">
                 <div className="bg-gray-800 px-3 py-1.5 text-[10px] font-bold text-gray-400 flex items-center gap-2 border-b border-gray-600"><i className="fas fa-terminal text-green-500"></i> KHỐI MÃ TYPST TÙY CHỈNH</div>
                 <div className="p-4 text-green-400 font-mono text-xs whitespace-pre-wrap opacity-80">{p.content || "// Chưa có mã Typst..."}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col relative h-full" onClick={() => setSelectedNode(null)}>
      <div className="h-12 bg-white flex justify-between items-center border-b px-4 shadow-sm z-20">
         <div className="font-bold text-gray-700 text-sm"><span>📄</span> Document Canvas</div>
         <div className="flex gap-4 items-center">
           {viewMode === "preview" && (
             <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-md text-xs font-bold text-gray-600 shadow-inner">
               <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="hover:text-blue-600 transition-colors w-4"><i className="fas fa-minus"></i></button>
               <span className="w-10 text-center select-none">{Math.round(zoom * 100)}%</span>
               <button onClick={() => setZoom(z => Math.min(2.0, z + 0.1))} className="hover:text-blue-600 transition-colors w-4"><i className="fas fa-plus"></i></button>
             </div>
           )}

           <div className="w-px h-6 bg-gray-300 mx-1"></div>

           <button onClick={handleDownloadPDF} disabled={isCompiling} className={`px-4 py-1.5 text-white text-xs font-bold rounded shadow transition-colors flex items-center gap-2 ${isCompiling ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e91e63] hover:bg-[#c2185b]'}`}>
             {isCompiling ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
             {isCompiling ? 'ĐANG BIÊN DỊCH...' : 'XUẤT FILE PDF'}
           </button>
           <div className="w-px h-6 bg-gray-300 mx-1"></div>
           <button onClick={handleClearCanvas} className="px-3 py-1 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold rounded transition-colors"><i className="fas fa-trash mr-1"></i> Xóa Canvas</button>
           <div className="w-px h-6 bg-gray-300 mx-1"></div>
           <div className="flex bg-gray-100 p-1 rounded">
             <button onClick={() => setViewMode("preview")} className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-eye mr-1"></i> Trực quan</button>
             <button onClick={() => setViewMode("code")} className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-code mr-1"></i> Mã Typst</button>
           </div>
         </div>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex justify-center pb-40 bg-[#e9ebee]">
        {viewMode === "preview" ? (
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
              <div 
                className="bg-white shadow-2xl flex flex-col relative"
                style={{ width: `${canvasWidth}px`, minHeight: `${canvasMinHeight}px`, padding: `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px` }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(e, rootNode.id, rootNode.children?.length || 0); }}
              >
                <DropZone parentId={rootNode.id} index={0} direction={rootNode.properties.direction} />
                {rootNode.children?.map((child, index) => (
                  <React.Fragment key={child.id}>
                    <RecursiveNode node={child} index={index} />
                    <DropZone parentId={rootNode.id} index={index + 1} direction={rootNode.properties.direction} />
                  </React.Fragment>
                ))}
              </div>
          </div>
        ) : (
          <div className="w-[850px] max-h-[85vh] overflow-y-auto custom-scrollbar bg-[#1e1e1e] p-6 rounded-lg font-mono text-[13px] leading-relaxed text-[#d4d4d4] whitespace-pre-wrap shadow-2xl border border-gray-700">
             {generatedTypst}
          </div>
        )}
      </div>
    </div>
  );
}