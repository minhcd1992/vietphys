from sqlalchemy import Column, Integer, String, JSON
from database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    
    # 3 CỘT SIÊU DỮ LIỆU ĐỂ LỌC VÀ TRÌNH BÀY
    chapter = Column(String, default="Chưa phân loại", index=True)
    topic = Column(String, default="Chưa phân loại", index=True)
    source = Column(String, default="", nullable=True)
    
    # CÁC CỘT DỮ LIỆU CÂU HỎI
    q_type = Column(String, index=True) 
    level = Column(String, index=True)  
    stem = Column(String)
    options = Column(JSON) 
    ans_mcq = Column(String)
    tf_stmts = Column(JSON) 
    tf_ans = Column(JSON)   
    short_ans = Column(String)
    sol = Column(String)
    lines = Column(String)
    typst_code = Column(String)