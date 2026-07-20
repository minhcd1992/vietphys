#import "vietphys.typ": *

// ==========================================
// CẤU HÌNH TRANG TÀI LIỆU (PAGE SETUP)
// ==========================================
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  header: align(right)[
    #text(style: "italic", fill: luma(150), size: 10pt)[Tài liệu Hướng dẫn sử dụng thư viện Vietphys]
    #v(-0.5em)
    #line(length: 100%, stroke: 0.5pt + luma(200))
  ],
  footer: context [
    #line(length: 100%, stroke: 0.5pt + luma(200))
    #align(center)[Trang #counter(page).display("1 / 1", both: true)]
  ]
)
#set text(font: "Times New Roman", size: 12pt)
#set par(justify: true, leading: 0.8em)

// ==========================================
// TRANG BÌA (COVER PAGE)
// ==========================================
#align(center)[
  #v(4cm)
  #box(width: 80%, stroke: 2pt + vp-colors.primary, radius: 10pt, inset: 2cm)[
    #text(size: 24pt, weight: "bold", fill: vp-colors.primary)[HƯỚNG DẪN SỬ DỤNG CHI TIẾT] \
    #v(0.5cm)
    #text(size: 28pt, weight: "bold", fill: vp-colors.danger)[VIETPHYS FRAMEWORK] \
    #v(1cm)
    #text(size: 14pt, style: "italic")[Giải pháp toàn diện cho giáo viên Vật lý] \
    #v(0.5cm)
    #text(size: 12pt)[Cập nhật: Bảng số liệu, Phân loại mức độ và Trích dẫn Nguồn]
  ]
]

#pagebreak()

// ==========================================
// MỤC LỤC TỰ ĐỘNG
// ==========================================
#vp-heading([MỤC LỤC TÀI LIỆU], level: 1)
#outline(title: none, indent: auto)
#pagebreak()

// ==========================================
// CHƯƠNG 1: BỘ CÔNG TẮC ĐIỀU KHIỂN TỔNG (GLOBAL CONFIG)
// ==========================================
= CÔNG TẮC ĐIỀU KHIỂN HỆ THỐNG CÂU HỎI

Thư viện Vietphys cung cấp hàm `#vp-config` để bật/tắt hàng loạt các thông tin hiển thị trên toàn bộ tài liệu.

#vp-heading([1. Khai báo mặc định], level: 2)
Nếu không khai báo gì, hệ thống sẽ ẩn Đáp án, ẩn Lời giải, ẩn Nguồn nhưng MẶC ĐỊNH BẬT hiển thị Mức độ (Level).

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH CẤU HÌNH:*
  #raw(lang: "typst", block: true, "
  // Bật hiển thị mức độ (Level) và Nguồn (Source)
  #vp-config(level: true, source: true) 
  
  // Bật hiển thị Đáp án nhanh (ans) và Lời giải chi tiết (sol)
  #vp-config(ans: true, sol: true)
  ")
])

// Áp dụng cấu hình cho các ví dụ bên dưới
#vp-config(level: true, source: true, ans: true, sol: true)

#pagebreak()

// ==========================================
// CHƯƠNG 2: HỆ THỐNG CÂU HỎI ĐA NHIỆM (#vp-question)
// ==========================================
= 4 DẠNG CÂU HỎI CHUẨN FORM & QUẢN LÝ THÔNG TIN

Lệnh `#vp-question` là trái tim của thư viện, hỗ trợ 4 dạng: `mcq` (Trắc nghiệm), `tf` (Đúng/Sai), `short` (Trả lời ngắn), và `essay` (Tự luận). Lệnh này cũng tích hợp sẵn thuộc tính `level` và `source`.

