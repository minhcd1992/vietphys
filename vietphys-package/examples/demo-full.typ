// ==========================================
// TỆP KIỂM THỬ TÍNH NĂNG (FEATURE TEST LAB)
// Thư mục: vietphys-package/examples/test_features.typ
// ==========================================

#import "../vietphys.typ": *

// 1. DÀN TRANG
#show: doc => vp-page-setup(paper: "a4", margin: (x: 2cm, y: 2.5cm), doc)
// CHÍNH LÀ DÒNG NÀY: Áp dụng font cho toàn bộ tài liệu
#set text(font: "Times New Roman", size: 12pt, lang: "vi")

#set page(
  header: vp-header(left-text: "TEST LAB", center-text: "KIỂM THỬ SỨC MẠNH VIETPHYS", right-text: "v0.1.0", color: rgb("#722ED1")),
  footer: vp-footer(center-text: context counter(page).display("1 / 1"))
)

// 2. KHỞI TẠO HÌNH ẢNH GIẢ LẬP (MOCK IMAGE) ĐỂ TEST MÀ KHÔNG CẦN FILE THẬT
#let mock-img = box(width: 100%, height: 110pt, fill: rgb("#E6F7FF"), stroke: 1.5pt + rgb("#1890FF"), radius: 8pt, align(center+horizon)[*ẢNH MINH HỌA*])

// 3. ĐIỀU KHIỂN TRẠNG THÁI (Bật hết lên để xem giao diện)
#vp-show-ans.update(true)    // Bật đáp án
#vp-show-sol.update(true)    // Bật lời giải chi tiết
#vp-show-level.update(true)  // Hiện mức độ
#vp-show-source.update(true) // Hiện nguồn

#align(center)[
  #text(size: 22pt, weight: "black", fill: rgb("#722ED1"))[BÀI KIỂM TRA TÍNH NĂNG TOÀN DIỆN]
  #v(10pt)
]

// ==========================================
// TEST 1: HỆ THỐNG TRẮC NGHIỆM (MCQ)
// ==========================================
#vp-section(num: "I", title: "Tính năng của Trắc nghiệm (MCQ)")

// Test 1.1: Auto chia 4 cột (vì chữ ngắn) + Giao diện mặc định
#vp-question(
  [Quốc gia nào có diện tích lớn nhất thế giới? (Test auto 4 cột, giao diện Default)],
  type: "mcq", level: "Nhận biết", source: "Địa lý",
  options: ("Hoa Kỳ", "Nga", "Trung Quốc", "Canada"),
  ans: "B", sol: [Nga có diện tích hơn 17 triệu km2.]
)

// Test 1.2: Auto chia 2 cột + Đổi khoanh Vuông + Màu Tùy chỉnh Toàn diện
#vp-question(
  [Chọn công thức đúng của định luật II Newton? (Test auto 2 cột, ô vuông, màu Custom, bọc viền Câu hỏi)],
  type: "mcq", level: "Thông hiểu", source: "Vật lý 10",
  options: ("$F = m / a$", "$F = m.a$", "$F = a / m$", "$F = m.a^2$"),
  ans: "B", sol: [Định luật II Newton: Hợp lực bằng tích khối lượng và gia tốc.],
  
  // Tùy chỉnh hình dáng và màu đáp án
  ans-shape: "square", 
  ans-color: rgb("#0050B3"), 
  ans-mark-bg: rgb("#E6F7FF"), 
  ans-mark-border: rgb("#1890FF"),
  ans-text-color: rgb("#0050B3"),
  
  // Tùy chỉnh khung các đáp án bình thường
  opt-border: 1pt + rgb("#D9D9D9"), opt-radius: 4pt, opt-padding: 8pt,
  
  // Tùy chỉnh Bối cảnh câu hỏi (Label & Box)
  q-bg: rgb("#FAFAFA"), q-border: 1pt + rgb("#D9D9D9"), q-radius: 6pt,
  lbl-bg: rgb("#FFF0F6"), lbl-color: rgb("#EB2F96"), lbl-radius: 4pt, lbl-padding: (x: 8pt, y: 3pt)
)

