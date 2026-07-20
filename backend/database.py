from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Tạo file CSDL tên là hoc-kage.db nằm ngay trong thư mục backend
SQLALCHEMY_DATABASE_URL = "sqlite:///./hoc-kage.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()