#vp-heading([1. Dạng Trắc nghiệm (MCQ)], level: 2, color: vp-colors.text-main)

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH:*
  #raw(lang: "typst", block: true, "
  #vp-question(
    [Một vật dao động điều hòa theo phương trình $x = 5 cos(4 pi t + pi/2)$. Biên độ là:],
    type: \"mcq\",
    level: \"NB\",
    source: \"Đề thi SGD Hà Nội 2024\",
    options: ([5 cm], [4 cm], [2.5 cm], [10 cm]),
    ans: \"A\",
    sol: [Biên độ là hệ số đứng trước hàm cos, suy ra $A = 5$ cm.]
  )
  ")
])
#v(0.5em)
*✨ KẾT QUẢ HIỂN THỊ:*
#vp-question(
  [Một vật dao động điều hòa theo phương trình $x = 5 cos(4 pi t + pi/2)$. Biên độ là:],
  type: "mcq",
  level: "NB",
  source: "Đề thi SGD Hà Nội 2024",
  options: ([5 cm], [4 cm], [2.5 cm], [10 cm]),
  ans: "A",
  sol: [Biên độ là hệ số đứng trước hàm cos, suy ra $A = 5$ cm.]
)

#vp-heading([2. Dạng Đúng/Sai (TF)], level: 2, color: vp-colors.text-main)

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH:*
  #raw(lang: "typst", block: true, "
  #vp-question(
    [Trong thí nghiệm Y-âng, nguồn phát ánh sáng đơn sắc. Cho các phát biểu:],
    type: \"tf\",
    level: \"VD\",
    statements: (
      [Khoảng vân $i$ tỉ lệ thuận với khoảng cách $D$.],
      [Thay ánh sáng đỏ bằng ánh sáng tím, khoảng vân $i$ tăng.]
    ),
    ans-tf: (\"Đ\", \"S\")
  )
  ")
])
#v(0.5em)
*✨ KẾT QUẢ HIỂN THỊ:*
#vp-question(
  [Trong thí nghiệm Y-âng, nguồn phát ánh sáng đơn sắc. Cho các phát biểu:],
  type: "tf",
  level: "VD",
  statements: (
    [Khoảng vân $i$ tỉ lệ thuận với khoảng cách $D$.],
    [Thay ánh sáng đỏ bằng ánh sáng tím, khoảng vân $i$ tăng.]
  ),
  ans-tf: ("Đ", "S")
)

#vp-heading([3. Dạng Trả lời ngắn & Tự luận (Short/Essay)], level: 2, color: vp-colors.text-main)

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH:*
  #raw(lang: "typst", block: true, "
  #vp-question(
    [Tính chu kỳ dao động của con lắc đơn chiều dài $l=$ #vp-qty(\"1\", \"m\") tại nơi có $g=$ #vp-qty(\"9.8\", $\"m/s\"^2$).],
    type: \"short\",
    level: \"VDC\",
    source: \"Trích đề HSG Quốc gia\",
    ans: \"2,01\"
  )
  ")
])
#v(0.5em)
*✨ KẾT QUẢ HIỂN THỊ:*
#vp-question(
  [Tính chu kỳ dao động của con lắc đơn chiều dài $l=$ #vp-qty("1", "m") tại nơi có $g=$ #vp-qty("9.8", $"m/s"^2$).],
  type: "short",
  level: "VDC",
  source: "Trích đề HSG Quốc gia",
  ans: "2,01"
)

#pagebreak()

// ==========================================
// CHƯƠNG 3: CẤU TRÚC HÌNH ẢNH & ĐỒ THỊ BÊN TRONG CÂU HỎI
// ==========================================
= TÍCH HỢP HÌNH ẢNH MỘT BÊN (#vp-img-side)

Thư viện cung cấp hàm `#vp-img-side` để xử lý mượt mà việc chia cột hình ảnh và văn bản. Khi bạn khai báo tham số `image` vào `#vp-question`, hàm `#vp-img-side` sẽ tự động được gọi.

Ngoài ra, hệ thống tự động nhận diện chữ `placeholder` trong đường dẫn ảnh và tạo ra một ô trống để chờ chèn ảnh thực tế.

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH:*
  #raw(lang: "typst", block: true, "
  #vp-question(
    [Cho mạch điện như hình vẽ bên. Biết $R = 50 Omega$, tính dòng điện trong mạch.],
    type: \"short\",
    image: image(\"img/placeholder.png\", width: 80%), // Tự động tạo ô trống
    image-ratio: 0.6,   // Chữ chiếm 60%, hình chiếm 40%
    image-side: \"right\" // Hình nằm bên phải
  )
  ")
])
#v(0.5em)
*✨ KẾT QUẢ HIỂN THỊ:*
// Tắt tạm lời giải để giao diện gọn gàng
#vp-config(ans: false, sol: false)

