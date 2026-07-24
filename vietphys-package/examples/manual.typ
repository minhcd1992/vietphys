// ==========================================
// CẨM NANG SỬ DỤNG VIETPHYS - SELF-COMPILING
// Tên file: vietphys-package/examples/manual_mcq.typ
// ==========================================
#import "../vietphys.typ": *
// Import thư viện tạo Dropcap từ kho package của Typst
#import "@preview/droplet:0.3.1": dropcap

// Dàn trang và Thiết lập
#show: doc => vp-page-setup(paper: "a4", margin: (x: 2cm, y: 2.5cm), doc)
#set text(font: "Times New Roman", size: 12pt, lang: "vi")
// === THÊM KHỐI NÀY ĐỂ ĐỘ LẠI GIAO DIỆN CODE ===
// 1. Đổi font chữ và kích thước cho Code
#show raw: set text(font: ("Consolas", "Courier New"), size: 11pt, fill: rgb("#1F2328"))

// 2. Thêm màu nền xám nhạt và bo góc cho các khối Code nhiều dòng
#show raw.where(block: true): it => block(
  fill: rgb("#F6F8FA"), 
  width: 100%, 
  inset: 12pt, 
  radius: 6pt, 
  stroke: 1pt + rgb("#D0D7DE"),
  it
)
// ==============================================
#let current-part = state("current-part", "Phần I - TNKQ")
#set page(
  header:context vp-header(left-text: "VIETPHYS MANUAL", center-text: "HƯỚNG DẪN SỬ DỤNG", right-text: current-part.get(), color: rgb("#722ED1")),
  footer: vp-footer(left-text: "Phiên bản 1.2", center-text: context counter(page).display("1 / 1"))
)

// Khởi tạo hình ảnh mẫu dùng chung cho tài liệu
#let mock-img = box(width: 100%, height: 100pt, fill: rgb("#E6F7FF"), radius: 4pt, stroke: 1pt + rgb("#1890FF"), align(center+horizon)[*ẢNH MINH HỌA*])

// ==========================================
// TRANG BÌA & GIỚI THIỆU
// ==========================================
#align(center)[
  #text(size: 24pt, weight: "black", fill: rgb("#722ED1"))[CẨM NANG SỬ DỤNG VIETPHYS]
  #v(5pt)
  #text(size: 16pt, weight: "bold")[PHẦN I: TRẮC NGHIỆM KHÁCH QUAN NHIỀU PHƯƠNG ÁN (MCQ)]
  #v(15pt)
]

Dạng câu hỏi Trắc nghiệm khách quan (`type: "mcq"`) là trái tim của hệ thống. Hàm `#vp-question` được trang bị động cơ tính toán không gian tự động và khả năng tùy biến giao diện vô hạn. Tài liệu này minh họa trực tiếp mã lệnh và kết quả hiển thị thực tế trong quá trình dàn trang.

#v(10pt)
// ==========================================
// TÍNH NĂNG 1
// ==========================================
#vp-section(num: "1", title: "Tính năng Tự động dàn cột (Auto-Columns Layout)")

Hệ thống sẽ tự động đo lường độ dài của các phương án A, B, C, D. Nếu chữ ngắn, nó chia 4 cột. Nếu chữ dài vừa, nó gập thành 2 cột. Nếu chữ quá dài, nó tự động xếp thành 1 cột dọc.

*Mã lệnh (Code):*
```typst
// 1. Trường hợp chữ ngắn -> Tự động 4 cột
#vp-question(
  [Phát biểu nào sau đây là đúng về khí lí tưởng?],
  type: "mcq",
  options: ("Đẳng tích", "Đẳng áp", "Đẳng nhiệt", "Đoạn nhiệt"),
  ans: "C"
)

// 2. Trường hợp chữ dài -> Tự động 2 cột
#vp-question(
  [Định luật Boyle áp dụng cho quá trình nào sau đây?],
  type: "mcq",
  options: (
    "Quá trình biến đổi trạng thái có nhiệt độ không đổi.",
    "Quá trình biến đổi trạng thái có áp suất không đổi.",
    "Quá trình biến đổi trạng thái có thể tích không đổi.",
    "Bất kì quá trình biến đổi trạng thái nào của khí lí tưởng."
  ),
  ans: "A"
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-question(
    [Phát biểu nào sau đây là đúng về khí lí tưởng?],
    type: "mcq",
    options: ("Đẳng tích", "Đẳng áp", "Đẳng nhiệt", "Đoạn nhiệt"),
    ans: "C"
  )
  #vp-question(
    [Định luật Boyle áp dụng cho quá trình nào sau đây?],
    type: "mcq",
    options: (
      "Quá trình biến đổi trạng thái có nhiệt độ không đổi.",
      "Quá trình biến đổi trạng thái có áp suất không đổi.",
      "Quá trình biến đổi trạng thái có thể tích không đổi.",
      "Bất kì quá trình biến đổi trạng thái nào của khí lí tưởng."
    ),
    ans: "A"
  )
]

// ==========================================
// TÍNH NĂNG 2
// ==========================================
#pagebreak()
#vp-section(num: "2", title: "Tùy biến Tên gọi (Prefix), Số thứ tự và Điểm số")

Khi làm đề thi hoặc tài liệu, thầy có thể đổi chữ "Câu" thành "Bài", "Ví dụ", thêm icon, và cài đặt để nội dung bám sát ngay sau Nhãn câu hỏi (bằng cách tắt Hiển thị Nhãn mức độ và Nguồn).

*Mã lệnh (Code):*
```typst
// Lệnh Reset bộ đếm về 0 (Câu tiếp theo sẽ tự động là số 1)
#vp-q-counter.update(0)

