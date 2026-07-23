import React, { useState, useEffect, useRef } from "react";
import { useBuilderStore, useSelectedNode } from "../../store/builderStore";
import { TOOLBOX_ITEMS } from "./config";
import { Accordion, ColorControl, NumberUnitControl, FourWaySpacing, MiniRichTextEditor } from "./UIControls";
import QuestionBankModal from "./QuestionBankModal";

const STYLE_PROPS = ['color', 'bg', 'bgType', 'bgImage', 'bgImageDisplay', 'bgPatternW', 'bgPatternH', 'bgGradientStart', 'bgGradientEnd', 'gradientAngle', 'fontSize', 'fontUnit', 'fontFamily', 'fontWeight', 'letterSpacing', 'align', 'direction', 'layoutType', 'gridCols', 'gap', 'width', 'height', 'borderStyle', 'borderWidth', 'borderColor', 'radius', 'position', 'top', 'left', 'zIndex', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'borderLinked', 'radiusLinked', 'paddingLinked', 'marginLinked', 'radiusTopLeft', 'radiusTopRight', 'radiusBottomRight', 'radiusBottomLeft', 'borderTopStyle', 'borderTopWidth', 'borderTopColor', 'borderRightStyle', 'borderRightWidth', 'borderRightColor', 'borderBottomStyle', 'borderBottomWidth', 'borderBottomColor', 'borderLeftStyle', 'borderLeftWidth', 'borderLeftColor'];

