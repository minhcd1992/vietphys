// ==========================================
// TỆP ĐỀ CƯƠNG ÔN TẬP KHÍ LÍ TƯỞNG
// Thư mục: vietphys-package/examples/demo_khi_li_tuong.typ
// ==========================================

#import "../vietphys.typ": *

// 1. DÀN TRANG & FONT CHỮ
#show: doc => vp-page-setup(paper: "a4", margin: (x: 2cm, y: 2.5cm), doc)
#set text(font: "Times New Roman", size: 12pt, lang: "vi")

// Thiết lập Header / Footer
#set page(
  header: vp-header(left-text: "VẬT LÝ 12", center-text: "ĐỀ CƯƠNG ÔN TẬP", right-text: "Năm học: 2026", color: rgb("#0050B3")),
  footer: vp-footer(left-text: "Biên soạn: Thầy Chung Diệu Minh", center-text: context counter(page).display("1 / 1"))
)

// Khởi tạo hình ảnh giả lập để test
#let mock-img = box(width: 100%, height: 120pt, fill: rgb("#F0F5FF"), stroke: 1pt + rgb("#ADC6FF"), radius: 4pt, align(center+horizon)[*ĐỒ THỊ / HÌNH ẢNH MINH HỌA*])

// ==========================================
// TIÊU ĐỀ CHÍNH
// ==========================================
#align(center)[
  #v(10pt)
  #text(size: 24pt, weight: "black", fill: rgb("#0050B3"))[ĐỀ CƯƠNG ÔN TẬP: KHÍ LÍ TƯỞNG]
  #v(10pt)
  #line(length: 60%, stroke: 2pt + rgb("#0050B3"))
  #v(15pt)
]

// ==========================================
// PHẦN I: TÓM TẮT KIẾN THỨC
// ==========================================
#vp-section(num: "I", title: "TÓM TẮT KIẾN THỨC")

Khí lí tưởng là một mô hình vật lý quan trọng, giúp đơn giản hóa việc nghiên cứu các đặc tính của chất khí trong tự nhiên.

#vp-knowledge-box(
  type: "definition", title: "1. Định nghĩa Khí lí tưởng", color: vp-colors.primary,
  content: [Chất khí trong đó các phân tử được coi là các chất điểm (kích thước vô cùng nhỏ) và chúng chỉ tương tác với nhau khi va chạm được gọi là khí lí tưởng.]
)

#vp-knowledge-box(
  type: "theorem", title: "2. Phương trình trạng thái Clapeyron - Mendeleev", color: vp-colors.danger,
  content: [
    Mối liên hệ giữa áp suất $p$, thể tích $V$ và nhiệt độ tuyệt đối $T$ của một lượng khí lí tưởng:
    #align(center)[$p V = n R T$]
    Trong đó: $n$ là số mol khí, $R = 8.31 "J/(mol.K)"$ là hằng số khí lí tưởng.
  ]
)

#vp-knowledge-box(
  type: "warning", title: "Lưu ý quan trọng khi làm bài",
  content: [Nhiệt độ $T$ trong các phương trình khí lí tưởng bắt buộc phải dùng thang Kelvin ($K$). Công thức chuyển đổi: $T = t^degree C + 273$.]
)
#v(10pt)

// ==========================================
// PHẦN II: BÀI TẬP VÍ DỤ
// ==========================================
#vp-section(num: "II", title: "BÀI TẬP VÍ DỤ")

// BẬT hiển thị Đáp án & Lời giải cho phần Ví dụ
#vp-show-ans.update(true)
#vp-show-sol.update(true)

// Ví dụ 1: MCQ
#vp-question(
  [Trạng thái của một lượng khí nhất định được đặc trưng bởi ba thông số nào sau đây?],
  type: "mcq", level: "Nhận biết",
  options: ([$p, V, m$], [$p, V, T$], [$V, T, m$], [$p, T, m$]),
  ans: "B", sol: [Ba thông số trạng thái của một lượng khí là Áp suất ($p$), Thể tích ($V$) và Nhiệt độ tuyệt đối ($T$).]
)