// Tắt Nhãn Level và Nguồn để nội dung bám sát chữ "Ví dụ 1"
#vp-show-level.update(false)
#vp-show-source.update(false)

#vp-question(
  [Cho một đồ thị như hình vẽ. Chọn đáp án đúng.],
  type: "mcq",
  prefix: "Ví dụ",
  icon-before: "💡",
  options: ("Tăng", "Giảm", "Không đổi", "Bằng 0")
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-q-counter.update(0)
  #vp-show-level.update(false)
  #vp-show-source.update(false)

  #vp-question(
    [Cho một đồ thị như hình vẽ. Chọn đáp án đúng.],
    type: "mcq",
    prefix: "Ví dụ",
    icon-before: "💡",
    options: ("Tăng", "Giảm", "Không đổi", "Bằng 0")
  )

  // Khôi phục lại hiển thị mặc định cho các câu sau
  #vp-show-level.update(true)
  #vp-show-source.update(true)
]

// ==========================================
// TÍNH NĂNG 3
// ==========================================
#v(15pt)
#vp-section(num: "3", title: "Điều khiển Lời giải và Dòng kẻ nháp (Worksheet)")

Thầy có thể kiểm soát việc in lời giải ngay dưới câu hỏi (sách tham khảo) hoặc giấu lời giải đi và chỉ in các dòng chấm đứt nét để học sinh làm bài (đề cương/ đề thi). Lời giải bị giấu sẽ tự động được gom xuống cuối tài liệu.

*Mã lệnh (Code):*
```typst
// BẬT Lời giải trực tiếp
#vp-show-sol.update(true)
#vp-question(
  [Tính thể tích của 1 mol khí lí tưởng ở điều kiện tiêu chuẩn.],
  type: "mcq", level: "Vận dụng",
  options: ([$22,4$ lít], [$24,79$ lít], [$22,7$ lít], [$24,0$ lít]),
  ans: "B", sol: [Theo quy chuẩn mới (IUPAC), 1 mol khí ở đktc có thể tích là $24,79$ lít.]
)

// TẮT Lời giải trực tiếp, tạo 3 dòng kẻ nháp
#vp-show-sol.update(false)
#vp-question(
  [Một lượng khí bị nung nóng. Áp suất thay đổi ra sao?],
  type: "mcq", level: "Thông hiểu",
  options: ("Tăng", "Giảm", "Không đổi", "Không xác định"),
  ans: "A", sol: [Đun nóng làm nhiệt độ tăng, áp suất tăng.],
  lines: 3 // Sinh ra 3 dòng chấm đứt nét
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-sol.update(true)
  #vp-question(
    [Tính thể tích của 1 mol khí lí tưởng ở điều kiện tiêu chuẩn.],
    type: "mcq", level: "Vận dụng",
    options: ([$22,4$ lít], [$24,79$ lít], [$22,7$ lít], [$24,0$ lít]),
    ans: "B", sol: [Theo quy chuẩn mới (IUPAC), 1 mol khí ở đktc có thể tích là $24,79$ lít.]
  )

  #vp-show-sol.update(false)
  #vp-question(
    [Một lượng khí bị nung nóng. Áp suất thay đổi ra sao?],
    type: "mcq", level: "Thông hiểu",
    options: ("Tăng", "Giảm", "Không đổi", "Không xác định"),
    ans: "A", sol: [Đun nóng làm nhiệt độ tăng, áp suất tăng.],
    lines: 3
  )
]

// ==========================================
// TÍNH NĂNG 4
// ==========================================
#pagebreak()
#vp-section(num: "4", title: "Kiến trúc Chèn Hình Ảnh Linh Hoạt (Image Scopes)")

Thầy có thể chèn ảnh bên trái, bên phải, tùy chỉnh tỉ lệ, và chọn cách chữ bao quanh ảnh (chỉ ôm một phần đề bài, hay ôm trọn cả câu hỏi và đáp án).

*Mã lệnh (Code):*
```typst
// Trường hợp 1: Ảnh chỉ ôm Đề bài (image-scope: "stem" - Mặc định)
#vp-question(
  stem: [Quan sát đồ thị $p-V$ bên phải và cho biết đây là chu trình gì?],
  stem2: [Đoạn text này nằm ở biến `stem2`, nên nó tự động tràn xuống dưới bức ảnh và chiếm toàn bộ chiều rộng trang giấy. Rất phù hợp cho các đề bài dài.],
  type: "mcq", image-scope: "stem",
  image: mock-img, image-side: "right", image-ratio: 0.35,
  options: ("Đẳng áp", "Đẳng nhiệt", "Carnot", "Otto")
)

