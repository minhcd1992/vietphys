// Khởi tạo khổ giấy và lề chuẩn
#let vp-page-setup(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  body
) = {
  // 1. Cấu hình Trang giấy
  set page(paper: paper, margin: margin)
  
  // 2. Cấu hình Font chữ, Kích thước, Màu sắc và THÊM Ngôn ngữ tiếng Việt
  set text(font: "Arial", size: 11pt, fill: rgb("#333333"), lang: "vi")
  
  // 3. Cấu hình đoạn văn (canh đều 2 bên, giãn dòng)
  set par(justify: true, leading: 1.2em)
  
  // 4. Khởi tạo bộ đếm cho Hình ảnh, Bảng biểu (nếu có)
  show figure: set block(breakable: true)
  
  // 5. Cấu hình Toán học (Hiển thị phân số to và sửa dấu phẩy thập phân)
  show math.frac: math.display
  show math.comma: ","
  
  // 6. Render nội dung
  body
}