// Ví dụ 2: TF
#vp-question(
  [Một khối khí lí tưởng thực hiện quá trình đẳng nhiệt. Các phát biểu sau đúng hay sai?],
  type: "tf", level: "Thông hiểu",
  statements: (
    [Nhiệt độ của khối khí không đổi.],
    [Áp suất của khối khí tỉ lệ thuận với thể tích.],
  ),
  ans-tf: ("Đ", "S"), sol: [Theo định luật Boyle, quá trình đẳng nhiệt có $T = "const"$, khi đó áp suất tỉ lệ nghịch với thể tích ($p ~ 1/V$).]
)

// Ví dụ 3: Short
#vp-question(
  [Một bình kín chứa $2 "mol"$ khí lí tưởng ở nhiệt độ $300 "K"$. Thể tích của bình là bao nhiêu lít? (Lấy $R = 0.082 "atm.L/(mol.K)"$ và áp suất là $1 "atm"$).],
  type: "short", level: "Vận dụng",
  ans: "49.2", sol: [Áp dụng phương trình trạng thái: $V = (n R T) / p = (2 times 0,082 times 300) / 1 = 49.2 "L"$.]
)

// Ví dụ 4: Essay
#vp-question(
  [Giải thích tại sao khi bơm căng một quả bóng bay rồi để ngoài nắng thì quả bóng rất dễ bị vỡ?],
  type: "essay", level: "Vận dụng cao",
  ans: "Do áp suất khí tăng", sol: [Khi để ngoài nắng, nhiệt độ của lượng khí trong bóng tăng lên. Do thể tích bóng bị giới hạn bởi vỏ cao su (gần như đẳng tích lúc bóng đã căng), áp suất khí bên trong sẽ tăng mạnh theo định luật Charles ($p ~ T$). Khi áp suất vượt quá giới hạn chịu đựng của vỏ cao su, bóng sẽ vỡ.]
)
#pagebreak()


// ==========================================
// PHẦN III: BÀI TẬP LUYỆN TẬP
// ==========================================
#vp-section(num: "III", title: "BÀI TẬP LUYỆN TẬP")

// TẮT Lời giải & Đáp án (Học sinh tự làm, sẽ tự động in xuống cuối sách)
#vp-show-ans.update(false)
#vp-show-sol.update(false)


// ------------------------------------------
// PHẦN 1: TRẮC NGHIỆM KHÁCH QUAN (MCQ)
#vp-lesson(num: "1", title: "TRẮC NGHIỆM KHÁCH QUAN NHIỀU PHƯƠNG ÁN", color: vp-colors.primary)
#vp-q-counter.update(0) // Reset lại từ Câu 1

// Câu 1: Auto 4 cột
#vp-question(
  [Quá trình biến đổi trạng thái trong đó nhiệt độ được giữ không đổi gọi là quá trình gì?],
  type: "mcq", level: "Nhận biết", source: "Sách giáo khoa",
  options: ("Đẳng áp", "Đẳng tích", "Đẳng nhiệt", "Đoạn nhiệt"),
  ans: "C", sol: [Quá trình đẳng nhiệt là quá trình biến đổi trạng thái mà nhiệt độ được giữ không đổi.],
  lines: 3
)

// Câu 2: Auto 2 cột + Ảnh Trái + Không nguồn
#vp-question(
  [Dựa vào đồ thị $p - V$ của một lượng khí lí tưởng bên dưới, hãy cho biết quá trình từ (1) sang (2) là quá trình gì?Dựa vào đồ thị $p - V$ của một lượng khí lí tưởng bên dưới, hãy cho biết quá trình từ (1) sang (2) là quá trình gì?Dựa vào đồ thị $p - V$ của một lượng khí lí tưởng bên dưới, hãy cho biết quá trình từ (1) sang (2) là quá trình gì?Dựa vào đồ thị $p - V$ ],
  stem2: [của một lượng khí lí tưởng bên dưới, hãy cho biết quá trình từ (1) sang (2) là quá trình gì?Dựa vào đồ thị $p - V$ của một lượng khí lí tưởng bên dưới, hãy cho biết quá trình từ (1) sang (2) là quá trình gì?Dựa vào đồ thị $p - V$ của một lượng khí lí tưởng bên dưới, hãy cho biết quá trình từ (1) sang (2) là quá trình gì?],
  type: "mcq", level: "Thông hiểu",
  options: ("Đẳng tích", "Đẳng áp", "Đẳng nhiệt", "Bất kì"),
  ans: "A", sol: [Đồ thị trong hệ $p-V$ biểu diễn đoạn thẳng song song với trục $p$ là quá trình đẳng tích.],
  image: mock-img, image-side: "right", image-ratio: 0.35, lines: 3
)

