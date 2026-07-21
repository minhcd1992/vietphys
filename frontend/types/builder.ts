// ==========================================
// 1. CÁC KIỂU DỮ LIỆU CƠ SỞ (ENUMS & TYPES)
// ==========================================
export type NodeType = "Container" | "Section" | "Row" | "Module";
export type ModuleName = "Question" | "Text" | "Image";

// ==========================================
// 2. INTERFACE CHO NỘI DUNG VẬT LÝ (QUESTION)
// ==========================================
export interface QuestionData {
  id?: number | string;
  q_type: "mcq" | "tf" | "essay" | "short";
  level: "NB" | "TH" | "VD" | "VDC" | "HSG";
  stem: string;
  options?: string[];
  ans?: string | string[];
  sol?: string;
  typst_code?: string; // Chứa mã Typst thô đã render từ backend
}

// ==========================================
// 3. INTERFACE CHO CÁC NODE KÉO THẢ (DOM TREE)
// ==========================================

// Gốc của một Node luôn có ID và Type
export interface BaseNode {
  id: string;
  type: NodeType;
}

// Tầng 1: CONTAINER (Bao quát toàn bộ Đề thi / Tài liệu)
export interface ContainerNode extends BaseNode {
  type: "Container";
  properties: {
    title: string;           
    subtitle?: string;       
    paperSize?: string; 
    
    // --- Bổ sung các thuộc tính Page Setup mới ---
    margin?: string;
    font?: string;
    fontSize?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    
    // --- DÒNG QUAN TRỌNG NHẤT ---
    [key: string]: any; // Cho phép nhét thêm bất kỳ thuộc tính CSS/Config nào sau này mà không bao giờ bị TypeScript cản đường nữa!
  };
  children: (SectionNode | RowNode | ModuleNode)[]; 
}

// Tầng 2: SECTION (Các phần lớn trong đề thi)
export interface SectionNode extends BaseNode {
  type: "Section";
  properties: {
    title: string;           // Tên phần (Ví dụ: PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN)
    level?: number;          // Mức độ Heading (1, 2, 3...)
  };
  children: (RowNode | ModuleNode)[];
}

// Tầng 3: ROW (Hàng chia layout, dùng cho việc đặt 2 câu hỏi song song)
export interface RowNode extends BaseNode {
  type: "Row";
  properties: {
    columns: number;         // Số cột (Thường là 1 hoặc 2)
    gutter?: string;         // Khoảng cách giữa các cột (Ví dụ: "1em")
  };
  children: ModuleNode[];    // Row thường chỉ chứa các Module lõi
}

// Tầng 4: MODULE (Khối nội dung lõi cuối cùng - Leaf Node)
export interface ModuleNode extends BaseNode {
  type: "Module";
  moduleName: ModuleName;    // Cờ định danh để gọi đúng hàm trong vietphys (Question, Text...)
  properties: {
    data: QuestionData | any; // Chứa toàn bộ dữ liệu của câu hỏi hoặc chuỗi text
  };
  // Module là điểm cuối, không có children
}

// ==========================================
// 4. KIỂU DỮ LIỆU TỔNG HỢP (UNION TYPE)
// ==========================================
// Dùng type này làm kiểu dữ liệu chung khi truyền state trong React
export type BuilderNode = ContainerNode | SectionNode | RowNode | ModuleNode;