#vp-question(
  [Cho mạch điện như hình vẽ bên. Biết $R = 50 Omega$, tính dòng điện trong mạch.],
  type: "short",
  image: image("img/placeholder.png", width: 80%),
  image-ratio: 0.6,
  image-side: "right"
)

#pagebreak()

// ==========================================
// CHƯƠNG 4: BẢNG SỐ LIỆU THÍ NGHIỆM (#vp-table)
// ==========================================
= BẢNG SỐ LIỆU THÔNG MINH (#vp-table)

Hàm `#vp-table` tự động căn chỉnh, tô màu tiêu đề và tạo hiệu ứng nền xen kẽ (Zebra stripes) giúp học sinh dễ tra cứu số liệu.

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH:*
  #raw(lang: "typst", block: true, "
  #vp-table(
    cols: (1fr, 1fr, 1fr, 1fr),
    theme-color: vp-colors.success, // Đổi màu bảng sang Xanh lá
    header: ([Lần đo], [Thời gian $t$ (s)], [Quãng đường $s$ (m)], [Vận tốc $v$ (m/s)]),
    [1], [1,5], [3,0], [2,0],
    [2], [2,0], [4,1], [2,05],
    [3], [2,5], [4,9], [1,96],
    [4], [3,0], [6,1], [2,03]
  )
  ")
])

#v(1em)
*✨ KẾT QUẢ HIỂN THỊ:*
#vp-table(
  cols: (1fr, 1fr, 1fr, 1fr),
  theme-color: vp-colors.success,
  header: ([Lần đo], [Thời gian $t$ (s)], [Quãng đường $s$ (m)], [Vận tốc $v$ (m/s)]),
  [1], [1,5], [3,0], [2,0],
  [2], [2,0], [4,1], [2,05],
  [3], [2,5], [4,9], [1,96],
  [4], [3,0], [6,1], [2,03]
)

#pagebreak()

// ==========================================
// CHƯƠNG 5: HỆ THỐNG SMART THEME (API ĐỔI MẶC ĐỊNH)
// ==========================================
= QUẢN LÝ MÀU SẮC VÀ GIAO DIỆN TẬP TRUNG

Thay vì đổi màu từng câu, bạn dùng hàm `#vp-set-theme` để cấu hình màu sắc cho Nhãn Mức độ (`level-color`) và Nhãn Nguồn (`source-color`) cùng các định dạng khác.

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH THAY ĐỔI THEME:*
  #raw(lang: "typst", block: true, "
  // Cấu hình giao diện câu Trắc nghiệm: 
  // Nền xanh nhạt, viền cam, chữ HSG màu tím, chữ Nguồn màu xanh dương
  #vp-set-theme(
    \"mcq\", 
    bg: rgb(\"#FFFBE6\"), 
    border: 1.5pt + vp-colors.warning,
    level-color: rgb(\"#6f42c1\"), // Màu tím
    source-color: vp-colors.primary // Màu xanh dương
  )
  ")
])

#v(0.5em)
*✨ KẾT QUẢ HIỂN THỊ SAU KHI ĐỔI THEME:*
#vp-set-theme(
  "mcq", 
  bg: rgb("#FFFBE6"), 
  border: 1.5pt + vp-colors.warning,
  level-color: rgb("#6f42c1"), 
  source-color: vp-colors.primary
)

