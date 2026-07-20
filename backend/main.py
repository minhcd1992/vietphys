import json
import os
import difflib
import re
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

# Tải các biến bí mật từ file .env vào hệ thống
load_dotenv() 

# Lấy API Key ra để sử dụng một cách an toàn
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Lỗi: Không tìm thấy GEMINI_API_KEY trong file .env!")

# Cấu hình AI
genai.configure(api_key=API_KEY)

app = FastAPI()

# =====================================================================
# CẤU TRÚC ÉP KIỂU JSON CHO GEMINI (ĐÃ XÓA 'DEFAULT' ĐỂ FIX LỖI GOOGLE SDK)
# =====================================================================
class Question(BaseModel):
    chapter: str = Field(description="Tên chương. Nếu không có thì trả về 'Chưa phân loại'")
    topic: str = Field(description="Tên dạng bài. Nếu không có thì trả về 'Chưa phân loại'")
    source: str = Field(description="Trích dẫn nguồn/Tên đề thi. Nếu không có thì trả về chuỗi rỗng ''")
    q_type: str = Field(description="Bắt buộc: 'mcq', 'tf', hoặc 'essay'")
    level: str = Field(description="Bắt buộc phân loại độ khó: 'NB' (Chỉ hỏi lý thuyết, công thức cơ bản), 'TH' (Hiểu bản chất, tính toán 1-2 bước), 'VD' (Biến đổi toán học, nhiều bước giải), 'VDC' (Bài toán thực tế, đồ thị phức tạp, cực trị). TUYỆT ĐỐI KHÔNG ĐƯỢC CHỌN MẶC ĐỊNH MỘT MỨC.")
    stem: str = Field(description="Nội dung câu hỏi. Giữ nguyên Typst. Không để trống.")
    options: list[str] = Field(description="Mảng 4 đáp án cho MCQ. Nếu không phải MCQ thì trả về mảng rỗng []")
    statements: list[str] = Field(description="Mảng các ý cho TF. Nếu không phải TF thì trả về mảng rỗng []")
    ans: str = Field(description="DUY NHẤT 1 chữ cái in hoa (A, B, C, hoặc D) cho câu trắc nghiệm. Không viết dài dòng. Nếu là câu tự luận thì ghi đáp số.")
    ans_tf: list[str] = Field(description="Mảng 'Đ' hoặc 'S' cho TF; nếu không phải TF thì trả về mảng rỗng []")
    sol: str = Field(description="Lời giải chi tiết. BẮT BUỘC chèn ký tự xuống dòng '\\n' vào trước các cụm từ 'Giải chi tiết:' và 'Nhận xét:'.")
    lines: str = Field(description="Số dòng cần để trống cho bài tự luận, nếu có. Không có thì trả về chuỗi rỗng ''")

class QuestionList(BaseModel):
    questions: list[Question] = Field(description="Danh sách TOÀN BỘ câu hỏi. KHÔNG ĐƯỢC BỎ SÓT BẤT KỲ CÂU NÀO.")

generation_config = genai.GenerationConfig(
    response_mime_type="application/json",
    response_schema=QuestionList,
    max_output_tokens=65536,
    temperature=0.1,
)

# =====================================================================
# CẤU HÌNH CORS VÀ DATABASE
# =====================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CẬP NHẬT MODEL DATA ĐỂ NHẬN THÊM DỮ LIỆU TỪ FRONTEND
class QuestionData(BaseModel):
    chapter: str
    topic: str
    source: str
    q_type: str
    level: str
    stem: str
    options: List[str]
    ans_mcq: str
    tf_stmts: List[str]
    tf_ans: List[str]
    short_ans: str
    sol: str
    lines: str 

