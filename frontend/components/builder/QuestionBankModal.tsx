import React, { useState, useEffect } from "react";

interface Question {
  id: string | number;
  topic: string;
  level: string;
  stem: string;
  options: string[];
  answer: string;
  solution: string;
}

export default function QuestionBankModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (qs: Question[]) => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Lấy data từ Backend thật (FastAPI)
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // SỬA URL NÀY THÀNH API THẬT CỦA THẦY
      fetch("http://localhost:8000/questions")
        .then(res => {
           if (!res.ok) throw new Error("API chưa kết nối");
           return res.json();
        })
        .then(data => {
           setQuestions(data);
           setLoading(false);
        })
        .catch(err => {
           console.error(err);
           // DỮ LIỆU DỰ PHÒNG NẾU BACKEND CHƯA CHẠY ĐỂ THẦY TEST UI
           setQuestions([
             { id: 1, topic: "Dao động cơ", level: "Nhận biết", stem: "Một con lắc lò xo dao động với tần số góc $omega$. Chu kỳ dao động là?", options: ["$2pi/omega$", "$omega/(2pi)$", "$1/omega$", "$2pi omega$"], answer: "A", solution: "Áp dụng công thức $T = 2pi/omega$." },
             { id: 2, topic: "Sóng cơ", level: "Vận dụng", stem: "Trong hiện tượng giao thoa sóng nước, hai nguồn kết hợp A, B dao động cùng pha. Vị trí cực đại giao thoa có hiệu đường đi thoả mãn:", options: ["$k lambda$", "$(k + 0.5) lambda$", "$2k lambda$", "$(2k+1) lambda/2$"], answer: "A", solution: "Cực đại cùng pha khi $d_2 - d_1 = k lambda$." }
           ]);
           setLoading(false);
        });
    }
  }, [isOpen]);

  const toggleSelect = (q: Question) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(q.id)) newSet.delete(q.id);
    else newSet.add(q.id);
    setSelectedIds(newSet);
  };

  const handleConfirm = () => {
    const selectedData = questions.filter(q => selectedIds.has(q.id));
    onSelect(selectedData);
    setSelectedIds(newSet => new Set()); // Reset
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800"><i className="fas fa-database text-blue-500 mr-2"></i> Ngân hàng Câu hỏi Vật Lý</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl"><i className="fas fa-times"></i></button>
        </div>

        {/* BỘ LỌC (Tương lai sẽ làm) */}
        <div className="p-3 border-b flex gap-3 bg-white">
           <select className="border p-2 rounded text-sm"><option>Tất cả Chủ đề</option><option>Dao động cơ</option></select>
           <select className="border p-2 rounded text-sm"><option>Tất cả Mức độ</option><option>Nhận biết</option></select>
           <div className="flex-1"></div>
           <span className="self-center text-sm font-bold text-blue-600">Đã chọn: {selectedIds.size} câu</span>
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {loading ? <div className="text-center mt-10">Đang tải dữ liệu từ Backend...</div> : (
            <div className="space-y-3">
              {questions.map(q => (
                <div key={q.id} onClick={() => toggleSelect(q)} className={`p-4 bg-white border rounded cursor-pointer transition-all ${selectedIds.has(q.id) ? 'border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.3)]' : 'border-gray-200 hover:border-blue-300'}`}>
                   <div className="flex gap-3">
                      <div className="pt-1">
                         <input type="checkbox" checked={selectedIds.has(q.id)} readOnly className="w-4 h-4 cursor-pointer" />
                      </div>
                      <div className="flex-1">
                         <div className="flex gap-2 mb-2">
                           <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{q.topic}</span>
                           <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">{q.level}</span>
                         </div>
                         <p className="text-sm font-bold text-gray-800 mb-2">{q.stem}</p>
                         <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            {q.options.map((opt, i) => <div key={i}>{String.fromCharCode(65+i)}. {opt}</div>)}
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded text-sm font-bold text-gray-600 hover:bg-gray-100">Huỷ bỏ</button>
          <button onClick={handleConfirm} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-sm font-bold"><i className="fas fa-check mr-2"></i> Nhập {selectedIds.size} câu vào Đề</button>
        </div>
      </div>
    </div>
  );
}