// Trường hợp 2: Ảnh ôm trọn toàn bộ Câu hỏi và Đáp án (image-scope: "full")
#vp-question(
  [Hình bên là cơ cấu xi-lanh pittong. Bộ phận số (1) có tên gọi là gì?],
  type: "mcq", image-scope: "full",
  image: mock-img, image-side: "left", image-ratio: 0.4,
  options: ("Van xả", "Van nạp", "Bugi", "Piston")
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-question(
    [Quan sát đồ thị $p-V$ bên phải và cho biết đây là chu trình gì?],
    stem2: [Đoạn text này nằm ở biến `stem2`, nên nó tự động tràn xuống dưới bức ảnh và chiếm toàn bộ chiều rộng trang giấy. Rất phù hợp cho các đề bài dài.],
    type: "mcq", image-scope: "stem",
    image: mock-img, image-side: "right", image-ratio: 0.35,
    options: ("Đẳng áp", "Đẳng nhiệt", "Carnot", "Otto")
  )
  #v(10pt)
  #vp-question(
    [Hình bên là cơ cấu xi-lanh pittong. Bộ phận số (1) có tên gọi là gì?],
    type: "mcq", image-scope: "full",
    image: mock-img, image-side: "left", image-ratio: 0.4,
    options: ("Van xả", "Van nạp", "Bugi", "Piston")
  )
]

// ==========================================
// TÍNH NĂNG 5
// ==========================================
#pagebreak()
#vp-section(num: "5", title: "Đại tu Giao diện (Extreme UI Customization)")

Thầy có thể can thiệp sâu vào từng nét vẽ của một câu hỏi cụ thể mà không làm ảnh hưởng đến các câu khác. Tính năng này biến Typst thành công cụ đồ họa thực thụ.

*Mã lệnh (Code):*
```typst
#vp-show-ans.update(true) // Bật khoanh đáp án để xem màu
    
#vp-question(
  [Phát biểu nào sai khi nói về động năng của phân tử khí?],
  type: "mcq", level: "Vận dụng cao",
  options: ("Tỉ lệ với nhiệt độ.", "Bằng 0 ở 0 K.", "Luôn dương.", "Phụ thuộc thể tích."),
  ans: "D",
  
  // 1. Đổi nhãn "Câu" thành hộp màu nổi bật
  lbl-bg: rgb("#FFF0F6"), lbl-color: rgb("#EB2F96"), lbl-radius: 4pt, lbl-padding: (x: 8pt, y: 3pt),
  
  // 2. Bao bọc toàn bộ câu hỏi bằng một khung viền
  q-bg: rgb("#FAFAFA"), q-border: 1pt + rgb("#D9D9D9"), q-radius: 6pt, q-padding: 15pt,
  
  // 3. Đổi thiết kế đáp án A, B, C, D (Từ Tròn sang Vuông, đổi màu)
  ans-shape: "square",
  ans-color: rgb("#0050B3"),         
  ans-mark-bg: rgb("#E6F7FF"),       
  ans-mark-border: rgb("#1890FF"),   
  ans-text-color: rgb("#0050B3"),    
  
  // 4. Thiết kế ô A, B, C, D lúc bình thường (chưa được chọn)
  opt-border: 1pt + rgb("#D9D9D9"), opt-radius: 4pt
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-ans.update(true)
  #vp-question(
    [Phát biểu nào sai khi nói về động năng của phân tử khí?],
    type: "mcq", level: "Vận dụng cao",
    options: ("Tỉ lệ với nhiệt độ.", "Bằng 0 ở 0 K.", "Luôn dương.", "Phụ thuộc thể tích."),
    ans: "D",
    lbl-bg: rgb("#FFF0F6"), lbl-color: rgb("#EB2F96"), lbl-radius: 4pt, lbl-padding: (x: 8pt, y: 3pt),
    q-bg: rgb("#FAFAFA"), q-border: 1pt + rgb("#D9D9D9"), q-radius: 6pt, q-padding: 15pt,
    ans-shape: "square",
    ans-color: rgb("#0050B3"),
    ans-mark-bg: rgb("#E6F7FF"),
    ans-mark-border: rgb("#1890FF"),
    ans-text-color: rgb("#0050B3"),
    opt-border: 1pt + rgb("#D9D9D9"), opt-radius: 4pt
  )
  #vp-show-ans.update(false) // Tắt lại cho chuẩn mực
]

// ==========================================
// PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (TF)
// ==========================================
#current-part.update("Phần II - Đúng/Sai")
#pagebreak()
#align(center)[
  #text(size: 16pt, weight: "bold")[PHẦN II: TRẮC NGHIỆM ĐÚNG / SAI (TF)]
  #v(15pt)
]

Dạng câu hỏi Đúng/Sai (`type: "tf"`) trong Vietphys hỗ trợ mạnh mẽ việc tự động tạo bảng đánh giá và tùy biến màu sắc linh hoạt. Hệ thống cung cấp hai chế độ hiển thị: Dạng Bảng (Table - Mặc định) và Dạng Danh sách (List).

#v(10pt)
// ==========================================
// TÍNH NĂNG 1
// ==========================================
#vp-section(num: "1", title: "Chuyển đổi Dạng Bảng và Dạng Danh Sách")

Sử dụng tham số `tf-style: "table"` (mặc định) để tạo bảng lưới chuyên nghiệp, hoặc `tf-style: "list"` để hiển thị dạng gạch đầu dòng gọn nhẹ. Khi tắt đáp án, dạng List sẽ tự động ẩn các ô checkbox để tạo thành một danh sách đề bài thông thường.

*Mã lệnh (Code):*
```typst
// 1. Chế độ Bảng (Mặc định - Bật đáp án)
#vp-show-ans.update(true)
#vp-question(
  [Cho phương trình trạng thái của khí lí tưởng. Đánh giá tính Đúng/Sai:],
  type: "tf", tf-style: "table",
  statements: (
    [Hằng số trên vế phải phụ thuộc vào bản chất của chất khí.],
    [Hằng số này phụ thuộc vào khối lượng của khối khí.]
  ),
  ans-tf: ("S", "Đ")
)

