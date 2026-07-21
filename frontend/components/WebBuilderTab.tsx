import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useBuilderStore, useSelectedNode } from "../store/builderStore";
import { v4 as uuidv4 } from "uuid";

// 1. TOOLBOX BỔ SUNG CÁC KHỐI CẤU TRÚC (LAYOUT BLOCKS)
const TOOLBOX_ITEMS = [
  // Nhóm Cấu trúc (Layout)
  { type: "Container", title: "Khung Bao (Box)", icon: "🔲", defaultProps: { bg: "white", padding: "10pt", border: "1pt solid #1890FF", radius: "4pt", shadow: "none" } },
  { type: "Grid", title: "Chia Cột (Row)", icon: "⚏", defaultProps: { columns: 2, gutter: "10pt" } },
  
  // Nhóm Nội dung (Widgets)
  { type: "Chapter", title: "Chương", icon: "📖", defaultProps: { num: "I", title: "TÊN CHƯƠNG", color: "NiceBlue" } },
  { type: "Lesson", title: "Bài Học", icon: "📚", defaultProps: { num: "1", title: "TÊN BÀI HỌC", color: "NiceBlue" } },
  { type: "Section", title: "Phần Thi", icon: "📑", defaultProps: { num: "1", title: "TIÊU ĐỀ PHẦN", color: "NiceBlue" } },
  { type: "Subsection", title: "Tiểu Mục", icon: "🔹", defaultProps: { num: "1.1", title: "Tên tiểu mục", color: "black" } },
  { type: "Form", title: "Dạng Bài", icon: "🎯", defaultProps: { num: "1", title: "Tên dạng bài", color: "FlameRed" } },
  { type: "Box", title: "Hộp Sư Phạm", icon: "💡", defaultProps: { boxType: "warning", title: "Chú ý", content: "Nội dung ghi chú..." } },
  { type: "Text", title: "Văn Bản", icon: "📝", defaultProps: { content: "- Nội dung lý thuyết..." } },
];