// Câu 3: Auto 1 cột + Có nguồn
#vp-question(
  [Một lượng khí lí tưởng ở nhiệt độ $27^degree C$ được nung nóng đẳng tích đến khi áp suất tăng gấp đôi. Nhiệt độ của khí lúc này là bao nhiêu?],
  type: "mcq", level: "Vận dụng", source: "Đề thi thử 2026",
  options: ([$54^degree C$], [$300^degree C$], [$600^degree C$], [$327^degree C$]),
  ans: "D", sol: [$T_1 = 300K$. Đẳng tích nên $T_2/T_1 = p_2/p_1 = 2 => T_2 = 600K = 327^degree C$.],
  lines: 3
)


// ------------------------------------------
// PHẦN 2: TRẮC NGHIỆM ĐÚNG/SAI
#v(10pt)
#vp-lesson(num: "2", title: "TRẮC NGHIỆM ĐÚNG / SAI", color: vp-colors.warning)
#vp-q-counter.update(0) // Reset về Câu 1

// Câu 1: Bảng + Style màu cam bo viền
#vp-question(
  [Cho phương trình trạng thái của khí lí tưởng: $(p V) / T = "const"$. Đánh giá tính Đúng/Sai của các nhận định:],
  type: "tf", level: "Thông hiểu", tf-style: "table",
  statements: (
    [Hằng số trên vế phải phụ thuộc vào bản chất của chất khí.],
    [Hằng số này phụ thuộc vào khối lượng của khối khí.],
    [Nếu giữ nhiệt độ không đổi, áp suất tỉ lệ thuận với thể tích.],
    [Khi đun nóng đẳng tích, áp suất sẽ tăng.]
  ),
  ans-tf: ("S", "Đ", "S", "Đ"), 
  sol: [Hằng số là $n.R$ nên phụ thuộc số mol (khối lượng), không phụ thuộc loại khí. Đẳng nhiệt $p ~ 1/V$ (nghịch).],
  lines: 5,
  // Đổi label "Câu" sang màu cam + bo viền
  lbl-bg: rgb("#FFF2E8"), lbl-color: rgb("#FA541C"), lbl-radius: 4pt, lbl-padding: (x: 8pt, y: 3pt)
)

// Câu 2: List + Ảnh phải + Style cam bo viền
#vp-question(
  [Quan sát cơ cấu xi lanh - pittong đang nén khí bên phải. Các phát biểu sau đúng hay sai?],
  type: "tf", level: "Vận dụng", tf-style: "list",
  statements: (
    [Khối lượng riêng của khí trong xi lanh giảm xuống.],
    [Nội năng của khối khí tăng lên do nhận công.],
  ),
  ans-tf: ("S", "Đ"), sol: [Nén khí => $V$ giảm, $m$ không đổi => $rho = m/V$ tăng. Khí nhận công => Nội năng tăng.],
  image: mock-img, image-side: "right", image-ratio: 0.4, lines: 5,
  lbl-bg: rgb("#FFF2E8"), lbl-color: rgb("#FA541C"), lbl-radius: 4pt, lbl-padding: (x: 8pt, y: 3pt)
)


// ------------------------------------------
// PHẦN 3: TRẢ LỜI NGẮN
#v(10pt)
#vp-lesson(num: "3", title: "CÂU HỎI TRẢ LỜI NGẮN", color: rgb("#13C2C2"))
#vp-q-counter.update(0) // Reset về Câu 1

// Câu 1: Trả lời ngắn có Icon cây bút màu xanh
#vp-question(
  [Một khối khí chiếm thể tích $2 "L"$ ở áp suất $1 "atm"$. Khi nén đẳng nhiệt khối khí đến thể tích $0.5 "L"$, áp suất của nó bằng bao nhiêu $"atm"$?],
  type: "short", level: "Vận dụng",
  ans: "4", sol: [Đẳng nhiệt: $p_1 V_1 = p_2 V_2 => 1 times 2 = p_2 times 0.5 => p_2 = 4 "atm"$.],
  lines: 4,
  // Thay đổi icon cây bút và màu xanh lam
  icon-before: "🖊", lbl-color: rgb("#1890FF")
)

