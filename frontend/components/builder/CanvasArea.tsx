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
  
  const [customChapterTpls, setCustomChapterTpls] = useState<any[]>([]);
  const [customLessonTpls, setCustomLessonTpls] = useState<any[]>([]);
  const [customSectionTpls, setCustomSectionTpls] = useState<any[]>([]);

  useEffect(() => {
    setGeneratedTypst(generateTypstCode(rootNode));
    const storedChap = localStorage.getItem('vp_custom_chapter_tpls');
    if (storedChap) setCustomChapterTpls(JSON.parse(storedChap));
    const storedLess = localStorage.getItem('vp_custom_lesson_tpls');
    if (storedLess) setCustomLessonTpls(JSON.parse(storedLess));
    const storedSec = localStorage.getItem('vp_custom_section_tpls');
    if (storedSec) setCustomSectionTpls(JSON.parse(storedSec));
  }, [rootNode]);

  const injectDataToTemplate = (tplNode: any, data: {num?: string, title?: string}): any => {
      const clone = JSON.parse(JSON.stringify(tplNode)); 
      const replaceText = (str: string) => {
          if (!str || typeof str !== 'string') return str;
          return str.replace(/\{\{num\}\}/g, data.num || '').replace(/\{\{title\}\}/g, data.title || '');
      };
      const traverse = (n: any) => {
          n.id = `virtual_${Math.random().toString(36).substr(2, 9)}`; 
          if (n.properties) {
              if (n.properties.content) n.properties.content = replaceText(n.properties.content);
              if (n.properties.title) n.properties.title = replaceText(n.properties.title);
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

  const handleDownloadPDF = async () => {
    setIsCompiling(true);
    try {
      const res = await fetch("http://localhost:8000/api/compile-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ typst_code: generatedTypst })
      });

      if (!res.ok) {
         const errorData = await res.json();
         throw new Error(errorData.message || "Lỗi Server");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "tai-lieu-hoc-kage.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error: any) {
      alert("Lỗi biên dịch PDF:\n" + error.message);
    } finally {
      setIsCompiling(false);
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

  // BỘ LỌC VỆ SINH CHUỖI ẢNH SIÊU THÔNG MINH
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

    let radiusCss = p.radiusLinked !== false ? p.radius?.replace('pt','px') : `${p.radiusTopLeft?.replace('pt','px')||'0'} ${p.radiusTopRight?.replace('pt','px')||'0'} ${p.radiusBottomRight?.replace('pt','px')||'0'} ${p.radiusBottomLeft?.replace('pt','px')||'0'}`;
    let padCss = p.paddingLinked !== false ? p.padding?.replace('pt','px') : `${p.paddingTop?.replace('pt','px')||'0'} ${p.paddingRight?.replace('pt','px')||'0'} ${p.paddingBottom?.replace('pt','px')||'0'} ${p.paddingLeft?.replace('pt','px')||'0'}`;
    let marCss = p.marginLinked !== false ? p.margin?.replace('pt','px') : `${p.marginTop?.replace('pt','px')||'0'} ${p.marginRight?.replace('pt','px')||'0'} ${p.marginBottom?.replace('pt','px')||'0'} ${p.marginLeft?.replace('pt','px')||'0'}`;

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
        
        // Tự động lọc sạch cú pháp CSS rác thầy lỡ tay copy vào
        let cleanBgImage = extractImgString(p.bgImage);
        
        // Nếu thầy dán code SVG thuần túy, ép nó thành Base64 để hiển thị Web
        if (cleanBgImage.startsWith('<svg')) {
            cleanBgImage = `data:image/svg+xml,${encodeURIComponent(cleanBgImage)}`;
        }

        bgImageCss = `url("${cleanBgImage}")`;

        if (p.bgImageDisplay === 'pattern') {
            bgSizeCss = `${p.bgPatternW?.replace('pt','px') || '60px'} ${p.bgPatternH?.replace('pt','px') || '60px'}`;
            bgPosCss = 'top left';
            bgRepeatCss = 'repeat';
        } else {
            bgSizeCss = p.bgImageDisplay === 'stretch' ? '100% 100%' : (p.bgImageDisplay || 'cover');
            bgPosCss = 'center';
            bgRepeatCss = 'no-repeat';
        }
    }

    const inlineStyles: React.CSSProperties = {
      width: p.width || '100%',
      height: p.height && p.height !== 'auto' ? p.height.replace('pt', 'px') : 'auto',
      backgroundColor: bgColorCss,
      backgroundImage: bgImageCss,
      backgroundSize: bgSizeCss,
      backgroundPosition: bgPosCss,
      backgroundRepeat: bgRepeatCss,
      ...borderCss, borderRadius: radiusCss, padding: padCss, margin: marCss,
      top: p.position === 'absolute' ? p.top?.replace('pt','px') : 'auto', 
      left: p.position === 'absolute' ? p.left?.replace('pt','px') : 'auto', 
      zIndex: p.zIndex || 1,
    };

    return (
      <div draggable onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData("builder/type", "MOVE"); e.dataTransfer.setData("builder/payload", JSON.stringify({ id: node.id })); }} onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
        className={`group transition-all outline-none ${isSelected ? 'ring-2 ring-blue-500 shadow-sm z-30' : 'hover:ring-1 hover:ring-blue-300 z-10'} ${p.position === 'absolute' ? 'absolute' : 'relative'}`}
        style={inlineStyles}
      >
        {isSelected && (
          <div className="absolute -top-7 left-0 bg-blue-500 text-white flex items-center rounded-t-md text-[10px] font-bold shadow-md h-7 z-50 cursor-move pointer-events-auto">
            <div className="px-3 h-full flex items-center border-r border-blue-400">✥ {node.moduleName}</div>
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
            {isSpecial && <div className="absolute top-1 left-2 text-[10px] text-orange-500 font-bold uppercase pointer-events-none z-10">{node.moduleName} Area</div>}
            
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
            
            {/* CÁC GIAO DIỆN WIDGET KHÁC GIỮ NGUYÊN... */}
            {node.moduleName === "Chapter" && (() => {
                const currentTplId = p.template && p.template !== 'global' ? p.template : (rootNode.properties.tplChapter || 'A');
                if (currentTplId === 'A') return <div className="relative border border-dashed mt-4 mb-2 p-6" style={{ borderColor: themeColor }}><div className="absolute -top-4 left-4 px-3 py-1 text-white text-sm font-bold rounded-sm" style={{ backgroundColor: themeColor }}>Chương {p.num}</div><h1 className="text-2xl font-extrabold uppercase text-center" style={{ color: themeColor }}>{p.title}</h1></div>;
                if (currentTplId === 'B') return <div className="mt-4 mb-2 p-6 rounded-lg text-center" style={{backgroundColor: themeColor}}><div className="text-white text-sm font-bold opacity-80">CHƯƠNG {p.num}</div><h1 className="text-2xl font-extrabold text-white mt-1 uppercase">{p.title}</h1></div>;
                const customTpl = customChapterTpls.find(t => t.id === currentTplId);
                if (customTpl && customTpl.nodeData) {
                    const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title });
                    return <div className="mt-4 mb-2 relative pointer-events-none"><RecursiveNode node={virtualNode} index={0} /><div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply rounded border border-dashed border-blue-200"></div></div>;
                }
                return <div className="text-red-500 font-bold p-4 border border-red-500 border-dashed">Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!</div>;
            })()}
            
            {node.moduleName === "Lesson" && (() => {
                const currentTplId = p.template && p.template !== 'global' ? p.template : (rootNode.properties.tplLesson || 'A');
                if (currentTplId === 'A') return <div className="p-3 text-white font-bold flex items-center gap-3 mt-2 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" style={{ backgroundColor: themeColor, borderLeft: `6px solid #FF7A1D` }}><i className="fas fa-pen text-lg"></i> <span className="text-lg">BÀI {p.num}: {p.title}</span></div>;
                if (currentTplId === 'B') return <div className="p-2.5 font-bold text-center mt-2 rounded-full border-2" style={{ borderColor: themeColor, color: themeColor, backgroundColor: hexToRgbA(themeColor, 0.1) }}><span className="text-lg">BÀI {p.num}: {p.title}</span></div>;
                const customTpl = customLessonTpls.find(t => t.id === currentTplId);
                if (customTpl && customTpl.nodeData) {
                    const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title });
                    return <div className="mt-4 mb-2 relative pointer-events-none"><RecursiveNode node={virtualNode} index={0} /><div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply rounded border border-dashed border-blue-200"></div></div>;
                }
                return <div className="text-red-500 font-bold p-4 border border-red-500 border-dashed">Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!</div>;
            })()}
            
            {node.moduleName === "Section" && (() => {
                const currentTplId = p.template && p.template !== 'global' ? p.template : (rootNode.properties.tplSection || 'A');
                if (currentTplId === 'A') return <div className="flex items-center gap-3 mt-4 mb-2"><div className="w-8 h-8 rounded flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: themeColor }}><i className="fas fa-star"></i></div><div className="flex-1 border-b-2 pb-1 font-bold text-lg uppercase" style={{ borderColor: `${themeColor}60`, color: themeColor }}>{p.num}. {p.title}</div></div>;
                if (currentTplId === 'B') return <div className="mt-4 mb-2 border-b-2 pb-2 font-bold text-lg uppercase" style={{ borderColor: themeColor, color: themeColor }}>{p.num}. {p.title}</div>;
                const customTpl = customSectionTpls.find(t => t.id === currentTplId);
                if (customTpl && customTpl.nodeData) {
                    const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title });
                    return <div className="mt-4 mb-2 relative pointer-events-none"><RecursiveNode node={virtualNode} index={0} /><div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply rounded border border-dashed border-blue-200"></div></div>;
                }
                return <div className="text-red-500 font-bold p-4 border border-red-500 border-dashed">Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!</div>;
            })()}

            {node.moduleName === "Form" && <div className="p-3 font-bold text-sm rounded-r-md border-l-4 mt-2" style={{ borderColor: themeColor, color: themeColor, backgroundColor: hexToRgbA(themeColor, 0.1) }}><i className="fas fa-tasks mr-2"></i> Dạng {p.num}: {p.title}</div>}
            {node.moduleName === "Box" && <div className={`border-l-4 p-4 mt-2 bg-gray-50 rounded-r-md shadow-sm ${p.boxType === 'warning' ? 'border-red-500' : p.boxType === 'tip' ? 'border-green-500' : 'border-blue-500'}`}><h5 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: p.boxType === 'warning' ? '#FF3B1D' : p.boxType === 'tip' ? '#52C41A' : '#1890FF' }}><i className={`fas ${p.boxType === 'warning' ? 'fa-exclamation-triangle' : p.boxType === 'tip' ? 'fa-lightbulb' : 'fa-bookmark'}`}></i> {p.title}</h5><p className="text-sm text-gray-700 whitespace-pre-wrap">{p.content}</p></div>}
            
            {node.moduleName === "Text" && <div className="[&>p]:m-0" style={{ 
                fontFamily: p.fontFamily ? `'${p.fontFamily}', sans-serif` : 'inherit', fontSize: `${p.fontSize}px`, 
                fontWeight: p.fontWeight === 'bold' || p.fontWeight === '900' ? p.fontWeight : 'normal', color: p.color, 
                lineHeight: 1.2, letterSpacing: p.letterSpacing ? p.letterSpacing.replace('pt', 'px') : 'normal'
            }}>{renderTypstPreview(p.content)}</div>}
            
            {node.moduleName === "Image" && <div className="bg-gray-100 border border-dashed border-gray-300 text-gray-500 text-center py-4 rounded text-[10px] flex flex-col items-center gap-1" style={{ width: `100%` }}><i className="fas fa-image text-xl"></i> <span>{p.content}</span></div>}
            {node.moduleName === "Icon" && <div style={{ color: p.color, fontSize: `${p.fontSize}px` }}><i className={`fas ${p.iconName}`}></i></div>}
            {node.moduleName === "RawTypst" && (
              <div className="mt-2 mb-2 bg-[#1e1e1e] rounded-md shadow-inner overflow-hidden border border-gray-600">
                 <div className="bg-gray-800 px-3 py-1.5 text-[10px] font-bold text-gray-400 flex items-center gap-2 border-b border-gray-600"><i className="fas fa-terminal text-green-500"></i> KHỐI MÃ TYPST TÙY CHỈNH</div>
                 <div className="p-4 text-green-400 font-mono text-xs whitespace-pre-wrap leading-relaxed opacity-80">{p.content || "// Chưa có mã Typst..."}</div>
              </div>
            )}
            
            {node.moduleName === "QuestionBlock" && (
              <div className="w-full pointer-events-none p-2 mt-2">
                {(!p.questionData || p.questionData.length === 0) ? (
                  <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 text-red-500 text-center text-xs font-bold rounded">
                    <i className="fas fa-exclamation-circle mr-2"></i> Khối Câu Hỏi: Chưa chọn câu nào.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {p.questionData.map((q: any, i: number) => (
                      <div key={i} className="bg-white border rounded-md shadow-sm p-4 relative" style={{ backgroundColor: p.bg !== 'none' ? p.bg : '#fff', borderColor: p.borderColor || '#e5e7eb' }}>
                        <div className="flex gap-2 mb-3 items-center flex-wrap">
                          <span className="font-bold text-white px-2 py-0.5 rounded text-[11px] shadow-sm" style={{ backgroundColor: p.color || '#1890FF' }}>{p.prefix || 'Câu'} {i + 1}</span>
                          {q.level && <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: p.levelColor || '#6f42c1' }}>{q.level}</span>}
                          {q.topic && <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border">{q.topic}</span>}
                        </div>
                        <div className="text-sm font-serif mb-3 text-gray-800">{renderTypstPreview(q.stem)}</div>
                        {p.showOptions !== false && q.options && q.options.length > 0 && q.options[0] !== "" && (
                          <div className={`grid grid-cols-${p.optionsLayout || 4} gap-2 text-sm font-serif mt-2`}>
                            {q.options.map((opt: string, idx: number) => (
                              <div key={idx} className="flex gap-1"><strong>{String.fromCharCode(65+idx)}.</strong> <span className="flex-1">{renderTypstPreview(opt)}</span></div>
                            ))}
                          </div>
                        )}
                        {p.showSolution && q.solution && (
                          <div className="mt-4 p-3 bg-blue-50 border-l-4 text-sm rounded-r-md" style={{ borderColor: p.color || '#1890FF' }}>
                            <strong style={{ color: p.color || '#1890FF' }}><i className="fas fa-lightbulb mr-1"></i> Hướng dẫn giải:</strong>
                            <div className="mt-2 text-gray-700">{renderTypstPreview(q.solution)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
           {viewMode === "code" && (
             <button onClick={() => { navigator.clipboard.writeText(generatedTypst); alert("Copy thành công!"); }} className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded shadow transition-colors"><i className="fas fa-copy mr-1"></i> Copy</button>
           )}
         </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex justify-center pb-40 bg-[#e9ebee]">
        {viewMode === "preview" ? (
          <div className="w-[850px] min-h-[1000px] bg-white shadow-xl flex flex-col relative" onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDrop(e, rootNode.id, rootNode.children?.length || 0); }}>
            <DropZone parentId={rootNode.id} index={0} direction={rootNode.properties.direction} />
            {rootNode.children?.map((child, index) => (
              <React.Fragment key={child.id}>
                <RecursiveNode node={child} index={index} />
                <DropZone parentId={rootNode.id} index={index + 1} direction={rootNode.properties.direction} />
              </React.Fragment>
            ))}
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