export default function LeftPanel() {
  const { rootNode, updateNodeProps, removeNode, addNode, setSelectedNode } = useBuilderStore();
  const selectedNode = useSelectedNode();
  
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");
  const [panelMode, setPanelMode] = useState<"widgets" | "layers" | "settings">("widgets");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customChapterTpls, setCustomChapterTpls] = useState<any[]>([]);
  const [customLessonTpls, setCustomLessonTpls] = useState<any[]>([]);
  const [customSectionTpls, setCustomSectionTpls] = useState<any[]>([]);

  useEffect(() => {
    const storedChap = localStorage.getItem('vp_custom_chapter_tpls');
    if (storedChap) setCustomChapterTpls(JSON.parse(storedChap));
    const storedLess = localStorage.getItem('vp_custom_lesson_tpls');
    if (storedLess) setCustomLessonTpls(JSON.parse(storedLess));
    const storedSec = localStorage.getItem('vp_custom_section_tpls');
    if (storedSec) setCustomSectionTpls(JSON.parse(storedSec));
  }, []);

  const handleSaveAsTemplate = (type: 'Chapter' | 'Lesson' | 'Section') => {
    if (!selectedNode) return;
    const tplName = prompt(`Nhập tên Mẫu ${type} mới (VD: Mẫu Nhẫn Giả - Làng Lá):`);
    if (!tplName) return;

    const newTpl = { id: `custom_${type.toLowerCase()}_${Date.now()}`, name: tplName, nodeData: selectedNode };

    if (type === 'Chapter') {
      const updated = [...customChapterTpls, newTpl];
      setCustomChapterTpls(updated);
      localStorage.setItem('vp_custom_chapter_tpls', JSON.stringify(updated));
    } else if (type === 'Lesson') {
      const updated = [...customLessonTpls, newTpl];
      setCustomLessonTpls(updated);
      localStorage.setItem('vp_custom_lesson_tpls', JSON.stringify(updated));
    } else if (type === 'Section') {
      const updated = [...customSectionTpls, newTpl];
      setCustomSectionTpls(updated);
      localStorage.setItem('vp_custom_section_tpls', JSON.stringify(updated));
    }
    alert(`Đã lưu ${tplName} thành công!`);
  };

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
    updateNodeProps(selectedNode.id, JSON.parse(styleStr));
  };

  // HÀM XỬ LÝ UPLOAD ẢNH BASE64 LÊN TRÌNH DUYỆT
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedNode) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        updateNodeProps(selectedNode.id, { bgImage: ev.target?.result });
    };
    reader.readAsDataURL(file);
  };

  const LayerTreeView = ({ node, depth = 0 }: any) => {
    const isSelected = selectedNode?.id === node.id;
    if (node.id === "root") return <div>{node.children?.map((c: any) => <LayerTreeView key={c.id} node={c} depth={0} />)}</div>;
    return (
      <div className="flex flex-col">
        <div onClick={() => setSelectedNode(node.id)} className={`flex items-center gap-2 py-2 pr-2 border-b border-gray-100 cursor-pointer transition-colors ${isSelected ? 'bg-blue-100 text-blue-700 border-l-4 border-l-blue-500' : 'hover:bg-gray-50 text-gray-600 border-l-4 border-l-transparent'}`} style={{ paddingLeft: `${depth * 15 + 10}px` }}>
          <i className={`fas ${node.type === 'Container' ? 'fa-box' : node.moduleName === 'QuestionBlock' ? 'fa-question-circle' : 'fa-font'} text-[10px]`}></i>
          <span className="text-xs font-bold">{node.moduleName}</span>
          {(node.properties.title || node.properties.content) && <span className="text-[10px] text-gray-400 truncate flex-1">- {node.properties.title || node.properties.content}</span>}
        </div>
        {node.children?.map((c: any) => <LayerTreeView key={c.id} node={c} depth={depth + 1} />)}
      </div>
    );
  };

  const renderTemplateActions = (type: 'Chapter' | 'Lesson' | 'Section', currentTplId: string) => {
    if (!currentTplId?.startsWith('custom_')) return null;
    let tplList = type === 'Chapter' ? customChapterTpls : type === 'Lesson' ? customLessonTpls : customSectionTpls;
    let setTplList = type === 'Chapter' ? setCustomChapterTpls : type === 'Lesson' ? setCustomLessonTpls : setCustomSectionTpls;
    let storageKey = `vp_custom_${type.toLowerCase()}_tpls`;
    let propKey = `tpl${type}`;

    return (
      <div className="flex gap-2 mt-2">
        <button onClick={() => {
            const tpl = tplList.find(t => t.id === currentTplId);
            if (tpl && tpl.nodeData) {
              const editableNode = JSON.parse(JSON.stringify(tpl.nodeData));
              editableNode.id = `node_${Date.now()}`; 
              addNode(rootNode.id, editableNode, rootNode.children?.length || 0);
              alert("Đã tải mẫu ra Canvas! Thầy hãy cuộn xuống cuối tài liệu để chỉnh sửa nhé.");
            }
          }} className="flex-1 bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 p-1.5 text-[10px] rounded transition-colors font-bold shadow-sm">
          <i className="fas fa-edit mr-1"></i> Sửa Mẫu
        </button>
        <button onClick={() => {
            if (window.confirm("Cảnh báo: Thầy có chắc muốn XÓA vĩnh viễn mẫu này không?")) {
              const updated = tplList.filter(t => t.id !== currentTplId);
              setTplList(updated);
              localStorage.setItem(storageKey, JSON.stringify(updated));
              updateNodeProps(rootNode.id, { [propKey]: 'A' }); 
            }
          }} className="flex-1 bg-red-100 hover:bg-red-500 hover:text-white text-red-600 p-1.5 text-[10px] rounded transition-colors font-bold shadow-sm">
          <i className="fas fa-trash mr-1"></i> Xóa
        </button>
      </div>
    );
  };

  if (!selectedNode) {
    return (
      <div className="w-[320px] bg-white border-r flex flex-col shadow-2xl z-30 flex-shrink-0">
        <div className="p-3 bg-[#333] text-white flex flex-col gap-3">
          <span className="font-bold text-sm tracking-wide">HỌC KAGE BUILDER</span>
          <div className="flex bg-[#222] rounded p-1">
            <button onClick={() => setPanelMode("widgets")} className={`flex-1 py-1.5 text-[10px] font-bold rounded ${panelMode === 'widgets' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>WIDGETS</button>
            <button onClick={() => setPanelMode("layers")} className={`flex-1 py-1.5 text-[10px] font-bold rounded ${panelMode === 'layers' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>LAYERS</button>
            <button onClick={() => setPanelMode("settings")} className={`flex-1 py-1.5 text-[10px] font-bold rounded ${panelMode === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>GLOBAL</button>
          </div>
        </div>

        {panelMode === "widgets" && (
          <div className="p-4 grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar">
            {TOOLBOX_ITEMS.map((item, index) => (
              <div key={index} draggable onDragStart={(e) => { e.dataTransfer.setData("builder/type", "NEW"); e.dataTransfer.setData("builder/payload", JSON.stringify(item)); }}
                className="h-[76px] bg-gray-50 border border-gray-200 rounded-md flex flex-col items-center justify-center gap-2 cursor-grab hover:bg-white hover:border-blue-400 hover:shadow-md transition-all active:cursor-grabbing">
                <i className={`${item.icon} text-2xl text-gray-500 pointer-events-none`}></i>
                <span className="text-[10px] text-center leading-tight font-bold text-gray-500 uppercase pointer-events-none">{item.moduleName}</span>
              </div>
            ))}
          </div>
        )}
        
        {panelMode === "layers" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50"><LayerTreeView node={rootNode} /></div>
        )}

        {panelMode === "settings" && (
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 pb-10">
             <div className="p-3 bg-blue-50 text-blue-700 text-xs font-bold border-b border-blue-100 flex items-center gap-2">
                <i className="fas fa-globe"></i> Cài đặt áp dụng cho toàn bộ tài liệu
             </div>
             <Accordion title="Khổ giấy & Căn lề" defaultOpen={true}>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Khổ giấy</label>
                <select className="w-full border p-2 text-xs rounded mb-4" value={rootNode.properties.paperSize || "a4"} onChange={e => updateNodeProps(rootNode.id, { paperSize: e.target.value })}>
                   <option value="a4">A4 Chuẩn</option><option value="a5">A5 Sách nhỏ</option>
                </select>
                <FourWaySpacing label="Margin (Lề trang)" prefix="margin" properties={rootNode.properties} onChange={(k:string, v:string) => updateNodeProps(rootNode.id, { [k]: v })} />
             </Accordion>
             <Accordion title="Mẫu Giao Diện (Templates)" defaultOpen={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Mẫu Chương (Chapter)</label>
                    <select className="w-full border p-2 text-xs rounded" value={rootNode.properties.tplChapter || 'A'} onChange={e => updateNodeProps(rootNode.id, { tplChapter: e.target.value })}>
                       <option value="A">Mẫu A (Cổ điển - Viền đứt)</option>
                       <option value="B">Mẫu B (Hiện đại - Khối màu)</option>
                       {customChapterTpls.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                    </select>
                    {renderTemplateActions('Chapter', rootNode.properties.tplChapter)}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Mẫu Bài Học (Lesson)</label>
                    <select className="w-full border p-2 text-xs rounded" value={rootNode.properties.tplLesson || 'A'} onChange={e => updateNodeProps(rootNode.id, { tplLesson: e.target.value })}>
                       <option value="A">Mẫu A (Đổ bóng 3D)</option>
                       <option value="B">Mẫu B (Tối giản - Bo tròn)</option>
                       {customLessonTpls.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                    </select>
                    {renderTemplateActions('Lesson', rootNode.properties.tplLesson)}
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Mẫu Mục (Section)</label>
                    <select className="w-full border p-2 text-xs rounded" value={rootNode.properties.tplSection || 'A'} onChange={e => updateNodeProps(rootNode.id, { tplSection: e.target.value })}>
                       <option value="A">Mẫu A (Có Icon bên trái)</option>
                       <option value="B">Mẫu B (Gạch dưới toàn phần)</option>
                       {customSectionTpls.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                    </select>
                    {renderTemplateActions('Section', rootNode.properties.tplSection)}
                  </div>
                </div>
             </Accordion>

             <Accordion title="Hệ thống Câu hỏi (Vietphys)" defaultOpen={true}>
                <div className="space-y-3 text-xs mb-4">
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Tiền tố câu hỏi mặc định</label>
                  <input type="text" placeholder="Ví dụ: Câu, Bài, Ví dụ..." className="w-full border p-2 text-xs rounded mb-3" value={rootNode.properties.qPrefix || ""} onChange={e => updateNodeProps(rootNode.id, { qPrefix: e.target.value })}/>
                  <label className="flex items-center gap-2 font-bold text-gray-600 cursor-pointer"><input type="checkbox" checked={rootNode.properties.qShowLevel !== false} onChange={e => updateNodeProps(rootNode.id, { qShowLevel: e.target.checked })} /> Hiển thị Nhãn Mức độ</label>
                  <label className="flex items-center gap-2 font-bold text-gray-600 cursor-pointer"><input type="checkbox" checked={rootNode.properties.qShowSource !== false} onChange={e => updateNodeProps(rootNode.id, { qShowSource: e.target.checked })} /> Hiển thị Nhãn Nguồn</label>
                  <label className="flex items-center gap-2 font-bold text-blue-600 cursor-pointer mt-2 pt-2 border-t"><input type="checkbox" checked={rootNode.properties.qShowAns === true} onChange={e => updateNodeProps(rootNode.id, { qShowAns: e.target.checked })} /> In Bảng Đáp án nhanh (#vp-print-keys)</label>
                  <label className="flex items-center gap-2 font-bold text-green-600 cursor-pointer"><input type="checkbox" checked={rootNode.properties.qShowSolution === true} onChange={e => updateNodeProps(rootNode.id, { qShowSolution: e.target.checked })} /> Hiện Lời giải chi tiết</label>
                </div>
                <div className="mt-4 pt-4 border-t space-y-4">
                   <h4 className="text-[11px] font-bold text-gray-500 uppercase">Màu sắc mặc định (Theme)</h4>
                   <ColorControl label="Màu Tiền tố & Viền" value={rootNode.properties.qColor || "#1890FF"} onChange={(val: string) => updateNodeProps(rootNode.id, { qColor: val })} />
                   <ColorControl label="Màu Nền câu hỏi" value={rootNode.properties.qBg || "none"} onChange={(val: string) => updateNodeProps(rootNode.id, { qBg: val })} />
                   <ColorControl label="Màu Nhãn Mức độ" value={rootNode.properties.qLevelColor || "#6f42c1"} onChange={(val: string) => updateNodeProps(rootNode.id, { qLevelColor: val })} />
                   <ColorControl label="Màu Nhãn Nguồn" value={rootNode.properties.qSourceColor || "#52C41A"} onChange={(val: string) => updateNodeProps(rootNode.id, { qSourceColor: val })} />
                </div>
             </Accordion>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-white border-r flex flex-col shadow-2xl z-30 flex-shrink-0 overflow-hidden">
      <QuestionBankModal 
         isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} 
         onSelect={(qs) => { updateNodeProps(selectedNode.id, { questionData: [...(selectedNode.properties.questionData || []), ...qs] }); }} 
      />

      {/* INPUT FILE ẨN ĐỂ UPLOAD ẢNH */}
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      <div className="p-3 bg-[#333] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white mr-2"><i className="fas fa-arrow-left"></i></button>
            <span className="text-xs bg-[#0073aa] px-2 py-0.5 rounded uppercase font-bold tracking-wider">{selectedNode.moduleName}</span>
        </div>
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
        {activeTab === "content" && (
          <>
            {selectedNode.moduleName === "QuestionBlock" && (
                <Accordion title="Nguồn Câu Hỏi" defaultOpen={true}>
                  <div className="flex bg-gray-200 p-1 rounded gap-1 mb-4">
                    <button onClick={() => updateNodeProps(selectedNode.id, { mode: 'manual' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.mode !== 'matrix' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Chọn tay</button>
                    <button onClick={() => updateNodeProps(selectedNode.id, { mode: 'matrix' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.mode === 'matrix' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Ma trận</button>
                  </div>
                  {selectedNode.properties.mode !== 'matrix' ? (
                    <div>
                      <button onClick={() => setIsQuestionModalOpen(true)} className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 border-dashed rounded text-xs font-bold mb-3"><i className="fas fa-plus-circle mr-1"></i> Mở Ngân Hàng Câu Hỏi</button>
                      <div className="space-y-2">
                        {selectedNode.properties.questionData?.map((q: any, i: number) => (
                           <div key={i} className="flex items-center justify-between p-2 bg-gray-50 border rounded text-[10px]">
                              <span className="font-bold text-gray-700 truncate flex-1 pr-2">Câu {i+1}: {q.stem.substring(0,25)}...</span>
                              <button onClick={() => { const newData = [...selectedNode.properties.questionData]; newData.splice(i, 1); updateNodeProps(selectedNode.id, { questionData: newData }); }} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                           </div>
                        ))}
                      </div>
                    </div>
                  ) : (<div className="text-xs text-gray-500 italic p-4 text-center bg-gray-50 rounded border border-dashed">Chế độ Ma trận động.</div>)}
                </Accordion>
            )}
            
            {selectedNode.type === "Container" && (
              <Accordion title="Bố cục Container (Layout)" defaultOpen={true}>
                <div className="flex bg-gray-200 p-1 rounded gap-1 mb-3">
                    <button onClick={() => updateNodeProps(selectedNode.id, { layoutType: 'flex' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.layoutType !== 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Flexbox</button>
                    <button onClick={() => updateNodeProps(selectedNode.id, { layoutType: 'grid' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.layoutType === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Grid (Lưới)</button>
                </div>

                {selectedNode.properties.layoutType === 'grid' ? (
                   <div>
                     <label className="block text-[11px] font-bold text-gray-500 mb-1">Cấu trúc Cột (Grid Columns)</label>
                     <input type="text" className="w-full border p-2 text-xs rounded font-mono outline-none focus:border-blue-500 mb-1" placeholder="VD: auto 1fr auto" value={selectedNode.properties.gridCols || "1fr 1fr"} onChange={e => updateNodeProps(selectedNode.id, { gridCols: e.target.value })}/>
                     <span className="text-[9px] text-gray-400">Dùng 'auto' (vừa), '1fr' (chiếm phần dư), hoặc '100pt'.</span>
                   </div>
                ) : (
                   <div>
                     <label className="block text-[11px] font-bold text-gray-500 mb-1">Hướng Flexbox (Direction)</label>
                     <select className="w-full border p-2 text-xs bg-gray-50 rounded outline-none" value={selectedNode.properties.direction} onChange={e => updateNodeProps(selectedNode.id, { direction: e.target.value })}><option value="column">↓ Dọc</option><option value="row">→ Ngang</option></select>
                   </div>
                )}
                
                <div className="mt-4"><NumberUnitControl label="Khoảng cách giữa (Gap)" value={selectedNode.properties.gap || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { gap: val })} max={100} /></div>
                
                <div className="mt-4 pt-4 border-t border-dashed space-y-2">
                   <label className="block text-[11px] font-bold text-purple-600 mb-1"><i className="fas fa-magic"></i> Lưu thành Template</label>
                   <button onClick={() => handleSaveAsTemplate('Chapter')} className="w-full py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-[10px] font-bold rounded transition-colors shadow-sm">Lưu làm Mẫu Chương (Chapter)</button>
                   <button onClick={() => handleSaveAsTemplate('Lesson')} className="w-full py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-[10px] font-bold rounded transition-colors shadow-sm">Lưu làm Mẫu Bài Học (Lesson)</button>
                   <button onClick={() => handleSaveAsTemplate('Section')} className="w-full py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-[10px] font-bold rounded transition-colors shadow-sm">Lưu làm Mẫu Mục (Section)</button>
                </div>
              </Accordion>
            )}

            {selectedNode.properties.num !== undefined && selectedNode.moduleName !== "QuestionBlock" && (
              <Accordion title="Dữ liệu chính" defaultOpen={true}>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Chỉ số (Number)</label>
                <input type="text" className="w-full border p-2 text-xs mb-3 rounded" value={selectedNode.properties.num} onChange={e => updateNodeProps(selectedNode.id, { num: e.target.value })}/>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Tiêu đề (Title)</label>
                <input type="text" className="w-full border p-2 text-xs mb-3 rounded" value={selectedNode.properties.title} onChange={e => updateNodeProps(selectedNode.id, { title: e.target.value })}/>
                
                {['Chapter', 'Lesson', 'Section'].includes(selectedNode.moduleName) && (
                  <div className="pt-3 border-t">
                    <label className="block text-[11px] font-bold text-blue-500 mb-1">Ghi đè Template</label>
                    <select className="w-full border border-blue-200 bg-blue-50 text-blue-700 p-2 text-xs rounded" value={selectedNode.properties.template || 'global'} onChange={e => updateNodeProps(selectedNode.id, { template: e.target.value })}>
                       <option value="global">Dùng cài đặt Toàn cục</option>
                       <option value="A">Ép dùng Mẫu A</option>
                       <option value="B">Ép dùng Mẫu B</option>
                       {selectedNode.moduleName === 'Chapter' && customChapterTpls.map(t => (<option key={t.id} value={t.id}>Ép dùng {t.name}</option>))}
                       {selectedNode.moduleName === 'Lesson' && customLessonTpls.map(t => (<option key={t.id} value={t.id}>Ép dùng {t.name}</option>))}
                       {selectedNode.moduleName === 'Section' && customSectionTpls.map(t => (<option key={t.id} value={t.id}>Ép dùng {t.name}</option>))}
                    </select>
                  </div>
                )}
              </Accordion>
            )}

            {selectedNode.properties.content !== undefined && selectedNode.moduleName !== "QuestionBlock" && (
              <Accordion title={selectedNode.moduleName === "Image" ? "Nguồn Ảnh" : "Văn bản & Định dạng"} defaultOpen={true}>
                {selectedNode.moduleName === "Text" ? (<MiniRichTextEditor value={selectedNode.properties.content} onChange={(val: string) => updateNodeProps(selectedNode.id, { content: val })} />) : (<textarea className="w-full border p-2 text-xs rounded min-h-[100px] custom-scrollbar" value={selectedNode.properties.content} onChange={e => updateNodeProps(selectedNode.id, { content: e.target.value })} />)}
              </Accordion>
            )}

            {selectedNode.properties.width !== undefined && selectedNode.moduleName === "Image" && (
              <Accordion title="Kích thước ảnh" defaultOpen={true}>
                  <NumberUnitControl label="Độ rộng (%)" value={`${selectedNode.properties.width}%`} onChange={(val: string) => updateNodeProps(selectedNode.id, { width: val.replace('%','') })} min={10} max={100} />
              </Accordion>
            )}

            {selectedNode.properties.iconName !== undefined && (
              <Accordion title="FontAwesome Icon" defaultOpen={true}>
                <label className="block text-[11px] font-bold text-gray-500 mb-2">Chọn Icon</label>
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

        {activeTab === "style" && (
          <div className="pb-10">
            {selectedNode.moduleName === "QuestionBlock" && (
               <div className="p-3 bg-yellow-50 text-yellow-700 text-[10px] font-bold border-b border-yellow-200">
                  <i className="fas fa-info-circle"></i> Bố cục và màu sắc Câu hỏi hiện đang lấy từ Tab Global.
               </div>
            )}
            
            <Accordion title="Kích thước (Width & Height)" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-2 mb-1">
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 mb-1">Độ rộng (Width)</label>
                     <input type="text" className="w-full border p-2 text-xs rounded" placeholder="100%, auto" value={selectedNode.properties.width || "100%"} onChange={e => updateNodeProps(selectedNode.id, { width: e.target.value })}/>
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 mb-1">Chiều cao (Height)</label>
                     <input type="text" className="w-full border p-2 text-xs rounded" placeholder="auto, 50pt, 100%" value={selectedNode.properties.height || "auto"} onChange={e => updateNodeProps(selectedNode.id, { height: e.target.value })}/>
                   </div>
                </div>
            </Accordion>

            {selectedNode.properties.color !== undefined && selectedNode.moduleName !== "QuestionBlock" && (
              <Accordion title="Màu sắc (Color)" defaultOpen={true}>
                <ColorControl label="Theme Color" value={selectedNode.properties.color} onChange={(val: string) => updateNodeProps(selectedNode.id, { color: val })} />
              </Accordion>
            )}

            {selectedNode.type === "Container" && (
              <>
                {/* 🌟 VŨ KHÍ BÍ MẬT: GIAO DIỆN UPLOAD ẢNH VÀ CHỈNH PATTERN 🌟 */}
                <Accordion title="Nền (Background)">
                  <div className="flex bg-gray-200 p-1 rounded gap-1 mb-4">
                    <button onClick={() => updateNodeProps(selectedNode.id, { bgType: 'solid' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.bgType === 'solid' || !selectedNode.properties.bgType ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-300'}`}>Màu Đơn</button>
                    <button onClick={() => updateNodeProps(selectedNode.id, { bgType: 'gradient' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.bgType === 'gradient' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-300'}`}>Gradient</button>
                    <button onClick={() => updateNodeProps(selectedNode.id, { bgType: 'image' })} className={`flex-1 py-1.5 text-[10px] rounded font-bold uppercase ${selectedNode.properties.bgType === 'image' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-300'}`}>Ảnh Nền</button>
                  </div>
                  
                  {(!selectedNode.properties.bgType || selectedNode.properties.bgType === 'solid') && (
                    <ColorControl label="Màu nền (Solid)" value={selectedNode.properties.bg} onChange={(val: string) => updateNodeProps(selectedNode.id, { bg: val })} />
                  )}

                  {selectedNode.properties.bgType === 'gradient' && (
                    <div className="space-y-3 mt-3">
                      <ColorControl label="Màu Bắt đầu (Start)" value={selectedNode.properties.bgGradientStart || "#1890FF"} onChange={(val: string) => updateNodeProps(selectedNode.id, { bgGradientStart: val })} />
                      <ColorControl label="Màu Kết thúc (End)" value={selectedNode.properties.bgGradientEnd || "#722ED1"} onChange={(val: string) => updateNodeProps(selectedNode.id, { bgGradientEnd: val })} />
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Góc đổ màu (Angle: {selectedNode.properties.gradientAngle || 135}°)</label>
                        <input type="range" min="0" max="360" className="w-full accent-blue-500" value={selectedNode.properties.gradientAngle || 135} onChange={e => updateNodeProps(selectedNode.id, { gradientAngle: parseInt(e.target.value) })}/>
                      </div>
                    </div>
                  )}

                  {selectedNode.properties.bgType === 'image' && (
                    <div className="space-y-4 mt-3 bg-gray-50 p-3 rounded border border-gray-200 shadow-inner">
                       <div className="flex justify-between items-center mb-1">
                         <label className="block text-[10px] font-bold text-gray-500">Link Ảnh / CSS / SVG</label>
                         <button onClick={() => fileInputRef.current?.click()} className="text-[9px] bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow-sm flex items-center gap-1"><i className="fas fa-upload"></i> Từ máy tính</button>
                       </div>
                       
                       <textarea 
                         className="w-full border p-2 text-[9px] font-mono rounded outline-none focus:border-blue-500 resize-y min-h-[70px] custom-scrollbar" 
                         placeholder='Dán tự do mọi thứ vào đây: Link (/bg.svg), code SVG thuần <svg...>, Code CSS background-image: url(...), hoặc Base64.' 
                         value={selectedNode.properties.bgImage || ""} 
                         onChange={e => updateNodeProps(selectedNode.id, { bgImage: e.target.value })}
                       />
                       
                       <div>
                         <label className="block text-[10px] font-bold text-gray-500 mb-1">Chế độ hiển thị (Display)</label>
                         <select className="w-full border p-2 text-xs rounded outline-none" value={selectedNode.properties.bgImageDisplay || 'cover'} onChange={e => updateNodeProps(selectedNode.id, { bgImageDisplay: e.target.value })}>
                           <option value="cover">Bao phủ toàn bộ (Cover)</option>
                           <option value="contain">Hiển thị trọn vẹn (Contain)</option>
                           <option value="stretch">Kéo giãn vừa khung (Stretch)</option>
                           <option value="pattern">Hoa văn lặp lại (Pattern Lát gạch)</option>
                         </select>
                       </div>

                       {selectedNode.properties.bgImageDisplay === 'pattern' && (
                         <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                           <NumberUnitControl label="Rộng Ô (W)" value={selectedNode.properties.bgPatternW || "60pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { bgPatternW: val })} max={200} />
                           <NumberUnitControl label="Cao Ô (H)" value={selectedNode.properties.bgPatternH || "60pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { bgPatternH: val })} max={200} />
                         </div>
                       )}
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

            {/* Các cài đặt Typography và Spacing */}
            {selectedNode.properties.fontSize !== undefined && (
              <Accordion title="Kiểu chữ (Typography)" defaultOpen={true}>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Font chữ (Font Family)</label>
                <input type="text" className="w-full border p-2 text-xs rounded mb-3" placeholder="VD: Arial, Mplus 1c..." value={selectedNode.properties.fontFamily || ""} onChange={e => updateNodeProps(selectedNode.id, { fontFamily: e.target.value })}/>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <NumberUnitControl label="Kích thước (Size)" value={`${selectedNode.properties.fontSize}${selectedNode.properties.fontUnit}`} onChange={(val: string) => updateNodeProps(selectedNode.id, { fontSize: parseFloat(val) || 12, fontUnit: val.replace(/[0-9.-]/g, '') || 'pt' })} max={72} />
                  <NumberUnitControl label="Khoảng cách (Tracking)" value={selectedNode.properties.letterSpacing || "0pt"} onChange={(val: string) => updateNodeProps(selectedNode.id, { letterSpacing: val })} max={20} min={-5} />
                </div>
                
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Độ đậm (Weight)</label>
                <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none" value={selectedNode.properties.fontWeight} onChange={e => updateNodeProps(selectedNode.id, { fontWeight: e.target.value })}>
                  <option value="regular">Bình thường (Regular)</option><option value="bold">Đậm (Bold)</option><option value="900">Rất đậm (Black)</option>
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
            
            <Accordion title="Định vị & Nâng cao">
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Kiểu ghim (Position)</label>
              <select className="w-full border border-gray-300 p-2 text-xs bg-gray-50 rounded outline-none mb-3" value={selectedNode.properties.position || 'relative'} onChange={e => updateNodeProps(selectedNode.id, { position: e.target.value })}>
                <option value="relative">Nằm trong luồng (Relative)</option>
                <option value="absolute">Ghim tự do (Absolute)</option>
              </select>
              
              {selectedNode.properties.position === 'absolute' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-[10px] font-bold text-yellow-700 mb-1">Cách Trái (Left)</label>
                      <input type="text" className="w-full border border-yellow-300 p-1.5 text-xs rounded bg-white text-center font-mono outline-none focus:border-yellow-500" value={selectedNode.properties.left || '0%'} onChange={e => updateNodeProps(selectedNode.id, { left: e.target.value })} placeholder="VD: 50%" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-yellow-700 mb-1">Cách Trên (Top)</label>
                      <input type="text" className="w-full border border-yellow-300 p-1.5 text-xs rounded bg-white text-center font-mono outline-none focus:border-yellow-500" value={selectedNode.properties.top || '0%'} onChange={e => updateNodeProps(selectedNode.id, { top: e.target.value })} placeholder="VD: -10%" />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-yellow-200">
                    <label className="block text-[10px] font-bold text-yellow-700 mb-1">Z-Index (Độ nổi đè lên nhau)</label>
                    <input type="number" className="w-full border border-yellow-300 p-1.5 text-xs rounded bg-white outline-none focus:border-yellow-500" value={selectedNode.properties.zIndex || 1} onChange={e => updateNodeProps(selectedNode.id, { zIndex: e.target.value })}/>
                  </div>
                </div>
              )}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}