# =====================================================================
# CÁC HÀM TIỆN ÍCH (RENDER VÀ KIỂM TRA TRÙNG LẶP)
# =====================================================================
def render_typst(q_type, level, stem, options, ans_mcq, tf_stmts, tf_ans, short_ans, sol, lines="", source=""):
    parts = [f'#vp-question(\n  [{stem}],\n  type: "{q_type}",\n']
    
    if level and level.strip():
        parts.append(f'  level: "{level.strip()}",\n')
        
    if source and source.strip():
        parts.append(f'  source: "{source.strip()}",\n')
    
    if q_type == "mcq":
        parts.append(f'  options: ([{options[0]}], [{options[1]}], [{options[2]}], [{options[3]}]),\n')
        parts.append(f'  ans: "{ans_mcq}",\n')
    elif q_type == "tf":
        parts.append(f'  statements: ([{tf_stmts[0]}], [{tf_stmts[1]}], [{tf_stmts[2]}], [{tf_stmts[3]}]),\n')
        parts.append(f'  ans-tf: ("{tf_ans[0]}", "{tf_ans[1]}", "{tf_ans[2]}", "{tf_ans[3]}"),\n')
    elif q_type == "short":
        if short_ans.strip():
            parts.append(f'  ans: "{short_ans}",\n')

    if lines and str(lines).strip():
        parts.append(f'  lines: {str(lines).strip()},\n')
    if sol and sol.strip():
        parts.append(f'  sol: [\n    {sol}\n  ]\n')
        
    parts.append(")")
    return "".join(parts)

def is_duplicate_question(new_stem, db: Session):
    if not new_stem: return False
    all_db_questions = db.query(models.Question.id, models.Question.stem).all()
    clean_new = re.sub(r'\s+', '', new_stem).lower()
    for q in all_db_questions:
        clean_db = re.sub(r'\s+', '', q.stem).lower()
        if difflib.SequenceMatcher(None, clean_new, clean_db).ratio() > 0.85:
            return True
    return False

# =====================================================================
# API CHÍNH
# =====================================================================