// 2. Chế độ Danh sách (List - Bật đáp án cho Sách giáo viên)
#vp-question(
  [Một khối khí lí tưởng thực hiện quá trình đẳng nhiệt.],
  type: "tf", tf-style: "list",
  statements: (
    [Nhiệt độ của khối khí không đổi.],
    [Áp suất của khối khí tỉ lệ thuận với thể tích.]
  ),
  ans-tf: ("Đ", "S")
)

// 3. Chế độ Danh sách (List - Tắt đáp án cho Đề thi học sinh)
#vp-show-ans.update(false)
#vp-question(
  [Quan sát cơ cấu xilanh bên dưới. Các phát biểu sau đúng hay sai?],
  type: "tf", tf-style: "list",
  statements: (
    [Khối lượng riêng của khí trong xi lanh giảm xuống.],
    [Nội năng của khối khí tăng lên do nhận công.]
  ),
  ans-tf: ("S", "Đ")
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-ans.update(true)
  #vp-question(
    [Cho phương trình trạng thái của khí lí tưởng. Đánh giá tính Đúng/Sai:],
    type: "tf", tf-style: "table",
    statements: (
      [Hằng số trên vế phải phụ thuộc vào bản chất của chất khí.],
      [Hằng số này phụ thuộc vào khối lượng của khối khí.]
    ),
    ans-tf: ("S", "Đ")
  )
  
  #vp-question(
    [Một khối khí lí tưởng thực hiện quá trình đẳng nhiệt.],
    type: "tf", tf-style: "list",
    statements: (
      [Nhiệt độ của khối khí không đổi.],
      [Áp suất của khối khí tỉ lệ thuận với thể tích.]
    ),
    ans-tf: ("Đ", "S")
  )

  #vp-show-ans.update(false)
  #vp-question(
    [Quan sát cơ cấu xilanh bên dưới. Các phát biểu sau đúng hay sai?],
    type: "tf", tf-style: "list",
    statements: (
      [Khối lượng riêng của khí trong xi lanh giảm xuống.],
      [Nội năng của khối khí tăng lên do nhận công.]
    ),
    ans-tf: ("S", "Đ")
  )
]

// ==========================================
// TÍNH NĂNG 2
// ==========================================
#v(15pt)
#vp-section(num: "2", title: "Tùy biến Màu sắc Bảng Đúng/Sai")

Thầy có thể thay đổi màu nền tiêu đề, màu nền của các hàng, và màu chữ đánh dấu Đúng (✓) / Sai (✗) để phù hợp với từng ấn phẩm tài liệu.