#vp-question(
  [Một vật rơi tự do từ độ cao $h$. Chọn hệ quy chiếu...],
  type: "mcq",
  level: "HSG",
  source: "Đề chọn đội tuyển Quốc gia",
  options: ([A], [B], [C], [D])
)

#vp-question(
  [Một vật dao động điều hòa với phương trình $x = 5 cos(2 pi t + pi / 3)$ cm. Lấy $pi^2 = 10$. Gia tốc cực đại của vật có độ lớn là bao nhiêu?],
  type: "mcq",
  level: "NB",
  options: ([#vp-qty("20", $"cm/s"^2$)], [#vp-qty("200", $"cm/s"^2$)], [#vp-qty("0.2", $"m/s"^2$)], [#vp-qty("2", $"m/s"^2$)]),
  ans: "B",
  sol: [
    Ta có phương trình dao động điều hòa của vật: $x = 5 cos(2 pi t + pi / 3)$ cm.
- Biên độ dao động: $A = 5$ cm.
- Tần số góc: $omega = 2 pi$ rad/s.
Gia tốc cực đại của vật có độ lớn:
$a_"max" = omega^2 A = (2 pi)^2 dot$ #vp-qty("5", "cm") $= 4 pi^2 dot 5 = 4 dot 10 dot 5 =$ #vp-qty("200", $"cm/s"^2$).
  ]
)

#vp-question(
  [Khảo sát một con lắc đơn có chiều dài $l =$ #vp-qty("1", "m") dao động tại nơi có gia tốc trọng trường $g =$ #vp-qty("9.8", $"m/s"^2$). Cho các phát biểu sau đây:],
  type: "tf",
  level: "VD",
  statements: ([Chu kì dao động của con lắc xấp xỉ bằng #vp-qty("2.01", "s").], [Nếu tăng khối lượng quả nặng lên 2 lần thì chu kì dao động tăng lên $sqrt(2)$ lần.], [Động năng của con lắc đạt cực đại khi nó đi qua vị trí cân bằng.], [Khi chuyển con lắc từ Trái Đất lên Mặt Trăng, chu kì dao động của nó sẽ giảm đi.]),
  ans-tf: ("Đ", "S", "Đ", "S"),
  sol: [
    a) Chu kì dao động của con lắc đơn:
$T = 2 pi sqrt(l / g) = 2 pi sqrt(1 / 9.8) approx$ #vp-qty("2.01", "s"). (Phát biểu ĐÚNG)
b) Chu kì dao động của con lắc đơn $T = 2 pi sqrt(l/g)$ không phụ thuộc vào khối lượng $m$ của quả nặng. Do đó, khi tăng khối lượng lên 2 lần thì chu kì dao động vẫn không thay đổi. (Phát biểu SAI)
c) Khi con lắc đi qua vị trí cân bằng, tốc độ của vật đạt giá trị cực đại, do đó động năng của con lắc đạt cực đại. (Phát biểu ĐÚNG)
d) Gia tốc trọng trường trên Mặt Trăng nhỏ hơn trên Trái Đất ($g_"MT" < g_"TĐ"$). Vì chu kì $T$ tỉ lệ nghịch với $sqrt(g)$, khi đưa con lắc lên Mặt Trăng, chu kì dao động của nó sẽ tăng lên. (Phát biểu SAI)
  ]
)

#vp-question(
  [Một học sinh thực hiện thí nghiệm đo cường độ dòng điện $I$ chạy qua một điện trở $R =$ #vp-qty("50", $Omega$) theo điện áp $U$ đặt vào hai đầu điện trở. Kết quả đo được ghi lại trong bảng số liệu sau:

#vp-table(cols: (1fr, 1.2fr, 1.2fr), header: ([Lần đo], [Điện áp U (V)], [Dòng điện I (A)]), [1], [2.0], [0.04], [2], [4.0], [0.08], [3], [6.0], [0.12], [...], [], [])

Từ bảng số liệu trên, tính công suất tiêu thụ của điện trở ở lần đo thứ 3 (Đơn vị: W).],
  type: "short",
  level: "TH",
  ans: "0.72",
  sol: [
    Ở lần đo thứ 3, dựa vào bảng số liệu, ta có:
- Điện áp đặt vào hai đầu điện trở: $U_3 =$ #vp-qty("6.0", "V").
- Cường độ dòng điện chạy qua điện trở: $I_3 =$ #vp-qty("0.12", "A").
Công suất tiêu thụ của điện trở ở lần đo thứ 3 là:
$P_3 = U_3 dot I_3 = 6.0 dot 0.12 =$ #vp-qty("0.72", "W").
  ]
)