export default function WebBuilderTab() {
  const { rootNode, addNode, removeNode, reorderChildren, updateNodeProps, selectedNodeId, setSelectedNode } = useBuilderStore();
  const selectedNode = useSelectedNode() as any;
  
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [generatedTypst, setGeneratedTypst] = useState("");
  const textEditorRef = useRef<HTMLTextAreaElement>(null);

  // ĐẢM BẢO ROOT NODE CÓ CÁC THUỘC TÍNH PAGE SETUP NẾU CHƯA CÓ
  useEffect(() => {
    if (rootNode.properties.paperSize === undefined) {
      updateNodeProps(rootNode.id, {
        paperSize: "a4", margin: "1.5cm", font: "Times New Roman", fontSize: "12pt", showHeader: true, showFooter: true
      });
    }
  }, []);

  // 2. PARSER: TỰ ĐỘNG SINH CẤU HÌNH TRANG VÀ ĐỆ QUY RENDER CODE
  useEffect(() => {
    const rp = rootNode.properties;
    
    // Bóc tách layout-kage-pro thành các lệnh cấu hình động
    let code = `// ==========================================\n// TÀI LIỆU ĐƯỢC TẠO TỪ HỌC KAGE BUILDER\n// ==========================================\n\n`;
    code += `#import "vietphys-package/my-macros.typ": *\n\n`;
    
    code += `// --- CẤU HÌNH TRANG (PAGE SETUP) ---\n`;
    code += `#set page(\n`;
    code += `  paper: "${rp.paperSize || 'a4'}",\n`;
    code += `  margin: ${rp.margin || '1.5cm'},\n`;
    if (rp.showHeader) code += `  header: kage-header(),\n`;
    if (rp.showFooter) code += `  footer: kage-footer(),\n  footer-descent: 30%,\n`;
    code += `)\n`;
    code += `#set text(font: "${rp.font || 'Times New Roman'}", size: ${rp.fontSize || '12pt'}, lang: "vi")\n`;
    code += `#set par(justify: true)\n#vp-config(ans: true, sol: true)\n\n`;
    code += `// --- NỘI DUNG TÀI LIỆU ---\n\n`;

    // Hàm đệ quy sinh code cho các khối lồng nhau
    const renderNodeCode = (node: any, indent: string = ""): string => {
      const p = node.properties;
      let out = "";
      const colorArg = p.color ? `, color: ${p.color}` : "";

      switch (node.moduleName) {
        // CÁC KHỐI CẤU TRÚC (CẦN ĐỆ QUY)
        case "Container":
          out += `${indent}#vp-css-box(bg: ${p.bg}, padding: ${p.padding}, border: ${p.border}, radius: ${p.radius})[\n`;
          if (node.children) node.children.forEach((c: any) => out += renderNodeCode(c, indent + "  "));
          out += `${indent}]\n\n`;
          break;
        case "Grid":
          out += `${indent}#grid(columns: ${p.columns}, column-gutter: ${p.gutter})[\n`;
          if (node.children) node.children.forEach((c: any) => out += renderNodeCode(c, indent + "  "));
          out += `${indent}]\n\n`;
          break;
          
        // CÁC KHỐI NỘI DUNG LÕI
        case "Chapter": out += `${indent}#vp-chapter("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Lesson": out += `${indent}#vp-lesson("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Section": out += `${indent}#vp-section("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Subsection": out += `${indent}#vp-subsection("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Form": out += `${indent}#vp-form("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Box": out += `${indent}#vp-box(type: "${p.boxType || 'note'}", title: "${p.title}")[\n${indent}  ${p.content}\n${indent}]\n`; break;
        case "Text": out += `${indent}${p.content}\n`; break;
      }
      return out;
    };

    rootNode.children?.forEach((child) => {
      code += renderNodeCode(child);
    });

    setGeneratedTypst(code);
  }, [rootNode]);

  // 3. LOGIC KÉO THẢ
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === "toolbox" && destination.droppableId === "canvas") {
      const tool = TOOLBOX_ITEMS[source.index];
      // Nếu là khối cấu trúc, khởi tạo mảng children rỗng
      const isContainer = ["Container", "Grid"].includes(tool.type);
      addNode(rootNode.id, {
        id: uuidv4(),
        type: isContainer ? "Section" : "Module", // Mượn type Section để cho phép lồng ghép
        moduleName: tool.type,
        properties: tool.defaultProps,
        children: isContainer ? [] : undefined
      } as any, destination.index);
    } 
    else if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      reorderChildren(rootNode.id, source.index, destination.index);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full w-full bg-[#f0f4f8] overflow-hidden">
        
        {/* ========================================== */}
        {/* CỘT 1: PROPERTIES PANEL (SIDEBAR ĐỘNG) */}
        {/* ========================================== */}
        <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-xl z-20 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          
          {/* TRƯỜNG HỢP 1: KHÔNG CHỌN GÌ -> HIỆN SETTINGS TOÀN TRANG VÀ TOOLBOX */}
          {!selectedNode ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2"><span className="text-xl">📄</span> Cài đặt Trang (Page Setup)</h3>
              </div>
              <div className="p-4 space-y-4 border-b-4 border-gray-100 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Khổ giấy</label>
                    <select className="w-full border p-2 rounded text-sm bg-gray-50" value={rootNode.properties.paperSize} onChange={(e) => updateNodeProps(rootNode.id, { paperSize: e.target.value })}>
                      <option value="a4">A4</option>
                      <option value="a5">A5</option>
                      <option value="letter">Letter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Căn lề (Margin)</label>
                    <input type="text" className="w-full border p-2 rounded text-sm bg-gray-50" value={rootNode.properties.margin || ""} onChange={(e) => updateNodeProps(rootNode.id, { margin: e.target.value })}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Font chữ</label>
                    <input type="text" className="w-full border p-2 rounded text-sm bg-gray-50" value={rootNode.properties.font || ""} onChange={(e) => updateNodeProps(rootNode.id, { font: e.target.value })}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Cỡ chữ</label>
                    <input type="text" className="w-full border p-2 rounded text-sm bg-gray-50" value={rootNode.properties.fontSize || ""} onChange={(e) => updateNodeProps(rootNode.id, { fontSize: e.target.value })}/>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <input type="checkbox" checked={rootNode.properties.showHeader} onChange={(e) => updateNodeProps(rootNode.id, { showHeader: e.target.checked })} /> Bật Header
                  </label>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <input type="checkbox" checked={rootNode.properties.showFooter} onChange={(e) => updateNodeProps(rootNode.id, { showFooter: e.target.checked })} /> Bật Footer
                  </label>
                </div>
              </div>

              {/* TOOLBOX KÉO THẢ */}
              <div className="p-4 bg-gray-50 flex items-center gap-2 border-b"><span className="text-xl">🧩</span><h3 className="font-bold text-gray-800">Thành phần (Widgets)</h3></div>
              <Droppable droppableId="toolbox" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {TOOLBOX_ITEMS.map((item, index) => (
                      <Draggable key={`tool-${index}`} draggableId={`tool-${index}`} index={index} isDragDisabled={viewMode === "code"}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                            className={`p-2.5 bg-white border rounded-lg flex items-center gap-3 cursor-grab hover:border-blue-400 hover:shadow-md transition-all ${snapshot.isDragging ? "shadow-xl ring-2 ring-blue-500 z-50" : ""}`}
                          >
                            <div className="bg-gray-50 p-1.5 rounded text-md border">{item.icon}</div>
                            <span className="text-sm font-semibold text-gray-700">{item.title}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ) : (

            // TRẠNG THÁI 2: KHI ĐÃ CHỌN 1 KHỐI (HIỂN THỊ THUỘC TÍNH CHI TIẾT)
            <div className="flex flex-col h-full bg-white">
              <div className="p-4 border-b bg-blue-50 flex items-center justify-between">
                <h3 className="font-bold text-blue-800 uppercase text-sm flex items-center gap-2"><span className="text-lg">⚙️</span> {selectedNode.moduleName} Settings</h3>
                <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-800 font-bold text-lg">&times;</button>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                
                {/* 1. THUỘC TÍNH LAYOUT (DÀNH CHO CONTAINER / GRID) */}
                {(selectedNode.moduleName === "Container" || selectedNode.moduleName === "Grid") && (
                  <div className="space-y-3 bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                    <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Cấu trúc (Layout)</h4>
                    {selectedNode.properties.columns !== undefined && (
                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-semibold text-gray-600 w-16">Số Cột:</label>
                        <input type="number" min="1" className="flex-1 border p-1.5 rounded text-sm bg-white" value={selectedNode.properties.columns} onChange={(e) => updateNodeProps(selectedNode.id, { columns: Number(e.target.value) })}/>
                      </div>
                    )}
                    {selectedNode.properties.bg !== undefined && (
                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-semibold text-gray-600 w-16">Màu Nền:</label>
                        <input type="text" className="flex-1 border p-1.5 rounded text-sm bg-white" value={selectedNode.properties.bg} onChange={(e) => updateNodeProps(selectedNode.id, { bg: e.target.value })} placeholder='VD: "white", rgb("..."), ...'/>
                      </div>
                    )}
                    {selectedNode.properties.padding !== undefined && (
                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-semibold text-gray-600 w-16">Padding:</label>
                        <input type="text" className="flex-1 border p-1.5 rounded text-sm bg-white" value={selectedNode.properties.padding} onChange={(e) => updateNodeProps(selectedNode.id, { padding: e.target.value })}/>
                      </div>
                    )}
                    {selectedNode.properties.border !== undefined && (
                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-semibold text-gray-600 w-16">Viền (Border):</label>
                        <input type="text" className="flex-1 border p-1.5 rounded text-sm bg-white" value={selectedNode.properties.border} onChange={(e) => updateNodeProps(selectedNode.id, { border: e.target.value })}/>
                      </div>
                    )}
                    {selectedNode.properties.radius !== undefined && (
                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-semibold text-gray-600 w-16">Bo góc:</label>
                        <input type="text" className="flex-1 border p-1.5 rounded text-sm bg-white" value={selectedNode.properties.radius} onChange={(e) => updateNodeProps(selectedNode.id, { radius: e.target.value })}/>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. THUỘC TÍNH NỘI DUNG (CONTENT) */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nội dung</h4>
                  {selectedNode.properties.num !== undefined && (
                    <input type="text" className="w-full border p-2 rounded bg-gray-50 text-sm font-bold" value={selectedNode.properties.num} onChange={(e) => updateNodeProps(selectedNode.id, { num: e.target.value })} placeholder="Chỉ số (Level/Số thứ tự)"/>
                  )}
                  {selectedNode.properties.title !== undefined && (
                    <input type="text" className="w-full border p-2 rounded bg-gray-50 text-sm" value={selectedNode.properties.title} onChange={(e) => updateNodeProps(selectedNode.id, { title: e.target.value })} placeholder="Tiêu đề khối"/>
                  )}
                  {selectedNode.properties.content !== undefined && (
                    <textarea 
                      ref={textEditorRef}
                      className="w-full border border-gray-300 p-2 rounded bg-gray-50 text-sm font-mono leading-relaxed resize-none custom-scrollbar" 
                      value={selectedNode.properties.content} 
                      onChange={(e) => updateNodeProps(selectedNode.id, { content: e.target.value })}
                      onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = `${t.scrollHeight}px`; }}
                      style={{ minHeight: '150px' }}
                      placeholder="Nhập nội dung/Markdown Typst..."
                    />
                  )}
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50"><button onClick={() => removeNode(selectedNode.id)} className="w-full py-2 bg-red-100 text-red-600 font-bold text-sm rounded hover:bg-red-200 transition">🗑️ Xóa Thành Phần Này</button></div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* CỘT 2: CANVAS CHÍNH HIỂN THỊ GIAO DIỆN */}
        {/* ========================================== */}
        <div className="flex-1 flex flex-col h-full relative" onClick={() => setSelectedNode(null)}>
          <div className="h-14 flex items-center justify-between px-6 bg-white border-b shadow-sm z-10">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">🎨 Giao Diện Canvas</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg border">
              <button onClick={() => setViewMode("code")} className={`px-4 py-1 text-sm font-bold rounded ${viewMode === "code" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>Mã Typst</button>
              <button onClick={() => setViewMode("preview")} className={`px-4 py-1 text-sm font-bold rounded ${viewMode === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>Giao Diện</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100/50 custom-scrollbar pb-32">
            <div className={`w-full max-w-[850px] transition-all duration-300 ${viewMode === "preview" ? "block" : "hidden"}`}>
              
              <Droppable droppableId="canvas">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={`w-full min-h-[900px] bg-white shadow-md p-12 transition-colors duration-200 ${snapshot.isDraggingOver ? "ring-2 ring-blue-400" : ""}`}>
                    
                    {rootNode.children?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">Kéo thả các công cụ từ cột trái vào đây</div>
                    ) : (
                      rootNode.children?.map((child, index) => {
                        const node = child as any;
                        const isSelected = selectedNodeId === node.id;
                        
                        return (
                          <Draggable key={node.id} draggableId={node.id} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                                className={`group relative mb-2 transition-all cursor-pointer border-[1.5px] rounded p-2 ${isSelected ? "border-blue-500 bg-blue-50/10 shadow-sm" : "border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/50"}`}
                              >
                                {/* Ký hiệu khối góc trên bên trái khi Hover */}
                                <div className="absolute -top-3 left-2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-10 font-mono">
                                  {node.moduleName}
                                </div>

                                <div className="pointer-events-none">
                                  {node.moduleName === "Container" && <div className="border border-blue-400 bg-blue-50/30 p-4 rounded text-center text-sm text-blue-500 font-bold border-dashed h-24 flex items-center justify-center">[ KHUNG CONTAINER - Dữ liệu con sẽ nằm tại đây ]</div>}
                                  {node.moduleName === "Grid" && <div className="border border-purple-400 bg-purple-50/30 p-4 rounded text-center text-sm text-purple-500 font-bold border-dashed h-24 flex items-center justify-center">[ KHUNG CHIA {node.properties.columns} CỘT ]</div>}
                                  
                                  {/* CÁC WIDGET BÌNH THƯỜNG NHƯ CŨ */}
                                  {node.moduleName === "Lesson" && (<div className="border-l-4 border-blue-600 bg-gray-50 p-4 shadow-sm"><h3 className="text-lg font-bold text-gray-800 uppercase">BÀI {node.properties.num}: {node.properties.title}</h3></div>)}
                                  {node.moduleName === "Section" && (<div className="flex items-center gap-3 border-b-2 border-gray-300 pb-1 mt-4"><div className="bg-gray-800 text-white w-8 h-8 rounded flex items-center justify-center font-bold">{node.properties.num}</div><h3 className="text-lg font-bold uppercase">{node.properties.title}</h3></div>)}
                                  {node.moduleName === "Text" && (<div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap py-1">{node.properties.content || "Nhập văn bản..."}</div>)}
                                  {/* ... Tương tự cho các widget khác */}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

            </div>

            {/* TAB PREVIEW MÃ TYPST TƯƠNG ĐƯƠNG */}
            <div className={`w-full max-w-[850px] transition-all duration-300 ${viewMode === "code" ? "block" : "hidden"}`}>
              <div className="bg-[#1e1e1e] rounded-xl shadow-xl overflow-hidden border border-gray-800 min-h-[800px] flex flex-col">
                <div className="p-6 flex-1 overflow-y-auto"><pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{generatedTypst}</pre></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DragDropContext>
  );
}