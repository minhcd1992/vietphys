import React, { useState, useEffect } from "react";
import { useBuilderStore } from "../../store/builderStore";
import { generateTypstCode } from "../../utils/typstParser";
import { renderTypstPreview } from "./UIControls";
import { hexToRgbA } from "./config";

export default function CanvasArea() {
  const { rootNode, addNode, moveNode, removeNode, selectedNodeId, setSelectedNode } = useBuilderStore();
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [generatedTypst, setGeneratedTypst] = useState("");

  useEffect(() => {
    setGeneratedTypst(generateTypstCode(rootNode));
  }, [rootNode]);

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
      rootNode.children?.forEach(c => removeNode(c.id));
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
      <div draggable onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData("builder/type", "MOVE"); e.dataTransfer.setData("builder/payload", JSON.stringify({ id: node.id })); }} onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
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
    <div className="flex-1 flex flex-col relative h-full" onClick={() => setSelectedNode(null)}>
      <div className="h-12 bg-white flex justify-between items-center border-b px-4 shadow-sm z-20">
         <div className="font-bold text-gray-700 text-sm"><span>📄</span> Document Canvas</div>
         <div className="flex gap-4 items-center">
           <button onClick={handleClearCanvas} className="px-3 py-1 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white text-xs font-bold rounded transition-colors"><i className="fas fa-trash mr-1"></i> Xóa Canvas</button>
           <div className="w-px h-6 bg-gray-300 mx-1"></div>
           <div className="flex bg-gray-100 p-1 rounded">
             <button onClick={() => setViewMode("preview")} className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-eye mr-1"></i> Trực quan</button>
             <button onClick={() => setViewMode("code")} className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-code mr-1"></i> Mã Typst</button>
           </div>
           {viewMode === "code" && (
             <button onClick={() => { navigator.clipboard.writeText(generatedTypst); alert("Copy thành công!"); }} className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded shadow transition-colors"><i className="fas fa-copy mr-1"></i> Copy Code</button>
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
          <div className="w-[850px] bg-[#1e1e1e] p-6 rounded-lg font-mono text-[13px] leading-relaxed text-[#d4d4d4] whitespace-pre-wrap shadow-2xl border border-gray-700">{generatedTypst}</div>
        )}
      </div>
    </div>
  );
}