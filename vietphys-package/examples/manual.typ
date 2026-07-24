// ==========================================
// TỆP HƯỚNG DẪN SỬ DỤNG GÓI VIETPHYS 0.1.0
// Thư mục: vietphys-package/examples/user_manual.typ
// ==========================================

#import "../vietphys.typ": *

// ------------------------------------------
// 1. DÀN TRANG
// ------------------------------------------
#show: doc => vp-page-setup(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2cm, right: 2cm),
  doc
)

#set page(
  header: vp-header(
    left-text: "DOCUMENTATION", 
    center-text: "HƯỚNG DẪN SỬ DỤNG GÓI VIETPHYS", 
    right-text: "Phiên bản 0.1.0",
    color: vp-colors.primary
  ),
  footer: vp-footer(
    left-text: "Biên soạn: Thầy Chung Diệu Minh", 
    center-text: context counter(page).display("1 / 1"), 
    right-text: "Năm xuất bản: 2026",
    color: vp-colors.text-muted
  )
)

// ------------------------------------------
// NỘI DUNG TÀI LIỆU
// ------------------------------------------

#align(center)[
  #v(20pt)
  #text(size: 28pt, weight: "black", fill: vp-colors.primary)[TÀI LIỆU HƯỚNG DẪN SỬ DỤNG] \
  #v(10pt)
  #text(size: 16pt, weight: "bold", fill: vp-colors.text-muted)[GÓI DÀN TRANG SÁCH GIÁO KHOA VIETPHYS] \
  #v(20pt)
  #line(length: 50%, stroke: 2pt + vp-colors.primary)
  #v(20pt)
]

Tài liệu này hướng dẫn cách sử dụng các Component (khối chức năng) đã được Native-hóa trong thư viện `vietphys`.

#vp-section(num: "I", title: "Cấu trúc phân cấp sách (Hierarchy)")

Để tạo cấu trúc Chương, Bài, Mục, hãy sử dụng các lệnh sau. Chú ý rằng các tham số đều là tham số tùy chọn (có tên), bạn phải gọi đúng tên biến như `num:`, `title:`.

*1. Lệnh tạo Tiêu đề Chương:*
```typst
#vp-chapter(num: "01", title: "ĐỘNG LỰC HỌC", style: "chap_hexagon")
```
*Kết quả hiển thị:*
#vp-chapter(num: "01", title: "ĐỘNG LỰC HỌC", style: "chap_hexagon")

*2. Lệnh tạo Tiêu đề Bài học:*
```typst
#vp-lesson(num: "1", title: "BA ĐỊNH LUẬT NEWTON", color: rgb("#FF3B1D"))
```
*Kết quả hiển thị:*
#vp-lesson(num: "1", title: "BA ĐỊNH LUẬT NEWTON", color: rgb("#FF3B1D"))

#v(20pt)
#vp-section(num: "II", title: "Các khối Kiến thức (Knowledge Box)")

Gói cung cấp hàm `#vp-knowledge-box` với 4 loại (type) khác nhau: `definition` (Định nghĩa), `theorem` (Định lý), `warning` (Cảnh báo), và `note` (Lưu ý). Tham số `content` phải được đặt trong ngoặc vuông `[...]`.

*Ví dụ tạo khối Cảnh báo:*
```typst
#vp-knowledge-box(
  type: "warning",
  title: "Lưu ý quan trọng",
  content: [Không bao giờ được nhầm lẫn giữa khối lượng và trọng lượng.]
)
```
*Kết quả hiển thị:*
#vp-knowledge-box(
  type: "warning",
  title: "Lưu ý quan trọng",
  content: [Không bao giờ được nhầm lẫn giữa khối lượng và trọng lượng.]
)