*Mã lệnh (Code):*
```typst
#vp-show-ans.update(true) // Bật đáp án để thấy màu
#vp-question(
  [Quá trình nén khí đẳng nhiệt có các đặc điểm nào sau đây?],
  type: "tf",
  statements: (
    [Thể tích khí giảm dần.],
    [Khí truyền nhiệt ra môi trường xung quanh.],
    [Nội năng của khối khí tăng lên.]
  ),
  ans-tf: ("Đ", "Đ", "S"),
  
  // Tùy biến màu sắc Bảng
  tf-header-bg: rgb("#389E0D"),       // Màu nền Header xanh lá cây
  tf-header-color: white,             // Chữ Header màu trắng
  tf-row-bg: rgb("#F6FFED"),          // Màu nền chung của CÁC HÀNG chứa phát biểu
  tf-correct-color: rgb("#096DD9"),   // Đổi màu dấu ✓ thành xanh lam dương
  tf-wrong-color: rgb("#CF1322")      // Đổi màu dấu ✗ thành đỏ sẫm
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-ans.update(true)
  #vp-question(
    [Quá trình nén khí đẳng nhiệt có các đặc điểm nào sau đây?],
    type: "tf",
    statements: (
      [Thể tích khí giảm dần.],
      [Khí truyền nhiệt ra môi trường xung quanh.],
      [Nội năng của khối khí tăng lên.]
    ),
    ans-tf: ("Đ", "Đ", "S"),
    tf-header-bg: rgb("#389E0D"),
    tf-header-color: white,
    tf-row-bg: rgb("#F6FFED"),
    tf-correct-color: rgb("#096DD9"),
    tf-wrong-color: rgb("#CF1322")
  )
  #vp-show-ans.update(false)
]

// ==========================================
// TÍNH NĂNG 3
// ==========================================
#pagebreak()
#vp-section(num: "3", title: "Trình diễn Ngắt trang Ngầm (Breakable Blocks)")

Trong các sách giáo khoa, đôi khi một câu hỏi (bao gồm cả khung viền `q-border` và màu nền `q-bg`) chứa một đoạn trích dẫn quá dài. Nếu hệ thống đẩy toàn bộ khối đồ họa này sang trang sau, trang trước sẽ bị trống một mảng lớn. Vietphys xử lý triệt để điều này: Khung câu hỏi sẽ được "cắt gãy" một cách hoàn hảo ở cuối trang giấy và nối tiếp nền màu sang trang sau.

*Mã lệnh (Code):*
```typst
#vp-question(
  [Đây là một câu hỏi siêu dài nhằm mục đích test tính năng ngắt trang ngầm (Breakable). Thầy hãy để ý: Khung viền màu cam và nền màu vàng nhạt của câu hỏi này sẽ tự động bị cắt làm đôi ở cuối trang, thay vì bị đẩy nguyên cục sang trang mới! 
  
  // Dùng lệnh v() để tạo một khoảng trống khổng lồ ép ngắt trang
  #v(14cm) 
  
  Bùm! Chữ này đã tràn sang trang tiếp theo, nhưng vẫn được bao bọc an toàn trong khung nền màu vàng của câu hỏi này!],
  
  type: "tf", statements: ([Phát biểu A], [Phát biểu B]),
  
  // Bọc khung viền và nền cho toàn bộ câu hỏi
  q-bg: rgb("#FFFBE6"), 
  q-border: 1pt + rgb("#FAAD14"), 
  q-radius: 8pt
)
```

*Kết quả hiển thị thực tế (Hãy cuộn xuống cuối trang để xem điểm đứt gãy):*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-question(
    [Đây là một câu hỏi siêu dài nhằm mục đích test tính năng ngắt trang ngầm (Breakable). Thầy hãy để ý: Khung viền màu cam và nền màu vàng nhạt của câu hỏi này sẽ tự động bị cắt làm đôi ở cuối trang, thay vì bị đẩy nguyên cục sang trang mới! 
    
    #v(14cm) 
    
    Bùm! Chữ này đã tràn sang trang tiếp theo, nhưng vẫn được bao bọc an toàn trong khối nền màu vàng của câu hỏi này! Layout vẫn tiếp tục render bảng Đúng/Sai phía dưới một cách chính xác.],
    
    type: "tf", statements: ([Phát biểu A], [Phát biểu B]),
    q-bg: rgb("#FFFBE6"), 
    q-border: 1pt + rgb("#FAAD14"), 
    q-radius: 8pt
  )
]

// ==========================================
// PHẦN III: CÂU HỎI TRẢ LỜI NGẮN (SHORT)
// ==========================================
#current-part.update("Phần III - Trả lời ngắn")
#pagebreak()
#align(center)[
  #text(size: 16pt, weight: "bold")[PHẦN III: CÂU HỎI TRẢ LỜI NGẮN (SHORT)]
  #v(15pt)
]

Dạng câu hỏi Trả lời ngắn (`type: "short"`) tự động tạo ra các ô vuông (tối đa 4 ô) để điền đáp án ở góc phải theo đúng chuẩn cấu trúc đề thi mới. Hệ thống hỗ trợ hiển thị đáp án trực tiếp vào ô, tạo dòng kẻ nháp và tùy biến màu sắc linh hoạt.

#v(10pt)
// ==========================================
// TÍNH NĂNG 1
// ==========================================
#vp-section(num: "1", title: "Hiển thị Ô đáp án và Dòng kẻ nháp (Worksheet)")

Khi làm sách giáo viên, thầy bật hiển thị đáp án để số được điền sẵn vào các ô. Khi làm đề thi cho học sinh, thầy tắt đáp án đi, hệ thống sẽ tự động để lại các ô trống và sinh ra các dòng kẻ chấm để học sinh nháp.

*Mã lệnh (Code):*
```typst
// 1. Chế độ Sách Giáo Viên (Bật đáp án & lời giải)
#vp-show-ans.update(true)
#vp-show-sol.update(true)
#vp-question(
  [Một khối khí chiếm thể tích $2 "L"$ ở áp suất $1 "atm"$. Khi nén đẳng nhiệt khối khí đến thể tích $0,5 "L"$, áp suất của nó bằng bao nhiêu $"atm"$?],
  type: "short", level: "Vận dụng",
  ans: "4", 
  sol: [Đẳng nhiệt: $p_1 V_1 = p_2 V_2 => 1 times 2 = p_2 times 0,5 => p_2 = 4 "atm"$.]
)

// 2. Chế độ Đề Thi Học Sinh (Tắt đáp án, chừa 3 dòng nháp)
#vp-show-ans.update(false)
#vp-show-sol.update(false)
#vp-question(
  [Làm nóng một lượng khí đẳng tích từ $27^degree "C"$ lên đến $87^degree "C"$. Nếu áp suất ban đầu là $3 "atm"$, độ tăng áp suất của khí là bao nhiêu $"atm"$?],
  type: "short", level: "Vận dụng cao",
  ans: "0,6",
  lines: 3
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-ans.update(true)
  #vp-show-sol.update(true)
  #vp-question(
    [Một khối khí chiếm thể tích $2 "L"$ ở áp suất $1 "atm"$. Khi nén đẳng nhiệt khối khí đến thể tích $0,5 "L"$, áp suất của nó bằng bao nhiêu $"atm"$?],
    type: "short", level: "Vận dụng",
    ans: "4", 
    sol: [Đẳng nhiệt: $p_1 V_1 = p_2 V_2 => 1 times 2 = p_2 times 0,5 => p_2 = 4 "atm"$.]
  )

  #vp-show-ans.update(false)
  #vp-show-sol.update(false)
  #vp-question(
    [Làm nóng một lượng khí đẳng tích từ $27^degree "C"$ lên đến $87^degree "C"$. Nếu áp suất ban đầu là $3 "atm"$, độ tăng áp suất của khí là bao nhiêu $"atm"$?],
    type: "short", level: "Vận dụng cao",
    ans: "0,6",
    lines: 3
  )
]