// Test 1.3: Auto 1 cột (chữ dài) + Chèn ảnh bên TRÁI
#vp-question(
  [Dựa vào đồ thị bên, hãy cho biết vật đang chuyển động như thế nào trong giai đoạn từ $t_1$ đến $t_2$? (Test auto 1 cột, chèn ảnh Trái, tỷ lệ ảnh 35%)],
  type: "mcq", level: "Vận dụng", source: "Đề thi thử",
  options: (
    "Vật chuyển động thẳng nhanh dần đều với gia tốc dương.",
    "Vật chuyển động thẳng chậm dần đều với gia tốc âm.",
    "Vật chuyển động thẳng đều với vận tốc không đổi.",
    "Vật đứng yên, không chuyển động trong suốt thời gian khảo sát."
  ),
  ans: "C", sol: [Đồ thị v-t nằm ngang chứng tỏ v không đổi.],
  
  // Tùy chỉnh Ảnh
  image: mock-img, image-side: "left", image-ratio: 0.35, image-valign: top
)


// ==========================================
// TEST 2: HỆ THỐNG ĐÚNG/SAI (TF)
// ==========================================
#pagebreak()
#vp-section(num: "II", title: "Tính năng của Đúng/Sai (TF)")

// Test 2.1: Render dạng Bảng (Table) + Đổi màu Tiêu đề Bảng
#vp-question(
  [Cho các phát biểu sau về lực ma sát. Các phát biểu này đúng hay sai? (Test dạng Bảng, đổi màu Header bảng)],
  type: "tf", level: "Thông hiểu", source: "SBT",
  statements: (
    [Lực ma sát trượt luôn ngược chiều chuyển động của vật.],
    [Hệ số ma sát trượt phụ thuộc vào diện tích tiếp xúc.],
    [Lực ma sát nghỉ luôn có độ lớn bằng ngoại lực tác dụng.],
    [Khi lốp xe lăn trên mặt đường, lực ma sát là ma sát trượt.]
  ),
  ans-tf: ("Đ", "S", "Đ", "S"),
  sol: [Ý b sai vì hệ số ma sát chỉ phụ thuộc vật liệu. Ý d sai vì đó là ma sát lăn.],
  
  // Tùy chỉnh TF
  tf-style: "table",
  tf-header-bg: rgb("#722ED1"), tf-header-color: white,
  tf-correct-color: rgb("#52C41A"), tf-wrong-color: rgb("#F5222D")
)

// Test 2.2: Render dạng Danh sách (List) + Chèn ảnh bên PHẢI
#vp-question(
  [Quan sát hình vẽ biểu diễn lực. Đánh giá tính đúng/sai của các nhận định sau: (Test dạng List, có ảnh bên phải)],
  type: "tf", level: "Vận dụng",
  statements: (
    [Trọng lực $P$ cân bằng với phản lực $N$.],
    [Lực kéo $F$ đóng vai trò gây ra gia tốc cho vật.]
  ),
  ans-tf: ("Đ", "Đ"),
  
  // Tùy chỉnh
  tf-style: "list",
  image: mock-img, image-side: "right", image-ratio: 0.4
)


// ==========================================
// TEST 3: TRẢ LỜI NGẮN & TỰ LUẬN
// ==========================================
#vp-section(num: "III", title: "Tính năng Trả lời ngắn & Tự luận")

// Test 3.1: Short answer với ô vuông được sơn màu
#vp-question(
  [Một xe tăng tốc từ $10 "m/s"$ lên $20 "m/s"$ trong $5 "s"$. Gia tốc của xe là bao nhiêu $"m/s"^2$? (Test đổi màu ô đáp án)],
  type: "short", level: "Vận dụng",
  ans: "2", sol: [$a = (20 - 10)/5 = 2$],
  
  // Tùy chỉnh ô Short
  short-bg: rgb("#FFFBE6"), short-border: rgb("#FAAD14"), ans-color: rgb("#D46B08")
)