*Ví dụ tạo khối Định nghĩa:*
```typst
#vp-knowledge-box(
  type: "definition",
  title: "Quán tính là gì?",
  color: vp-colors.success,
  content: [Quán tính là tính chất bảo toàn trạng thái đứng yên hay chuyển động...]
)
```
*Kết quả hiển thị:*
#vp-knowledge-box(
  type: "definition",
  title: "Quán tính là gì?",
  color: vp-colors.success,
  content: [Quán tính là tính chất bảo toàn trạng thái đứng yên hay chuyển động...]
)

#pagebreak()
#vp-section(num: "III", title: "Động cơ tạo Câu hỏi (Question Engine)")

Cốt lõi của thư viện là hàm `#vp-question`. *Đặc biệt lưu ý:* Nội dung câu hỏi (stem) là *Tham số vị trí*, nên phải được đặt ở vị trí đầu tiên, bọc trong ngoặc `[...]`, và tuyệt đối *không* dùng chữ `stem:`.

Trước khi in câu hỏi, bạn có thể bật/tắt đáp án và lời giải bằng cách gọi các trạng thái:
```typst
#vp-show-ans.update(true)   // Bật hiển thị Đáp án nhanh (Màu đỏ / ✓ ✗)
#vp-show-sol.update(false)  // Tắt hiển thị Lời giải bên dưới câu hỏi
```

#vp-show-ans.update(true)
#vp-show-sol.update(false)

*1. Câu hỏi Trắc nghiệm nhiều phương án (MCQ):*
```typst
#vp-question(
  [Phát biểu nào sau đây là đúng về gia tốc rơi tự do?],
  type: "mcq",
  level: "Nhận biết",
  options: (
    "Phụ thuộc vào khối lượng của vật.",
    "Bằng nhau tại mọi nơi trên Trái Đất.",
    "Giảm dần khi lên cao.",
    "Luôn có phương ngang."
  ),
  ans: "C",
  sol: [Gia tốc rơi tự do $g = (G M) / (R + h)^2$, do đó khi $h$ tăng thì $g$ giảm.]
)
```
*Kết quả hiển thị:*
#vp-question(
  [Phát biểu nào sau đây là đúng về gia tốc rơi tự do?],
  type: "mcq",
  level: "Nhận biết",
  options: (
    "Phụ thuộc vào khối lượng của vật.",
    "Bằng nhau tại mọi nơi trên Trái Đất.",
    "Giảm dần khi lên cao.",
    "Luôn có phương ngang."
  ),
  ans: "C",
  sol: [Gia tốc rơi tự do $g = (G M) / (R + h)^2$, do đó khi $h$ tăng thì $g$ giảm.]
)

*2. Câu hỏi Đúng/Sai (TF):*
```typst
#vp-question(
  [Một vật chuyển động thẳng đều. Các phát biểu sau đúng hay sai?],
  type: "tf",
  level: "Thông hiểu",
  statements: (
    [Gia tốc của vật bằng 0.],
    [Hợp lực tác dụng lên vật luôn khác 0.],
  ),
  ans-tf: ("Đ", "S")
)
```
*Kết quả hiển thị:*
#vp-question(
  [Một vật chuyển động thẳng đều. Các phát biểu sau đúng hay sai?],
  type: "tf",
  level: "Thông hiểu",
  statements: (
    [Gia tốc của vật bằng 0.],
    [Hợp lực tác dụng lên vật luôn khác 0.],
  ),
  ans-tf: ("Đ", "S")
)

#v(20pt)
#vp-section(num: "IV", title: "Xuất bảng Đáp án")
Ở cuối sách, bạn chỉ cần gọi 2 lệnh sau để hệ thống tự động gom toàn bộ Đáp án và Lời giải của các câu `#vp-question` đã khai báo ở trên thành bảng.

```typst
#vp-print-keys(title: "BẢNG ĐÁP ÁN NHANH")
#vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT")
```

*Kết quả sẽ tự động sinh ra như bên dưới:*
#v(10pt)
#vp-print-keys(title: "BẢNG ĐÁP ÁN")
#vp-print-solutions(title: "LỜI GIẢI")