// ==========================================
// TÍNH NĂNG 2
// ==========================================
#v(15pt)
#vp-section(num: "2", title: "Thay đổi Tiền tố (Prefix) và Tùy biến Giao diện Ô")

Thầy có thể thay chữ "Câu" thành "Bài", thêm icon cây bút, đồng thời thay đổi màu sắc của viền ô và nền ô chữ để đề bài trông sinh động hơn.

*Mã lệnh (Code):*
```typst
#vp-show-ans.update(true)

// Đổi thành "Bài", thêm icon và custom màu ô
#vp-question(
  [Một bình kín chứa $2 "mol"$ khí lí tưởng ở nhiệt độ $300 "K"$. Thể tích của bình là bao nhiêu lít? (Lấy $R = 0,082 "atm.L/(mol.K)"$ và $p = 1 "atm"$).],
  type: "short", 
  ans: "49,2",
  
  // Custom Tiền tố và Icon
  prefix: "Bài",
  icon-before: "🖊",
  lbl-color: rgb("#1890FF"),
  
  // Custom Ô đáp án
  short-border: rgb("#1890FF"), // Màu viền ô xanh lam
  short-bg: rgb("#E6F7FF"),     // Màu nền ô xanh nhạt
  ans-color: rgb("#0050B3")     // Màu chữ đáp án xanh đậm
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-ans.update(true)
  #vp-question(
    [Một bình kín chứa $2 "mol"$ khí lí tưởng ở nhiệt độ $300 "K"$. Thể tích của bình là bao nhiêu lít? (Lấy $R = 0,082 "atm.L/(mol.K)"$ và $p = 1 "atm"$).],
    type: "short", 
    ans: "49,2",
    prefix: "Bài",
    icon-before: "🖊",
    lbl-color: rgb("#1890FF"),
    short-border: rgb("#1890FF"),
    short-bg: rgb("#E6F7FF"),
    ans-color: rgb("#0050B3")
  )
  #vp-show-ans.update(false) // Trả về mặc định
]

// ==========================================
// PHẦN IV: TỰ LUẬN (ESSAY) VÀ XUẤT KẾT QUẢ
// ==========================================
#current-part.update("Phần IV - Tự luận")
#pagebreak()
#align(center)[
  #text(size: 16pt, weight: "bold")[PHẦN IV: CÂU HỎI TỰ LUẬN (ESSAY) VÀ XUẤT KẾT QUẢ]
  #v(15pt)
]

Dạng câu hỏi Tự luận (`type: "essay"`) được thiết kế đặc biệt cho các bài kiểm tra, hỗ trợ chèn điểm số trực tiếp vào đề bài và tự động tạo không gian (số dòng kẻ) tùy ý để học sinh làm bài.

#v(10pt)
// ==========================================
// TÍNH NĂNG 1
// ==========================================
#vp-section(num: "1", title: "Cấu trúc Câu Tự luận và Điểm số")

Khi chế độ Đề thi được kích hoạt (Tắt hiển thị Level và Nguồn), thầy có thể dùng biến `points` để gán điểm cho câu hỏi tự luận. Điểm số sẽ tự động bám sát theo số thứ tự của câu.

*Mã lệnh (Code):*
```typst
// Kích hoạt chế độ in Đề thi (Tắt Level và Nguồn)
#vp-show-level.update(false)
#vp-show-source.update(false)
#vp-show-sol.update(false) // Tắt hiển thị Lời giải trực tiếp

#vp-question(
  [Phát biểu và viết biểu thức của định luật Boyle đối với một lượng khí lí tưởng xác định. Từ đó, hãy vẽ phác họa đường đẳng nhiệt trong hệ tọa độ $(p, V)$.],
  type: "essay", 
  points: "2,0 điểm", // Gán điểm số cho câu hỏi
  lines: 5,           // Tạo 5 dòng kẻ chấm để học sinh viết
  sol: [
    - Phát biểu: Ở nhiệt độ không đổi, áp suất của một lượng khí xác định tỉ lệ nghịch với thể tích của nó.
    - Biểu thức: $p V = text("hằng số")$.
    - Đồ thị: Là một nhánh của đường hyperbol.
  ]
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-level.update(false)
  #vp-show-source.update(false)
  #vp-show-sol.update(false)

  #vp-question(
    [Phát biểu và viết biểu thức của định luật Boyle đối với một lượng khí lí tưởng xác định. Từ đó, hãy vẽ phác họa đường đẳng nhiệt trong hệ tọa độ $(p, V)$.],
    type: "essay", 
    points: "2,0 điểm",
    lines: 5,
    sol: [
      - Phát biểu: Ở nhiệt độ không đổi, áp suất của một lượng khí xác định tỉ lệ nghịch với thể tích của nó.
      - Biểu thức: $p V = text("hằng số")$.
      - Đồ thị: Là một nhánh của đường hyperbol.
    ]
  )
  // Khôi phục lại trạng thái mặc định
  #vp-show-level.update(true)
  #vp-show-source.update(true)
]