// Test 3.2: Tự luận tạo dòng kẻ đứt + Nền khối
#vp-question(
  [Trình bày nội dung định luật Vạn vật hấp dẫn và viết biểu thức. (Test in 5 dòng kẻ, bọc nền)],
  type: "essay", level: "Vận dụng cao",
  ans: "Xem Lời giải", sol: [$F_(h d) = G (m_1 m_2) / r^2$],
  
  // Tùy chỉnh Dòng kẻ và Nền
  lines: 5, q-bg: rgb("#F9F0FF"), q-border: 1pt + rgb("#B37FEB"), q-radius: 8pt
)


// ==========================================
// TEST 4: KẾT XUẤT ĐÁP ÁN CUỐI SÁCH
// ==========================================
#pagebreak()
#vp-print-keys()

// Vì vp-show-sol ở trên đã được bật thành true, nên lời giải đã hiện trực tiếp ở dưới từng câu hỏi. 
// Hàm vp-print-solutions() dưới đây sẽ tự động không in gì cả để tránh trùng lặp.
#vp-print-solutions()

// ==========================================
// TEST 5: CƠ CHẾ ĐIỀU KHIỂN LỜI GIẢI THÔNG MINH
// ==========================================
#pagebreak()
#vp-section(num: "IV", title: "Test Lọc Lời Giải Đã Hiển Thị")

// 1. Tắt lời giải trực tiếp từ lúc này trở đi
#vp-show-sol.update(false)

// Khối cảnh báo
#vp-knowledge-box(
  type: "note", title: "Thông báo trạng thái",
  content: [Từ Câu 5 trở đi, lệnh `#vp-show-sol.update(false)` đã được kích hoạt. Lời giải sẽ không xuất hiện dưới câu hỏi nữa, mà sẽ tự động được thu gom và đẩy xuống mục "HƯỚNG DẪN GIẢI CHI TIẾT" ở cuối sách.]
)
#v(10pt)

// Câu 5: Lời giải sẽ ẩn đi
#vp-question(
  [Theo định luật III Newton, lực và phản lực có đặc điểm gì? (Test tắt giải, có công thức)],
  type: "mcq", level: "Thông hiểu",
  options: (
    [Tác dụng vào cùng một vật.],
    [Tác dụng vào hai vật khác nhau.],
    [Luôn có độ lớn khác nhau.],
    [Không cùng giá.]
  ),
  ans: "B", sol: [Lực và phản lực xuất hiện thành từng cặp, tác dụng lên 2 vật tương tác: $vec(F)_(12) = - vec(F)_(21)$.]
)

// Câu 6: Dạng đúng/sai không hiển thị giải
#vp-question(
  [Đánh giá tính Đúng/Sai của các biểu thức sau trong chuyển động thẳng biến đổi đều:],
  type: "tf", level: "Vận dụng",
  statements: (
    [$v = v_0 + a t$],
    [$d = v_0 t + 1/2 a t^2$],
    [$v^2 - v_0^2 = 2 a d$],
    [$a = (v - v_0) / t^2$] // Sai
  ),
  ans-tf: ("Đ", "Đ", "Đ", "S"),
  sol: [Công thức gia tốc đúng là $a = (v - v_0) / t$, ý d sai vì mẫu số là $t^2$.]
)

// ==========================================
// KẾT XUẤT CUỐI SÁCH (SẼ TỰ ĐỘNG CHẮT LỌC)
// ==========================================
#pagebreak()
#vp-print-keys()

#v(20pt)
// Hàm này sẽ tự động bỏ qua Câu 1,2,3,4 (do đã hiện giải ở trên) và CHỈ in giải của Câu 5 và Câu 6!
#vp-print-solutions()