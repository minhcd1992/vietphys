import React, { useState } from "react";
import { useBuilderStore, useSelectedNode } from "../../store/builderStore";
import { TOOLBOX_ITEMS } from "./config";
import { Accordion, ColorControl, NumberUnitControl, FourWaySpacing, MiniRichTextEditor } from "./UIControls";

const STYLE_PROPS = ['color', 'bg', 'bgType', 'bgGradientStart', 'bgGradientEnd', 'fontSize', 'fontUnit', 'fontWeight', 'align', 'direction', 'gap', 'width', 'borderStyle', 'borderWidth', 'borderColor', 'radius', 'position', 'top', 'left', 'zIndex', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'borderLinked', 'radiusLinked', 'paddingLinked', 'marginLinked', 'radiusTopLeft', 'radiusTopRight', 'radiusBottomRight', 'radiusBottomLeft', 'borderTopStyle', 'borderTopWidth', 'borderTopColor', 'borderRightStyle', 'borderRightWidth', 'borderRightColor', 'borderBottomStyle', 'borderBottomWidth', 'borderBottomColor', 'borderLeftStyle', 'borderLeftWidth', 'borderLeftColor'];

export default function LeftPanel() {
  const { rootNode, updateNodeProps, setSelectedNode } = useBuilderStore();
  const selectedNode = useSelectedNode();
  
  // Đã bỏ tab "advanced"
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");
  const [panelMode, setPanelMode] = useState<"widgets" | "layers">("widgets");

  const handleCopyStyle = () => {
    if (!selectedNode) return;
    const styleToCopy: any = {};
    STYLE_PROPS.forEach(p => {
       if (selectedNode.properties[p] !== undefined) styleToCopy[p] = selectedNode.properties[p];
    });
    localStorage.setItem('vp_copied_style', JSON.stringify(styleToCopy));
    alert("Đã sao chép kiểu dáng (Style) vào khay nhớ tạm!");
  };

  const handlePasteStyle = () => {
    if (!selectedNode) return;
    const styleStr = localStorage.getItem('vp_copied_style');
    if (!styleStr) { alert("Thầy chưa Copy Style nào cả!"); return; }
    const styleToPaste = JSON.parse(styleStr);
    updateNodeProps(selectedNode.id, styleToPaste);
  };

  const LayerTreeView = ({ node, depth = 0 }: any) => {
    const isSelected = selectedNode?.id === node.id;
    if (node.id === "root") {
      return <div>{node.children?.map((c: any) => <LayerTreeView key={c.id} node={c} depth={0} />)}</div>;
    }
    return (
      <div className="flex flex-col">
        <div onClick={() => setSelectedNode(node.id)} className={`flex items-center gap-2 py-2 pr-2 border-b border-gray-100 cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 text-blue-700 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 text-gray-600 border-l-4 border-l-transparent'}`} style={{ paddingLeft: `${depth * 15 + 10}px` }}>
          <i className={`fas ${node.type === 'Container' ? 'fa-box' : 'fa-font'} text-[10px]`}></i>
          <span className="text-xs font-bold">{node.moduleName}</span>
          {(node.properties.title || node.properties.content) && <span className="text-[10px] text-gray-400 truncate flex-1">- {node.properties.title || node.properties.content}</span>}
        </div>
        {node.children?.map((c: any) => <LayerTreeView key={c.id} node={c} depth={depth + 1} />)}
      </div>
    );
  };

  if (!selectedNode) {
    return (
      <div className="w-[320px] bg-white border-r flex flex-col shadow-2xl z-30 flex-shrink-0">
        <div className="p-3 bg-[#333] text-white flex items-center justify-between">
          <span className="font-bold text-sm tracking-wide">HỌC KAGE</span>
          <div className="flex bg-[#222] rounded p-1">
            <button onClick={() => setPanelMode("widgets")} className={`px-3 py-1 text-[10px] font-bold rounded ${panelMode === 'widgets' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>WIDGETS</button>
            <button onClick={() => setPanelMode("layers")} className={`px-3 py-1 text-[10px] font-bold rounded ${panelMode === 'layers' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>LAYERS</button>
          </div>
        </div>

        {panelMode === "widgets" ? (
          <div className="p-4 grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar">
            {TOOLBOX_ITEMS.map((item, index) => (
              <div key={index} draggable onDragStart={(e) => { e.dataTransfer.setData("builder/type", "NEW"); e.dataTransfer.setData("builder/payload", JSON.stringify(item)); }}
                className="h-[76px] bg-gray-50 border border-gray-200 rounded-md flex flex-col items-center justify-center gap-2 cursor-grab hover:bg-white hover:border-blue-400 hover:shadow-md transition-all active:cursor-grabbing">
                <i className={`${item.icon} text-2xl text-gray-500 pointer-events-none`}></i>
                <span className="text-[10px] text-center leading-tight font-bold text-gray-500 uppercase pointer-events-none">{item.moduleName}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
             <LayerTreeView node={rootNode} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-white border-r flex flex-col shadow-2xl z-30 flex-shrink-0 overflow-hidden">
      <div className="p-3 bg-[#333] text-white flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-xs bg-[#0073aa] px-2 py-0.5 rounded uppercase font-bold tracking-wider">{selectedNode.moduleName}</span></div>
      </div>
      
      <div className="flex p-2 gap-2 bg-gray-100 border-b">
         <button onClick={handleCopyStyle} className="flex-1 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600"><i className="fas fa-copy mr-1"></i> Copy Style</button>
         <button onClick={handlePasteStyle} className="flex-1 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-green-600"><i className="fas fa-paste mr-1"></i> Paste Style</button>
      </div>

      <div className="flex border-b bg-white shadow-sm flex-shrink-0">
        <button onClick={() => setActiveTab("content")} className={`flex-1 py-3 text-[11px] font-bold uppercase ${activeTab === 'content' ? 'border-b-[3px] border-[#b32b55] text-[#333]' : 'text-gray-400'}`}>✎ Nội dung</button>
        <button onClick={() => setActiveTab("style")} className={`flex-1 py-3 text-[11px] font-bold uppercase ${activeTab === 'style' ? 'border-b-[3px] border-[#b32b55] text-[#333]' : 'text-gray-400'}`}>🎨 Kiểu & Bố cục</button>
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {/* ======================= TAB NỘI DUNG ======================= */}
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

        {/* ======================= TAB KIỂU & BỐ CỤC (Đã gộp) ======================= */}
        {activeTab === "style" && (
          <div className="pb-10">
            <Accordion title="Kích thước (Width)" defaultOpen={true}>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Độ rộng</label>
                <input type="text" className="w-full border p-2 text-xs rounded mb-1" placeholder="100%, 1fr, 50pt, auto..." value={selectedNode.properties.width || "100%"} onChange={e => updateNodeProps(selectedNode.id, { width: e.target.value })}/>
                <span className="text-[10px] text-gray-400 italic">Nhập phần trăm (30%, 70%) hoặc '1fr' để chia cột.</span>
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

            {/* GỘP PADDING & MARGIN LÊN ĐÂY */}
            <Accordion title="Khoảng cách (Spacing)">
              <div className="space-y-6">
                <FourWaySpacing label="Padding (Lề trong khối)" prefix="padding" properties={selectedNode.properties} onChange={(k:string, v:string) => updateNodeProps(selectedNode.id, { [k]: v })} />
                {selectedNode.moduleName !== "Header" && selectedNode.moduleName !== "Footer" && (
                  <div className="pt-4 border-t border-gray-200">
                    <FourWaySpacing label="Margin (Khoảng cách bên ngoài)" prefix="margin" properties={selectedNode.properties} onChange={(k:string, v:string) => updateNodeProps(selectedNode.id, { [k]: v })} />
                  </div>
                )}
              </div>
            </Accordion>

            {selectedNode.type === "Container" && (
              <>
                <Accordion title="Nền (Background)">
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

                <Accordion title="Đường Viền & Bo góc (Border)">
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

            {/* ĐỊNH VỊ TUYỆT ĐỐI CŨNG ĐƯỢC MANG VÀO ĐÂY */}
            <Accordion title="Định vị & Nâng cao">
              <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none mb-4" value={selectedNode.properties.position} onChange={e => updateNodeProps(selectedNode.id, { position: e.target.value })}>
                <option value="relative">Nằm trong luồng (Relative)</option><option value="absolute">Trôi nổi tuyệt đối (Absolute)</option>
              </select>
              {selectedNode.properties.position === 'absolute' && (
                <div className="space-y-3">
                  <NumberUnitControl label="Cách lề trên (Top / dy)" value={selectedNode.properties.top || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { top: val })} min={-500} max={1000} />
                  <NumberUnitControl label="Cách lề trái (Left / dx)" value={selectedNode.properties.left || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { left: val })} min={-500} max={1000} />
                  <div><label className="block text-[10px] text-gray-500 mb-1">Z-Index (Độ nổi đè lên nhau)</label><input type="number" className="w-full border p-1.5 text-xs rounded" value={selectedNode.properties.zIndex || 1} onChange={e => updateNodeProps(selectedNode.id, { zIndex: e.target.value })}/></div>
                </div>
              )}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}