@app.post("/api/scan-images")
async def scan_images(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    try:
        # SỬ DỤNG MÔ HÌNH MỚI NHẤT
        model = genai.GenerativeModel('gemini-2.5-flash') 
        
        prompt = """
        [HỆ THỐNG]
        Bạn là một chuyên gia Vật lý và lập trình Typst bậc thầy. 
        Nhiệm vụ: Trích xuất TOÀN BỘ câu hỏi bài tập từ file đính kèm thành 1 mảng JSON. 
        
        [CÁC LUẬT THÉP TUYỆT ĐỐI KHÔNG ĐƯỢC VI PHẠM]
        
        1. QUY TẮC DÙNG HÀM `#vp-qty("giá_trị", "đơn_vị")`:
           - Dấu phẩy thập phân -> Dấu chấm. (VD: 9,8 -> 9.8).
           - CẤM LỒNG VÀO BIỂU THỨC TOÁN: Không bao giờ được đặt `#vp-qty` bên trong dấu `$ ... $`. 
             ❌ SAI: `$v = #vp-qty("5", "m/s")$`
             ✅ ĐÚNG: Vận tốc `$v =$ #vp-qty("5", "m/s")`
           - ĐƠN VỊ CÓ SỐ MŨ/KÝ HIỆU: Phải bọc chuỗi đơn vị trong dấu `$`.
             ❌ SAI: `#vp-qty("9.8", "m/s"^2)`
             ✅ ĐÚNG: `#vp-qty("9.8", $"m/s"^2$)`
           - KHÔNG dùng hàm này cho chữ thông thường. (❌ SAI: `#vp-qty("3", "giai đoạn")` -> ✅ ĐÚNG: `3 giai đoạn`).

        2. QUY TẮC MÔI TRƯỜNG TOÁN HỌC TYPST ($...$):
           - Bắt buộc bọc các biến số bằng dấu `$` (Ví dụ: `$t_1$, $V_"max"$`).
           - ❌ CẤM DÙNG LaTeX (\). Dùng cú pháp Typst: `$omega$, $lambda$, $mu$, $a_"max"$`.
           - Phép nhân dùng `dot` hoặc `times` (VD: `$A dot B$`). 
           - CẤM DÙNG #vp-qty CHO BIỂU THỨC TOÁN: Nếu giá trị có chứa căn bậc hai (sqrt), phân số, biến số, tuyệt đối không dùng #vp-qty. (❌ SAI: `#vp-qty("5 sqrt(3)", "cm")` -> ✅ ĐÚNG: `$5 sqrt(3)$ cm`).
        - KIỂM TRA CHÉO ĐÁP ÁN: Tuyệt đối không được copy nhầm các phương án A, B, C, D của câu trên xuống câu dưới. Phải đọc thật kỹ!
           
        3. QUY TẮC XUẤT LỜI GIẢI (sol):
           - BẮT BUỘC phải dùng ký tự `\n` để xuống dòng giữa các phần "Phân tích", "Giải chi tiết", "Nhận xét". Tuyệt đối không viết dính liền thành 1 cục chữ.

        4. BẢNG SỐ LIỆU (#vp-table):
           - Dùng tham số `cols: (1fr, 1fr...)`. Phải có `header: (...)`. Không tự bịa thêm hàng.

        5. TRẮC NGHIỆM ĐÁP ÁN: Xóa sạch tiền tố "A.", "B.", "C.", "D.".

        [ĐỊNH DẠNG ĐẦU RA JSON BẮT BUỘC]
        Hãy trả về kết quả theo đúng cấu trúc schema đã cung cấp.

        6. THỨ TỰ QUÉT (CHỐNG BỎ SÓT):
           - Bạn BẮT BUỘC phải đọc tài liệu theo thứ tự từ trên xuống dưới, từ trang đầu đến trang cuối.
           - Quét sạch sẽ từng câu một theo đúng số thứ tự (Câu 1, Câu 2, Câu 3...). 
           - NGHIÊM CẤM việc đọc nhảy cóc, đọc lùi, hoặc tự ý bỏ qua bất kỳ câu hỏi nào.
        """
        
        parts = [prompt]
        for file in files:
            contents = await file.read()
            parts.append({"mime_type": file.content_type, "data": contents})
            
        # Truyền generation_config vào để Gemini luôn trả về JSON theo schema.
        response = model.generate_content(
            parts,
            generation_config=generation_config,
        )

        # Kiểm tra nếu tài liệu quá dài khiến phản hồi bị cắt giữa chừng.
        if response.candidates[0].finish_reason.name == "MAX_TOKENS":
            raise ValueError(
                "Lỗi: File PDF quá dài khiến AI bị cạn kiệt bộ nhớ (Max Tokens) giữa chừng. "
                "Hãy chia nhỏ file PDF ra (ví dụ: quét mỗi lần 10-15 trang)."
            )

        # Parse JSON an toàn
        raw_json = response.text
        data = json.loads(raw_json)
        question_list = data.get("questions", [])
        
        final_typst_code = ""
        saved_count = 0
        skipped_count = 0 
        
        for q in question_list:
            chapter = q.get("chapter") or "Chưa phân loại"
            topic = q.get("topic") or "Chưa phân loại"
            source = q.get("source") or ""
            q_type = q.get("q_type") or "essay"
            stem = q.get("stem") or ""

            # --- BẮT ĐẦU THÊM LƯỚI LỌC RÁC Ở ĐÂY ---
            # Nếu stem rỗng (hoặc chỉ toàn dấu cách), bỏ qua luôn câu này!
            if not stem.strip():
                continue
            # --- KẾT THÚC THÊM LƯỚI LỌC ---

            level = q.get("level") or "TH"
            
            # GET AN TOÀN CHỐNG CRASH HỆ THỐNG KHI VALUE = None
            options = q.get("options") or []
            while len(options) < 4: options.append("") 
            
            ans_mcq = q.get("ans") or ""
            
            tf_stmts = q.get("statements") or []
            while len(tf_stmts) < 4: tf_stmts.append("")
            
            tf_ans = q.get("ans_tf") or []
            while len(tf_ans) < 4: tf_ans.append("Đ")
            
            short_ans = q.get("ans") or ""
            sol = q.get("sol") or ""
            lines = str(q.get("lines") or "")

            if is_duplicate_question(stem, db):
                skipped_count += 1
                continue 
            
            typst_code = render_typst(q_type, level, stem, options, ans_mcq, tf_stmts, tf_ans, short_ans, sol, lines, source)
            final_typst_code += typst_code + "\n\n"
            
            db_question = models.Question(
                chapter=chapter, topic=topic, source=source,
                q_type=q_type, level=level, stem=stem, options=options,
                ans_mcq=ans_mcq, tf_stmts=tf_stmts, tf_ans=tf_ans,
                short_ans=short_ans, lines=lines, sol=sol, typst_code=typst_code
            )
            db.add(db_question)
            db.commit()
            saved_count += 1
            
        return {
            "status": "success", 
            "code": final_typst_code, 
            "count": saved_count,
            "message": f"Đã nạp {saved_count} câu mới. Bỏ qua {skipped_count} câu bị trùng!"
        }
    except Exception as e:
        print(f"LỖI HỆ THỐNG TẠI API /scan-images: {e}") 
        return {"status": "error", "message": str(e)}

@app.post("/api/generate-code")
async def generate_code(data: QuestionData, db: Session = Depends(get_db)):
    if is_duplicate_question(data.stem, db):
        return {"status": "error", "message": "Câu hỏi này đã tồn tại!", "code": ""}

    typst_code = render_typst(
        data.q_type, data.level, data.stem, data.options, data.ans_mcq, 
        data.tf_stmts, data.tf_ans, data.short_ans, data.sol, data.lines, data.source
    )
    
    db_question = models.Question(
        chapter=data.chapter, topic=data.topic, source=data.source,
        q_type=data.q_type, level=data.level, stem=data.stem, options=data.options,
        ans_mcq=data.ans_mcq, tf_stmts=data.tf_stmts, tf_ans=data.tf_ans,
        short_ans=data.short_ans, lines=data.lines, sol=data.sol, typst_code=typst_code
    )
    db.add(db_question)
    db.commit()
    
    return {"status": "success", "code": typst_code}

@app.get("/api/questions")
async def get_all_questions(
    q_type: str = "", level: str = "", chapter: str = "", topic: str = "", search: str = "", db: Session = Depends(get_db)
):
    query = db.query(models.Question)
    if q_type: query = query.filter(models.Question.q_type == q_type)
    if level: query = query.filter(models.Question.level == level)
    if chapter: query = query.filter(models.Question.chapter == chapter)
    if topic: query = query.filter(models.Question.topic == topic)
    if search: query = query.filter(models.Question.stem.ilike(f"%{search}%"))
    
    questions = query.order_by(models.Question.id.desc()).all()
    return {"status": "success", "data": questions}

@app.get("/api/generate-exam")
async def generate_exam(
    limit: int = 10, q_type: str = "", level: str = "", 
    chapter: str = "", topic: str = "", db: Session = Depends(get_db)
):
    query = db.query(models.Question)
    if q_type: query = query.filter(models.Question.q_type == q_type)
    if level: query = query.filter(models.Question.level == level)
    if chapter: query = query.filter(models.Question.chapter == chapter)
    if topic: query = query.filter(models.Question.topic == topic)
    
    random_questions = query.order_by(func.random()).limit(limit).all()
    
    if not random_questions:
        return {"status": "error", "message": "Không tìm thấy câu hỏi!"}

    # THUẬT TOÁN GOM NHÓM ĐỂ IN ĐỀ THI
    exam_code = f"// ĐỀ THI TỰ ĐỘNG: {limit} CÂU\n"
    if chapter: 
        exam_code += f"#heading(level: 1)[Chương: {chapter}]\n\n"

    random_questions.sort(key=lambda x: x.topic)
    
    current_topic = ""
    for q in random_questions:
        if q.topic and q.topic != "Chưa phân loại" and q.topic != current_topic:
            current_topic = q.topic
            exam_code += f"\n#heading(level: 2)[Dạng bài: {current_topic}]\n\n"
            
        fresh_code = render_typst(
            q.q_type, q.level, q.stem, q.options, q.ans_mcq, 
            q.tf_stmts, q.tf_ans, q.short_ans, q.sol, q.lines, q.source
        )
        exam_code += fresh_code + "\n\n"
        
    return {"status": "success", "code": exam_code}

# Model nhận danh sách ID cần xóa
class DeleteRequest(BaseModel):
    ids: List[int]

# API: Xóa một hoặc nhiều câu hỏi cùng lúc
@app.post("/api/questions/delete-bulk")
async def delete_questions_bulk(req: DeleteRequest, db: Session = Depends(get_db)):
    try:
        if not req.ids:
            return {"status": "error", "message": "Không có câu hỏi nào được chọn!"}
            
        # Xóa hàng loạt các ID có trong danh sách
        db.query(models.Question).filter(models.Question.id.in_(req.ids)).delete(synchronize_session=False)
        db.commit()
        
        return {"status": "success", "message": f"Đã xóa thành công {len(req.ids)} câu hỏi!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
