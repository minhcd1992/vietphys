"use client";
import WebBuilderTab from "../components/WebBuilderTab";
import { useBuilderStore } from "../store/builderStore";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [activeTab, setActiveTab] = useState("builder"); // builder | bank | exam_builder

  // ==========================================
  // STATES CHO TAB SOẠN THẢO (BUILDER)
  // ==========================================
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  
  const [qType, setQType] = useState("mcq");
  const [level, setLevel] = useState("TH");
  const [lines, setLines] = useState(""); 
  const [stem, setStem] = useState("");
  const [sol, setSol] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [ansMcq, setAnsMcq] = useState("A");
  const [tfStmts, setTfStmts] = useState(["", "", "", ""]);
  const [tfAns, setTfAns] = useState(["Đ", "Đ", "Đ", "Đ"]);
  const [shortAns, setShortAns] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // ==========================================
  // STATES CHO TAB NGÂN HÀNG (BANK)
  // ==========================================
  const [bankQuestions, setBankQuestions] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [examLimit, setExamLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // ==========================================
  // STATES CHO TAB TRÌNH DỰNG ĐỀ (WEB BUILDER - ELEMENTOR STYLE)
  // ==========================================
  const [canvasItems, setCanvasItems] = useState<any[]>([
    { id: "header-1", type: "header", title: "ĐỀ KIỂM TRA MÔN VẬT LÝ", subtitle: "Thời gian làm bài: 45 phút" },
    { id: "section-1", type: "section", title: "PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN" }
  ]);

  // ==========================================
  // STATES KẾT QUẢ CODE
  // ==========================================
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (activeTab === "bank" || activeTab === "exam_builder") fetchBankQuestions();
  }, [activeTab, filterType, filterLevel]);

  // TỰ ĐỘNG CẬP NHẬT CODE TYPST KHI CANVAS THAY ĐỔI
  useEffect(() => {
    if (activeTab === "exam_builder") {
      renderCanvasToTypst();
    }
  }, [canvasItems, activeTab]);

  // LẤY DANH SÁCH NGÂN HÀNG
  const fetchBankQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/questions", {
        params: { 
          q_type: filterType, level: filterLevel, chapter: filterChapter, 
          topic: filterTopic, search: searchQuery 
        }
      });
      setBankQuestions(res.data.data);
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi lấy ngân hàng:", error);
    }
  };

  // UPLOAD QUÉT AI
  const handleFileUpload = async (event: any) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsScanning(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
    
    try {
      const response = await axios.post("http://localhost:8000/api/scan-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "success") {
        setGeneratedCode(response.data.code);
        alert(response.data.message || `Đã nạp ${response.data.count} câu hỏi vào kho.`);
      } else {
        alert("Lỗi nhận diện: " + response.data.message);
      }
    } catch (error) {
      alert("Đường truyền AI gặp sự cố.");
    } finally {
      setIsScanning(false);
      event.target.value = null;
    }
  };

  // LƯU & SINH CODE THỦ CÔNG
  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/generate-code", {
        chapter, topic, source,
        q_type: qType, level: level, lines: lines, stem: stem, options: options,
        ans_mcq: ansMcq, tf_stmts: tfStmts, tf_ans: tfAns, short_ans: shortAns, sol: sol
      });
      if (response.data.status === "error") {
        alert(response.data.message); 
      } else {
        setGeneratedCode(response.data.code);
        setStem(""); setSol(""); 
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  // TRỘN ĐỀ TỰ ĐỘNG
  const handleGenerateExam = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/generate-exam", {
        params: { 
          limit: examLimit, q_type: filterType, level: filterLevel,
          chapter: filterChapter, topic: filterTopic
        }
      });
      if (res.data.status === "success") {
        setGeneratedCode(res.data.code);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Lỗi tạo đề:", error);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // ==========================================
  // LOGIC TRÌNH DỰNG ĐỀ (WEB BUILDER)
  // ==========================================
  const addHeaderBlock = () => {
    const newBlock = {
      id: `header-${Date.now()}`,
      type: "header",
      title: "ĐỀ KIỂM TRA VẬT LÝ",
      subtitle: "Thời gian làm bài: 50 phút"
    };
    setCanvasItems([...canvasItems, newBlock]);
  };

  const addSectionBlock = (titleText = "PHẦN MỚI") => {
    const newBlock = {
      id: `section-${Date.now()}`,
      type: "section",
      title: titleText
    };
    setCanvasItems([...canvasItems, newBlock]);
  };

  const addQuestionToCanvas = (q: any) => {
    const newBlock = {
      id: `q-${q.id}-${Date.now()}`,
      type: "question",
      question: q
    };
    setCanvasItems([...canvasItems, newBlock]);
  };

  const moveCanvasItem = (index: number, direction: "up" | "down") => {
    const newItems = [...canvasItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setCanvasItems(newItems);
  };

  const removeCanvasItem = (index: number) => {
    setCanvasItems(canvasItems.filter((_, i) => i !== index));
  };

  const updateHeaderItem = (id: string, field: string, value: string) => {
    setCanvasItems(canvasItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const renderCanvasToTypst = () => {
    let typst = `// ==========================================\n// ĐỀ THI TỰ ĐỘNG DỰNG BẰNG HỌC KAGE BUILDER\n// ==========================================\n\n`;
    
    canvasItems.forEach((item) => {
      if (item.type === "header") {
        typst += `#align(center)[\n  #text(16pt, weight: "bold")[${item.title}]\n  #v(-5pt)\n  #text(11pt, style: "italic")[${item.subtitle}]\n]\n#v(10pt)\n\n`;
      } else if (item.type === "section") {
        typst += `== ${item.title}\n\n`;
      } else if (item.type === "question") {
        typst += `${item.question.typst_code}\n\n`;
      }
    });

    setGeneratedCode(typst);
  };

  // CHECKBOX VÀ XÓA BẢNG NGÂN HÀNG
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(bankQuestions.map(q => q.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleDelete = async (idsToDelete: number[]) => {
    if (!confirm(`⚠️ Thầy có chắc chắn muốn xóa vĩnh viễn ${idsToDelete.length} câu hỏi này không?`)) return;
    try {
      const res = await axios.post("http://localhost:8000/api/questions/delete-bulk", { ids: idsToDelete });
      if (res.data.status === "success") {
        fetchBankQuestions();
        if (idsToDelete.length > 1) setSelectedIds([]);
      } else alert(res.data.message);
    } catch (error) {
      alert("Đã xảy ra lỗi khi xóa câu hỏi.");
    }
  };

  const insertTextAtCursor = (setter: any, currentValue: string, elementId: string, textToInsert: string) => {
    const textarea = document.getElementById(elementId) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart; const end = textarea.selectionEnd;
    const newValue = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);
    setter(newValue);
    setTimeout(() => { textarea.focus(); textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length); }, 0);
  };

  const EditorToolbar = ({ setter, currentValue, elementId }: any) => (
    <div className="flex gap-2 mb-2 bg-gray-100 p-1.5 rounded border border-gray-200">
      <button onClick={() => insertTextAtCursor(setter, currentValue, elementId, "$...$")} className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-blue-50 text-blue-700 font-bold font-mono shadow-sm">$ $</button>
      <button onClick={() => insertTextAtCursor(setter, currentValue, elementId, "$ $\n...\n$ $")} className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-blue-50 text-blue-700 font-bold font-mono shadow-sm">$$ $$</button>
      <button onClick={() => insertTextAtCursor(setter, currentValue, elementId, '#vp-qty("1", "m/s")')} className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-green-50 text-green-700 font-bold shadow-sm">📏 Đơn vị</button>
      <button onClick={() => insertTextAtCursor(setter, currentValue, elementId, '\n#align(center)[#image("img/placeholder.png", width: 60%)]\n')} className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-semibold shadow-sm">🖼️ Ảnh giữa</button>
    </div>
  );

  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* ========================================== */}
      {/* THANH ĐIỀU HƯỚNG TAB CHUNG (NẰM TRÊN CÙNG) */}
      {/* ========================================== */}
      <div className="flex border-b bg-white shadow-sm z-20 shrink-0">
        <button 
          className={`flex-1 py-3 font-bold text-sm transition flex items-center justify-center gap-2 ${activeTab === 'builder' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('builder')}
        >
          ✍️ Soạn Câu Hỏi
        </button>
        <button 
          className={`flex-1 py-3 font-bold text-sm transition flex items-center justify-center gap-2 ${activeTab === 'bank' ? 'bg-green-50 text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('bank')}
        >
          📚 Ngân Hàng Câu Hỏi
        </button>
        <button 
          className={`flex-1 py-3 font-bold text-sm transition flex items-center justify-center gap-2 ${activeTab === 'exam_builder' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-gray-500 hover:bg-gray-100'}`} 
          onClick={() => setActiveTab('exam_builder')}
        >
          🧩 Canvas Builder
        </button>
      </div>

      {/* ========================================== */}
      {/* NỘI DUNG HIỂN THỊ TÙY THEO TAB ĐƯỢC CHỌN */}
      {/* ========================================== */}
      {activeTab === "exam_builder" ? (
        
        // NẾU LÀ TAB CANVAS BUILDER -> CHIẾM TRỌN MÀN HÌNH BÊN DƯỚI
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <WebBuilderTab />
        </div>

      ) : (

        // NẾU LÀ TAB SOẠN CÂU / NGÂN HÀNG -> GIỮ BỐ CỤC 2 CỘT NHƯ CŨ
        <div className="flex flex-1 w-full h-full overflow-hidden">
          
          {/* CỘT TRÁI (UI) */}
          <div className="w-1/2 p-6 bg-white border-r border-gray-200 overflow-y-auto shadow-lg relative">
            {activeTab === "builder" && (
               // ĐÂY LÀ CHỖ CHỨA FORM SOẠN CÂU HỎI CŨ CỦA THẦY
               <div className="space-y-5">
                 {/* Khối quét AI */}
                 <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg flex items-center justify-between">
                   <div>
                     <h3 className="font-bold text-purple-700">📸 Quét hàng loạt (AI)</h3>
                     <p className="text-xs text-gray-600">Tự động bóc tách thành chuẩn Typst.</p>
                   </div>
                   <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700 transition shadow-sm text-sm">
                     {isScanning ? "⏳ Đang quét..." : "Tải Ảnh / PDF"}
                     <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
                   </label>
                 </div>
                 
                 {/* Form Metadata */}
                 <div className="flex gap-3 p-3 bg-gray-50 border rounded-lg">
                   <input type="text" className="w-1/3 border border-gray-300 p-2 rounded text-xs focus:ring-2 focus:ring-blue-400 outline-none" value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Chương..." />
                   <input type="text" className="w-1/3 border border-gray-300 p-2 rounded text-xs focus:ring-2 focus:ring-blue-400 outline-none" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Dạng bài..." />
                   <input type="text" className="w-1/3 border border-gray-300 p-2 rounded text-xs focus:ring-2 focus:ring-blue-400 outline-none" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Nguồn trích..." />
                 </div>

                 <div className="flex gap-3">
                   <select className="w-1/2 border border-gray-300 p-2 rounded text-sm outline-none" value={qType} onChange={(e) => setQType(e.target.value)}>
                     <option value="mcq">Trắc nghiệm</option><option value="tf">Đúng/Sai</option><option value="short">Trả lời ngắn</option><option value="essay">Tự luận</option>
                   </select>
                   <select className="w-1/2 border border-gray-300 p-2 rounded text-sm outline-none" value={level} onChange={(e) => setLevel(e.target.value)}>
                     <option value="NB">Nhận biết</option><option value="TH">Thông hiểu</option><option value="VD">Vận dụng</option><option value="VDC">Vận dụng cao</option>
                   </select>
                 </div>

                 <div>
                   <label className="block font-semibold mb-1 text-sm text-gray-700">Nội dung đề bài</label>
                   <EditorToolbar setter={setStem} currentValue={stem} elementId="stem-input" />
                   <textarea id="stem-input" className="w-full border border-gray-300 p-3 rounded h-28 text-sm outline-none focus:ring-2 focus:ring-blue-400" value={stem} onChange={(e) => setStem(e.target.value)} placeholder="Nhập đề bài..." />
                 </div>

                 {qType === "mcq" && (
                   <div className="grid grid-cols-2 gap-2">
                     {options.map((opt, idx) => (
                       <div key={idx} className="flex items-center gap-2">
                         <input type="radio" name="correct_ans" checked={ansMcq === ["A","B","C","D"][idx]} onChange={() => setAnsMcq(["A","B","C","D"][idx])} />
                         <input type="text" className="w-full border p-1.5 rounded text-xs" placeholder={`Đáp án ${["A","B","C","D"][idx]}`} value={opt} onChange={(e) => { const newOpts = [...options]; newOpts[idx] = e.target.value; setOptions(newOpts); }} />
                       </div>
                     ))}
                   </div>
                 )}

                 <div>
                   <label className="block font-semibold mb-1 text-sm text-gray-700">Lời giải chi tiết</label>
                   <EditorToolbar setter={setSol} currentValue={sol} elementId="sol-input" />
                   <textarea id="sol-input" className="w-full border border-gray-300 p-3 rounded h-20 text-sm outline-none focus:ring-2 focus:ring-blue-400" value={sol} onChange={(e) => setSol(e.target.value)} placeholder="Lời giải (tùy chọn)..." />
                 </div>

                 <button onClick={handleGenerate} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 shadow transition text-sm">
                   💾 Lưu vào Ngân hàng & Sinh Code
                 </button>
               </div>
            )}

            {activeTab === "bank" && (
               // ĐÂY LÀ CHỖ CHỨA NGÂN HÀNG CÂU HỎI CŨ CỦA THẦY
               <div className="space-y-4 flex flex-col h-full">
                 <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between gap-3">
                   <div>
                     <h4 className="font-bold text-green-800 text-sm">🎲 Trộn Đề Tự Động</h4>
                     <p className="text-xs text-green-600">Lấy ngẫu nhiên câu hỏi từ kho.</p>
                   </div>
                   <div className="flex gap-2 items-center">
                     <input type="number" min="1" className="w-16 border p-1.5 rounded text-sm text-center" value={examLimit} onChange={(e) => setExamLimit(Number(e.target.value))} />
                     <button onClick={handleGenerateExam} className="bg-green-600 text-white font-bold px-4 py-1.5 rounded text-sm hover:bg-green-700 transition">Phát Đề</button>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-2 text-xs">
                   <input type="text" className="border p-2 rounded" placeholder="Lọc Chương..." value={filterChapter} onChange={(e) => setFilterChapter(e.target.value)} />
                   <input type="text" className="border p-2 rounded" placeholder="Lọc Dạng..." value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} />
                 </div>

                 <div className="flex gap-2">
                   <input type="text" className="border p-2 rounded flex-1 text-xs" placeholder="Tìm từ khóa đề bài..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyUp={(e) => { if (e.key === 'Enter') fetchBankQuestions(); }} />
                   <button onClick={fetchBankQuestions} className="bg-gray-200 px-4 rounded font-bold text-xs hover:bg-gray-300">🔍 Lọc</button>
                 </div>

                 <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-2 rounded text-xs">
                   <label className="flex items-center gap-2 cursor-pointer font-semibold text-blue-800">
                     <input type="checkbox" checked={bankQuestions.length > 0 && selectedIds.length === bankQuestions.length} onChange={handleSelectAll} />
                     Chọn tất cả ({selectedIds.length}/{bankQuestions.length})
                   </label>
                   {selectedIds.length > 0 && (
                     <button onClick={() => handleDelete(selectedIds)} className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600">
                       🗑️ Xóa {selectedIds.length} câu
                     </button>
                   )}
                 </div>

                 <div className="flex-1 border rounded bg-white overflow-y-auto shadow-inner">
                   <ul className="divide-y">
                     {bankQuestions.map((q: any) => (
                       <li key={q.id} className="p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 group" onClick={() => setGeneratedCode(q.typst_code)}>
                         <input type="checkbox" checked={selectedIds.includes(q.id)} onChange={() => handleSelectOne(q.id)} onClick={(e) => e.stopPropagation()} className="mt-1" />
                         <div className="flex-1">
                           <div className="flex gap-1.5 mb-1">
                             <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{q.q_type.toUpperCase()}</span>
                             <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{q.level}</span>
                           </div>
                           <p className="text-xs text-gray-800 line-clamp-2">{q.stem}</p>
                         </div>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            )}
          </div>

          {/* CỘT PHẢI (CODE PREVIEW TĨNH CỦA TAB 1 VÀ 2) */}
          <div className="w-1/2 p-6 bg-gray-900 text-gray-100 overflow-y-auto flex flex-col shadow-xl z-10">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-green-400 tracking-wide">Mã Typst Trực Tiếp</h2>
              </div>
              <button 
                onClick={handleCopyCode} 
                disabled={!generatedCode}
                className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${!generatedCode ? "bg-gray-700 text-gray-500 cursor-not-allowed" : isCopied ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-500 shadow"}`}
              >
                {isCopied ? "✅ Đã Copy!" : "📋 Copy Mã Typst"}
              </button>
            </div>
            
            <div className="relative flex-1">
              <pre className="absolute inset-0 p-4 bg-gray-800 rounded-lg whitespace-pre-wrap font-mono text-xs leading-relaxed border border-gray-700 overflow-y-auto custom-scrollbar selection:bg-blue-500/30">
                {generatedCode || "// Kết quả Typst sẽ hiển thị ở đây..."}
              </pre>
            </div>
          </div>
          
        </div>
      )}
    </main>
  );
}