#vp-question(
  [Trong thí nghiệm quang điện ngoài, người ta chiếu một bức xạ điện từ có bước sóng $lambda =$ #vp-qty("0.25", "um") vào một tấm kim loại. Biết hằng số Planck $h =$ #vp-qty("6.625e-34", "J.s"), tốc độ ánh sáng trong chân không $c =$ #vp-qty("3e8", "m/s"). Tính năng lượng của một photon bức xạ này theo đơn vị Joule (J).],
  type: "short",
  level: "VDC",
  ans: "7.95e-19",
  sol: [
    Năng lượng của một photon bức xạ được xác định bởi biểu thức:
$epsilon = (h dot c) / lambda$
Thay các giá trị số đề bài đã cho vào công thức:
$epsilon = (6.625 dot 10^(-34) dot 3 dot 10^8) / (0.25 dot 10^(-6)) = 7.95 dot 10^(-19)$ J.
Vậy năng lượng của photon là $7.95 dot 10^(-19)$ J.
  ]
)

#vp-question(
  [Một vật dao động điều hòa với phương trình $x = 5 cos(2 pi t + pi/3)$ (cm). Lấy $pi^2 = 10$. Gia tốc cực đại của vật có độ lớn là bao nhiêu?],
  type: "mcq",
  level: "NB",
  options: ([#vp-qty("20", $"cm/s"^2$)], [#vp-qty("200", $"cm/s"^2$)], [#vp-qty("0.2", $"m/s"^2$)], [#vp-qty("2", $"m/s"^2$)]),
  ans: "B",
  sol: [
    Gia tốc cực đại của vật được tính bằng công thức:
$a_"max" = omega^2 A$
Thay số ta được:
$a_"max" = (2 pi)^2 dot 5 = 4 pi^2 dot 5$
Với $pi^2 = 10$:
$a_"max" = 4 dot 10 dot 5 = 200 " cm/s"^2 = 2 " m/s"^2$.
Do đó cả hai phương án B và D đều biểu diễn cùng một độ lớn vật lý chính xác. Ta chọn phương án B.
  ]
)

#vp-question(
  [Khảo sát một con lắc đơn có chiều dài $l =$ #vp-qty("1", "m") dao động tại nơi có gia tốc trọng trường $g =$ #vp-qty("9.8", $"m/s"^2$). Cho các phát biểu sau đây:],
  type: "tf",
  level: "VD",
  statements: ([Chu kì dao động của con lắc xấp xỉ bằng #vp-qty("2.01", "s").], [Nếu tăng khối lượng quả nặng lên 2 lần thì chu kì dao động tăng lên $sqrt(2)$ lần.], [Động năng của con lắc đạt cực đại khi nó đi qua vị trí cân bằng.], [Khi chuyển con lắc từ Trái Đất lên Mặt Trăng, chu kì dao động của nó sẽ giảm đi.]),
  ans-tf: ("Đ", "S", "Đ", "S"),
  sol: [
    - Phát biểu a): Chu kì dao động của con lắc đơn được tính bằng công thức:
$T = 2 pi sqrt(l/g) = 2 pi sqrt(1 / 9.8) approx 2.01$ s. (Đúng)
- Phát biểu b): Chu kì dao động của con lắc đơn $T = 2 pi sqrt(l/g)$ không phụ thuộc vào khối lượng $m$ của quả nặng, nên khi thay đổi khối lượng thì chu kì vẫn giữ nguyên. (Sai)
- Phát biểu c): Khi đi qua vị trí cân bằng, vật đạt tốc độ cực đại, do đó động năng của con lắc đạt giá trị cực đại. (Đúng)
- Phát biểu d): Khi chuyển từ Trái Đất lên Mặt Trăng, gia tốc trọng trường $g$ giảm, do đó chu kì $T = 2 pi sqrt(l/g)$ sẽ tăng lên chứ không phải giảm đi. (Sai)
  ]
)

