// Khởi tạo khổ giấy và lề chuẩn
#let vp-page-setup(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  body
) = {
  set page(paper: paper, margin: margin)
  set text(font: "Arial", size: 11pt, fill: rgb("#333333"))
  set par(justify: true, leading: 1.2em)
  
  // Khởi tạo bộ đếm cho Hình ảnh, Bảng biểu (nếu có)
  show figure: set block(breakable: true)
  
  body
}