// ==========================================
// TÍNH NĂNG BỔ SUNG: TÙY BIẾN NHÃN CÂU & HIỂN THỊ ĐƠN VỊ VẬT LÝ
// ==========================================
#v(15pt)
#vp-section(num: "2", title: "Tùy biến Nhãn Câu hỏi và Đơn vị Vật lý")

Thầy có thể làm nổi bật chữ "Câu X:" bằng cách tô màu nền, đổi màu chữ và bo góc thông qua các biến `lbl-bg`, `lbl-color`, `lbl-radius`. 

Đồng thời, trong Typst, để gõ các đơn vị vật lý chuẩn xác (chữ đứng, không bị in nghiêng như biến số toán học), thầy chỉ cần bọc phần chữ của đơn vị vào trong dấu ngoặc kép. Ví dụ: gia tốc gõ là `$"m/s"^2$`.

*Mã lệnh (Code):*
```typst
#vp-show-ans.update(true)

#vp-question(
  [Một vật chuyển động thẳng biến đổi đều với vận tốc ban đầu $v_0 = 2 "m/s"$. Sau khoảng thời gian $t = 5 "s"$, vật đạt vận tốc $v = 12 "m/s"$. Gia tốc $a$ của vật có độ lớn bằng bao nhiêu $"m/s"^2$?],
  type: "short", level: "Vận dụng",
  ans: "2",
  
  // Tùy biến riêng cho khối chữ "Câu X:"
  lbl-bg: rgb("#FF7A45"),        // Màu nền cam nổi bật
  lbl-color: white,              // Chữ màu trắng
  lbl-radius: 4pt,               // Bo góc 4pt
  lbl-padding: (x: 8pt, y: 4pt)  // Khoảng cách từ chữ tới viền nền
)
```

*Kết quả hiển thị thực tế:*
#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-show-ans.update(true)
  #vp-question(
    [Một vật chuyển động thẳng biến đổi đều với vận tốc ban đầu $v_0 = 2 "m/s"$. Sau khoảng thời gian $t = 5 "s"$, vật đạt vận tốc $v = 12 "m/s"$. Gia tốc $a$ của vật có độ lớn bằng bao nhiêu $"m/s"^2$?],
    type: "short", level: "Vận dụng",
    ans: "2",
    lbl-bg: rgb("#FF7A45"),
    lbl-color: white,
    lbl-radius: 4pt,
    lbl-padding: (x: 8pt, y: 4pt)
  )
  #vp-show-ans.update(false) // Trả về mặc định
]


// ==========================================
// TÍNH NĂNG 2
// ==========================================
#v(15pt)
#vp-section(num: "3", title: "Xuất Bảng Đáp Án và Lời Giải Chi Tiết")

Mọi câu hỏi được định nghĩa bằng lệnh `#vp-question` trong toàn bộ tài liệu (nếu có chứa biến `ans` hoặc `sol` và không được hiển thị trực tiếp) sẽ được hệ thống âm thầm lưu trữ. Khi muốn xuất ra ở cuối sách hoặc cuối đề thi, thầy chỉ cần gọi 2 hàm dưới đây.

*Mã lệnh (Code):*
```typst
// 1. In Bảng đáp án nhanh (Dành cho MCQ, TF, Short)
#vp-print-keys(title: "BẢNG TỔNG HỢP ĐÁP ÁN")

// 2. In Hướng dẫn giải chi tiết (Cho mọi loại câu hỏi có biến `sol`)
#vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT")
```

*Kết quả hiển thị thực tế (Dữ liệu được thu thập tự động từ toàn bộ các câu hỏi minh họa từ Phần I đến Phần IV của cuốn Cẩm nang này):*

#block(breakable: true, width: 100%, stroke: 0.8pt + rgb("#D9D9D9"), inset: 15pt, radius: 4pt)[
  #vp-print-keys(title: "BẢNG TỔNG HỢP ĐÁP ÁN")
  #v(20pt)
  #vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT")
]

#pagebreak()
// =====================================
// TIÊU ĐỀ BÀI BÁO (1 CỘT)
// =====================================
#align(center)[
  #text(size: 20pt, weight: "bold", fill: rgb("#0050B3"))[NGHIÊN CỨU THỰC NGHIỆM ĐỊNH LUẬT BOYLE]
  #v(5pt)
  #text(style: "italic")[Báo cáo Phòng thí nghiệm Vật lí]
  #v(15pt)
]