#vp-question(
  [Một học sinh thực hiện thí nghiệm đo cường độ dòng điện $I$ chạy qua một điện trở $R =$ #vp-qty("50", $Omega$) theo điện áp $U$ đặt vào hai đầu điện trở. Kết quả đo được ghi lại trong bảng số liệu sau:

#vp-table(cols: (1fr, 1fr, 1fr), header: ([Lần đo], [Điện áp U (V)], [Dòng điện I (A)]), [1], [2,0], [0,04], [2], [4,0], [0,08], [3], [6,0], [0,12])

Từ bảng số liệu trên, tính công suất tiêu thụ của điện trở ở lần đo thứ 3 (Đơn vị: W).],
  type: "short",
  level: "TH",
  ans: "0.72",
  sol: [
    Ở lần đo thứ 3, ta có các giá trị đo được:
- Điện áp: $U_3 = 6,0$ V
- Cường độ dòng điện: $I_3 = 0,12$ A

Công suất tiêu thụ của điện trở ở lần đo thứ 3 được tính bằng công thức:
$P_3 = U_3 dot I_3 = 6.0 dot 0.12 = 0.72$ W.
  ]
)

#vp-question(
  [Trong thí nghiệm quang điện ngoài, người ta chiếu một bức xạ điện từ có bước sóng $lambda =$ #vp-qty("0.25", "um") vào một tấm kim loại. Biết hằng số Planck $h =$ #vp-qty("6.625e-34", "J.s"), tốc độ ánh sáng trong chân không $c =$ #vp-qty("3e8", $"m/s"$). Tính năng lượng của một photon bức xạ này theo đơn vị Joule (J).],
  type: "short",
  level: "VDC",
  ans: "7.95 * 10^-19",
  sol: [
    Năng lượng của một photon bức xạ được tính theo công thức:
$epsilon = (h dot c) / lambda$

Trong đó:
- $h = 6.625 dot 10^(-34)$ J.s
- $c = 3 dot 10^8$ m/s
- $lambda = 0.25$ um $= 0.25 dot 10^(-6)$ m

Thay số vào công thức ta được:
$epsilon = (6.625 dot 10^(-34) dot 3 dot 10^8) / (0.25 dot 10^(-6)) = 7.95 dot 10^(-19)$ J.
  ]
)



#pagebreak()

// ==========================================
// CHƯƠNG 6: KẾT XUẤT ĐÁP ÁN VÀ LỜI GIẢI TỰ ĐỘNG
// ==========================================
= TỔNG HỢP KẾT QUẢ VÀO CUỐI TÀI LIỆU

Nhờ sử dụng cơ chế State `vp-sol-store` lưu trữ ngầm, bạn có thể gọi toàn bộ đáp án và lời giải đã bị ẩn ở phía trên xuống cuối sách. Bật lại công tắc để xem tính năng này hoạt động.

#vp-config(ans: true, sol: true)

#vp-css-box(bg: luma(250), border: 1pt + luma(200), radius: 4pt, [
  *💻 MÃ LỆNH:*
  #raw(lang: "typst", block: true, "
  #vp-print-keys(title: \"BẢNG ĐÁP ÁN NHANH\")
  #vp-print-solutions(title: \"HƯỚNG DẪN GIẢI CHI TIẾT\")
  ")
])
#v(0.5em)
*✨ KẾT QUẢ HIỂN THỊ:*

#vp-print-keys(title: "BẢNG ĐÁP ÁN NHANH TỪ CÁC CÂU TRÊN")
#vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT TỪ CÁC CÂU TRÊN")