// Câu 2: Trả lời ngắn có Icon cây bút
#vp-question(
  [Làm nóng một lượng khí đẳng tích từ $27^degree C$ lên đến $87^degree C$. Nếu áp suất ban đầu là $3 "atm"$, độ tăng áp suất của khí là bao nhiêu $"atm"$?],
  type: "short", level: "Vận dụng cao",
  ans: "0.6", sol: [$T_1 = 300K, T_2 = 360K$. Đẳng tích: $p_2/T_2 = p_1/T_1 => p_2 = 3.6 "atm"$. Độ tăng $Delta p = 3.6 - 3 = 0.6 "atm"$.],
  lines: 4,
  icon-before: "🖊", lbl-color: rgb("#1890FF")
)


// ------------------------------------------
// PHẦN 4: TỰ LUẬN
#v(10pt)
#vp-lesson(num: "4", title: "BÀI TẬP TỰ LUẬN", color: vp-colors.danger)
#vp-q-counter.update(0) // Reset về Câu 1

// Câu 1: Tự luận viền bao quanh + level color custom
#vp-question(
  [Một bình thép chứa khí Oxy có thể tích $10 "L"$ ở nhiệt độ $27^degree C$ và áp suất $2 "atm"$. Người ta rút bớt một nửa lượng khí trong bình, sau đó mang bình ra phơi nắng để nhiệt độ tăng lên $77^degree C$. Tính áp suất của khí trong bình lúc này.],
  type: "essay", level: "Vận dụng cao",
  ans: "1.17 atm", sol: [Rút 1 nửa lượng khí => $n_2 = n_1 / 2$. Thể tích bình không đổi $V_2 = V_1$. Áp dụng $P V = n R T$, lập tỉ số => $p_2 / p_1 = (n_2 T_2) / (n_1 T_1) => p_2 = 2 times (0.5 times 350) / 300 approx 1.17 "atm"$.],
  lines: 6,
  // Custom Box
  q-bg: rgb("#FFF1F0"), q-border: 1pt + rgb("#FF4D4F"), q-radius: 8pt,
  level-color: rgb("#52C41A") // Màu mức độ xanh lá
)

// Câu 2
#vp-question(
  [Phát biểu và viết biểu thức của định luật Charles đối với một lượng khí lí tưởng xác định.],
  type: "essay", level: "Thông hiểu",
  ans: "Xem giải chi tiết", sol: [Định luật Charles: Trong quá trình đẳng áp của một lượng khí nhất định, thể tích tỉ lệ thuận với nhiệt độ tuyệt đối. Biểu thức: $V / T = "const"$.],
  lines: 6,
  q-bg: rgb("#F6FFED"), q-border: 1pt + rgb("#52C41A"), q-radius: 8pt,
  level-color: rgb("#FF4D4F") // Màu mức độ đỏ
)


// ==========================================
// PHẦN IV: LỜI GIẢI CHI TIẾT
// ==========================================
#pagebreak()
#vp-section(num: "IV", title: "LỜI GIẢI CHI TIẾT")

// Hàm tự động nhả Bảng Đáp án và Lời giải.
// Hệ thống sẽ THÔNG MINH BỎ QUA Phần II (Bài tập ví dụ) do ta đã bật #vp-show-sol ở trên, 
// và CHỈ IN ĐÁP ÁN của Phần III.
#vp-print-keys(title: "BẢNG ĐÁP ÁN NHANH (PHẦN III)")

#v(20pt)
#vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT (PHẦN III)")

// --- TẮT HẾT LEVEL VÀ NGUỒN ĐỂ MÔ PHỎNG IN ĐỀ THI ---
#vp-show-level.update(false)
#vp-show-source.update(false)

// 1. Tự luận có điểm
#vp-question(
  [Phát biểu và giải thích hiện tượng siêu lạnh của chất lỏng.],
  type: "essay", 
  points: "2 điểm"  // Chèn điểm siêu gọn
)

// 2. Đổi chữ "Câu" thành chữ "Bài"
#vp-question(
  [Tính công sinh ra khi piston di chuyển 20cm.],
  type: "essay", 
  prefix: "Bài", 
  points: "1,5 điểm"
)

// 3. Đổi thành "Ví dụ" và có icon
#vp-question(
  [Quan sát đồ thị và nhận xét.],
  type: "mcq", 
  options: ("Đúng", "Sai", "Thiếu dữ kiện"),
  prefix: "Ví dụ", icon-before: "💡"
)