// =====================================
// PHẦN LÝ THUYẾT VÀ THỰC NGHIỆM (CHIA 2 CỘT)
// =====================================
#columns(2)[
  
  #dropcap(
    height: 3, justify: true, gap: 6pt, font: "Times New Roman"
  )[
    Trong nhiệt động lực học, định luật Boyle-Mariotte mô tả mối liên hệ tỉ lệ nghịch giữa áp suất tuyệt đối và thể tích của một lượng khí lí tưởng xác định, khi nhiệt độ được giữ không đổi trong một hệ kín. Báo cáo này trình bày phương pháp thực nghiệm để kiểm chứng định luật trên bằng cách sử dụng xilanh có vạch chia độ và cảm biến áp suất điện tử.
  ]

  Quá trình đẳng nhiệt được thực hiện bằng cách thay đổi thể tích khí rất chậm. Nếu nén hoặc giãn khí quá nhanh, nhiệt độ của khối khí sẽ thay đổi do quá trình truyền nhiệt với môi trường không kịp diễn ra, dẫn đến sai lệch nghiêm trọng so với điều kiện đẳng nhiệt ban đầu.

  Dựa vào bảng dữ liệu thu được ở bên, ta có thể tính toán được tích số $p V$ cho mỗi lần đo.
  #colbreak()
  #v(8pt)
  #figure(
    caption: [Dữ liệu đo áp suất và thể tích ở $T = 300 "K"$],
    table(
      columns: (1fr, 1fr, 1fr), align: center, stroke: none,
      table.hline(stroke: 1.2pt), 
      table.header([*Lần đo*], [*$V " (mL)"$*], [*$p " (kPa)"$*]),
      table.hline(stroke: 0.5pt), 
      [1], [50,0], [101,3],
      [2], [45,0], [112,5],
      [3], [40,0], [126,6],
      [4], [35,0], [144,7],
      table.hline(stroke: 1.2pt)
    )
  )
  #v(8pt)
  
  Để quan sát rõ hơn xu hướng của dữ liệu và đánh giá độ biến thiên, chúng ta sẽ biểu diễn chúng dưới dạng một bảng tổng hợp chi tiết hơn ở phần phân tích bên dưới, đồng thời đối chiếu với các giá trị lí thuyết. 
  
  Sự chênh lệch nhẹ giữa thực nghiệm và lí thuyết chủ yếu xuất phát từ ma sát của hệ thống cơ học piston và độ rò rỉ khí vi mô qua các gioăng cao su trong suốt quá trình nén.
]

// =====================================
// PHẦN PHÂN TÍCH DỮ LIỆU (TRỞ VỀ 1 CỘT)
// =====================================
#v(15pt)
#text(size: 14pt, weight: "bold", fill: rgb("#0050B3"))[PHÂN TÍCH VÀ ĐÁNH GIÁ SAI SỐ]
#v(8pt)

Để đánh giá chính xác độ tin cậy của thực nghiệm, chúng ta tiến hành tính toán tích số $p V$ và sai số tương đối so với giá trị trung bình. Bảng dưới đây trình bày chi tiết các thông số thu được, với màu nền được xen kẽ tự động (Zebra-striping) giúp người đọc dễ dàng đối chiếu dữ liệu theo từng hàng ngang mà không bị rối mắt.

#v(5pt)
#figure(
  caption: [Bảng phân tích sai số tích $p V$ so với giá trị trung bình],
  table(
    columns: (1fr, 1fr, 1fr, 1fr, 1fr),
    align: center + horizon,
    
    // Tắt viền lưới mặc định, dùng viền trắng mỏng để cắt nền
    stroke: 0.5pt + white, 
    
    // THUẬT TOÁN TÔ MÀU XEN KẼ THÔNG MINH
    // y == 0 là dòng Header -> Tô màu xanh đậm
    // calc.rem(y, 2) != 0 là các dòng lẻ (1, 3, 5...) -> Tô xám nhạt
    fill: (x, y) => if y == 0 { rgb("#0050B3") } 
                    else if calc.rem(y, 2) != 0 { rgb("#F6F8FA") } 
                    else { rgb("#FFFFFF") },

    // Dòng Header (y = 0)
    table.header(
      text(fill: white, weight: "bold")[Lần đo],
      text(fill: white, weight: "bold")[$V " (mL)"$],
      text(fill: white, weight: "bold")[$p " (kPa)"$],
      text(fill: white, weight: "bold")[Tích số $p.V$],
      text(fill: white, weight: "bold")[Sai số (%)]
    ),

    // Nhập dữ liệu (Typst tự động xếp vào 5 cột và tự tô màu theo số dòng)
    [1], [50,0], [101,3], [5065], [0,02],
    [2], [45,0], [112,5], [5062], [0,04],
    [3], [40,0], [126,6], [5064], [0,00],
    [4], [35,0], [144,7], [5064], [0,00],
    [5], [30,0], [168,9], [5067], [0,06],
    [6], [25,0], [202,8], [5070], [0,12]
  )
)

Kết quả từ bảng phân tích cho thấy sai số tương đối của các phép đo đều rất nhỏ (dưới $0,2%$), minh chứng rõ ràng cho độ tin cậy của mô hình khí lí tưởng ở điều kiện nhiệt độ phòng và áp suất tương đối thấp.

// ==========================================
// KẾT THÚC CẨM NANG
// ==========================================
#align(center)[
  #v(30pt)
  #line(length: 50%, stroke: 1pt + rgb("#D9D9D9"))
  #v(10pt)
  #text(style: "italic", fill: rgb("#8C8C8C"))[Tài liệu được render tự động bởi Vietphys Engine - Typst.]
]