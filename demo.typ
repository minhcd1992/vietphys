#import "my-macros.typ": *

// Bật canh đều 2 bên và khai báo ngôn ngữ tiếng Việt
#set text(lang: "vi")
#set par(justify: true)

// Gọi layout đã được cấu hình Header & Footer
#show: layout-kage-pro

// ==========================================
// CẤU HÌNH (Dùng để test hiển thị lời giải)
// ==========================================
#vp-config(ans: true, sol: true) 

// ==========================================
// BÀI HỌC MỚI
// ==========================================
#vp-lesson("3", "CHUYỂN ĐỘNG THẲNG BIẾN ĐỔI ĐỀU \n (Uniformly Accelerated Rectilinear Motion)")

// -----------------------------------------------------------------
#vp-section("1", "TÓM TẮT LÝ THUYẾT")
// -----------------------------------------------------------------

#vp-subsection("1.1", "Khái niệm Gia tốc (Acceleration)")

- *Định nghĩa:* Khi vận tốc của một vật thay đổi, ta nói vật đó có gia tốc. Gia tốc trung bình trên một khoảng thời gian $Delta t$ được định nghĩa là tỉ số giữa độ biến thiên vận tốc và khoảng thời gian đó: 
  $ a_"tb" = (Delta v)/(Delta t) = (v_2 - v_1)/(t_2 - t_1) $
- *Ý nghĩa:* Gia tốc cho biết vận tốc thay đổi nhanh hay chậm. Đơn vị của nó là $"m/s"^2$. Trong chuyển động thẳng biến đổi đều, gia tốc là một hằng số ($a = "const"$).

#vp-box(type: "warning", title: "Bẫy khái niệm (Dấu của gia tốc)")[
  Trong ngôn ngữ đời thường, "gia tốc âm" hay bị nhầm là "đi chậm lại". Trong vật lý, dấu của gia tốc phụ thuộc vào hệ quy chiếu.
  - Nếu vận tốc $v$ và gia tốc $a$ cùng dấu ($a dot.c v > 0$): Vật chuyển động *nhanh dần*.
  - Nếu vận tốc $v$ và gia tốc $a$ trái dấu ($a dot.c v < 0$): Vật chuyển động *chậm dần*.
]

#vp-subsection("1.2", "Các phương trình Động học cốt lõi")
Với chuyển động có gia tốc không đổi, ta có 4 phương trình cơ bản để giải quyết mọi bài toán. Việc chọn phương trình phụ thuộc vào việc đại lượng nào đang bị "khuyết" (không được cho và cũng không cần tìm):

- *Khuyết tọa độ/quãng đường ($x$):* $v = v_0 + a t$
- *Khuyết vận tốc cuối ($v$):* $x = x_0 + v_0 t + 1/2 a t^2$
- *Khuyết thời gian ($t$):* $v^2 - v_0^2 = 2 a(x - x_0)$ (Còn gọi là Hệ thức độc lập thời gian)
- *Khuyết gia tốc ($a$):* $x - x_0 = 1/2 (v_0 + v)t$

#vp-subsection("1.3", "Tư duy Đồ thị (Vũ khí tối thượng thay thế Vi tích phân)")

- *Đồ thị Vận tốc - Thời gian ($v-t$):* Là một đường thẳng có hệ số góc bằng gia tốc $a$. Đường hướng lên $-> a > 0$; hướng xuống $-> a < 0$. Diện tích hình phẳng giới hạn bởi đồ thị $v-t$ và trục thời gian chính là độ dịch chuyển (hoặc quãng đường).
- *Đồ thị Tọa độ - Thời gian ($x-t$):* Là một đường Parabol. Nếu $a > 0$, bề lõm hướng lên; nếu $a < 0$, bề lõm hướng xuống.
- *Đồ thị Gia tốc - Thời gian ($a-t$):* Là một đường thẳng song song với trục thời gian. Diện tích dưới đồ thị $a-t$ chính là phần vận tốc thay đổi $Delta v$.

#align(center)[
  #v(8pt)
  #image("/img/hinh3.png", width: 80%)
  #v(8pt)
]

// -----------------------------------------------------------------
#vp-section("2", "PHÂN LOẠI DẠNG BÀI & PHƯƠNG PHÁP GIẢI")
// -----------------------------------------------------------------

#vp-form("1", "Chuyển động nhiều giai đoạn (Multi-stage motion)")
- *Tư duy:* Không thể dùng 1 phương trình duy nhất cho toàn bộ quá trình. Phải chia nhỏ hiện tượng (Ví dụ: Đang chạy nhanh dần $->$ chạy đều $->$ phanh gấp).
- *Quy tắc "Cầu nối":* Vận tốc cuối của giai đoạn 1 chính là vận tốc đầu ($v_0$) của giai đoạn 2.
- *Chiến thuật đỉnh cao:* Hãy vẽ đồ thị $v-t$. Việc tính quãng đường bằng tổng diện tích các hình học cơ bản (tam giác, hình chữ nhật, hình thang) trên đồ thị $v-t$ giúp học sinh tránh được việc giải các hệ phương trình tọa độ rất dài và dễ sai dấu.

#vp-form("2", "Bài toán đuổi kịp và rượt đuổi (Chase problems)")
- *Phương pháp:*
  - *Bước 1:* Chọn cùng 1 gốc tọa độ và cùng 1 mốc thời gian $t=0$ cho cả 2 vật.
  - *Bước 2:* Viết phương trình tọa độ $x_1(t)$ và $x_2(t)$.
  - *Bước 3:* Khi gặp nhau, cho $x_1 = x_2$. Giải phương trình bậc 2 theo ẩn $t$.
- *Biện luận nghiệm:* Toán học không hiểu bản chất vật lý. Phương trình bậc 2 có thể ra 2 nghiệm $t$. Học sinh phải dùng tư duy vật lý để xét xem nghiệm nào hợp lý (loại nghiệm âm, hoặc loại thời điểm mà một vật đã dừng lại/chưa xuất phát).

#vp-form("3", "Bài toán \"Tránh va chạm\" (Cực trị Đại số)")
- *Tư duy:* Để 2 xe không đâm nhau, khoảng cách $Delta x = x_"trước" - x_"sau"$ phải luôn $> 0$. Hàm số $Delta x(t)$ thường là một hàm bậc 2 (Parabol). Thay vì dùng đạo hàm để tìm giá trị nhỏ nhất (Min), học sinh lớp 10 phải tìm tọa độ đỉnh Parabol tại $t = -b/(2a)$, từ đó suy ra điều kiện của gia tốc.

// -----------------------------------------------------------------
#vp-section("3", "VÍ DỤ MINH HỌA (Phân tích sâu)")
// -----------------------------------------------------------------

#vp-question(
  [
    *Ví dụ 1 (Dạng 1 & Tư duy đồ thị): Chuyến tàu Metro Bến Thành - Suối Tiên* \
    Một đoàn tàu Metro bắt đầu rời ga Bến Thành, tăng tốc với gia tốc $a_1 = 1.2 "m/s"^2$. Sau đó tàu chạy với vận tốc không đổi một thời gian, rồi hãm phanh với gia tốc $a_2 = -2.4 "m/s"^2$ để dừng lại vừa vặn tại ga Ba Son. Tổng thời gian di chuyển là $t = 120"s"$ và khoảng cách giữa 2 ga là $S = 2400"m"$. Tính vận tốc tối đa của đoàn tàu.
    
    #align(center)[
      #v(8pt)
      #image("/img/hinh2.png", width: 70%)
      #v(8pt)
    ]
  ],
  type: "essay",
  sol: [
    *Phân tích/Chiến thuật:* Bài này có 3 giai đoạn. Nếu lập 3 phương trình tọa độ rồi thế vào nhau, phép toán sẽ dài cả trang giấy. Chiến thuật thông minh nhất là dùng Đồ thị $v-t$. \
    
    *Giải chi tiết:* \
    Vẽ đồ thị $v-t$: Đồ thị là một hình thang. Đáy lớn là tổng thời gian $t = 120"s"$. Chiều cao của hình thang chính là vận tốc tối đa $V_"max"$ cần tìm.
    
    Gọi thời gian tăng tốc là $t_1$, thời gian đi đều là $t_2$, hãm phanh là $t_3$. Ta có: $t_1 + t_2 + t_3 = 120$ (1). \
    Từ công thức gia tốc: $t_1 = V_"max"/a_1 = V_"max"/1.2$ và $t_3 = V_"max"/|a_2| = V_"max"/2.4$.
    
    Đáy bé của hình thang (thời gian chạy đều) là: 
    $ t_2 = 120 - t_1 - t_3 = 120 - V_"max" (1/1.2 + 1/2.4) = 120 - 1.25 V_"max" $
    
    Quãng đường $S$ bằng diện tích hình thang:
    $ S &= 1/2 ("đáy lớn" + "đáy bé") times "chiều cao" \
      2400 &= 1/2 [120 + (120 - 1.25 V_"max")] times V_"max" \
      4800 &= 240 V_"max" - 1.25 V_"max"^2 $
      
    Giải phương trình bậc 2: $1.25 V_"max"^2 - 240 V_"max" + 4800 = 0$. \
    Ta được: $V_"max" approx 23.3 "m/s"$ (nghiệm còn lại rất lớn dẫn đến $t_2 < 0$ nên bị loại). \
    
    *Nhận xét:* Đồ thị biến một bài toán chuyển động phức tạp thành một bài toán tính diện tích hình học cấp 2 cực kỳ đơn giản và thanh lịch.
  ]
)

#vp-question(
  [
    *Ví dụ 2 (Dạng 2): Cuộc rượt đuổi giữa Ô tô VinFast và Xe máy Exciter* \
    _[Được tinh chỉnh từ Bài toán 2.04 - Drag Race của sách Halliday]_ \
    Trên một đoạn đường thẳng vắng, chiếc xe máy và ô tô xuất phát đua cùng lúc từ trạng thái nghỉ. Xe máy vọt lên trước nhờ gia tốc lớn $a_m = 8.40 "m/s"^2$, nhưng nó chỉ đạt đến vận tốc tối đa là $v_m = 58.8 "m/s"$ thì không tăng được nữa và duy trì vận tốc đó. Ô tô tăng tốc chậm hơn với $a_c = 5.60 "m/s"^2$ nhưng có vận tốc tối đa rất cao (ô tô vẫn liên tục tăng tốc). Hỏi sau bao lâu kể từ lúc xuất phát, ô tô sẽ đuổi kịp xe máy?
  ],
  type: "essay",
  sol: [
    *Phân tích/Chiến thuật:*
    - Xe máy có 2 giai đoạn: Nhanh dần đều $->$ Thẳng đều.
    - Ô tô có 1 giai đoạn: Nhanh dần đều xuyên suốt.
    - Cần cho $x_c = x_m$ để tìm thời điểm gặp.
    
    *Giải chi tiết:* \
    *Xét xe máy:* Thời gian để đạt max tốc độ: $t_m = v_m/a_m = 58.8/8.4 = 7.00"s"$. \
    Quãng đường xe máy đi trong 7s đầu: $x_"m1" = 1/2 a_m t_m^2 = 1/2(8.4)(7)^2 = 205.8"m"$. \
    Sau 7s, phương trình tọa độ của xe máy là: $x_m = x_"m1" + v_m (t - 7) = 205.8 + 58.8(t - 7)$.
    
    *Xét ô tô:* Phương trình tọa độ của ô tô từ đầu: $x_c = 1/2 a_c t^2 = 1/2(5.6)t^2 = 2.8 t^2$.
    
    Khi ô tô đuổi kịp xe máy: $x_c = x_m$.
    $ 2.8 t^2 &= 205.8 + 58.8t - 411.6 \
      2.8 t^2 &- 58.8t + 205.8 = 0 $
      
    Giải pt, ta được 2 nghiệm: $t = 16.6"s"$ và $t = 4.44"s"$.
    
    *Nhận xét (Sự lên tiếng của Vật lý):* Tại sao có 2 nghiệm? Có phải chúng gặp nhau 2 lần không? Không! Phương trình $x_m$ ở trên chỉ đúng sau giây thứ 7. Toán học không biết điều đó, nó coi xe máy đã chạy đều từ thời điểm âm vô cùng. Vì vậy, nghiệm $t = 4.44"s"$ (nhỏ hơn 7s) là nghiệm ngoại lai (vô lý về mặt vật lý) và bị loại. Thời điểm gặp nhau thực sự là $16.6"s"$. Học sinh giỏi cần phải luôn phản biện lại kết quả từ máy tính bấm ra.
  ]
)

// -----------------------------------------------------------------
#vp-section("4", "BÀI TẬP RÈN LUYỆN (30 BÀI)")
// -----------------------------------------------------------------
#vp-level("1", "CỦNG CỐ KỸ NĂNG VÀ LẬP PHƯƠNG TRÌNH (12 Bài)")
#vp-question(
  [(Test phản xạ nhanh): Một ô tô đang chạy với vận tốc 90 km/h thì tài xế đạp phanh. Xe dừng lại sau 5.0s. a) Tính gia tốc của xe. b) Tính quãng đường phanh.],
  type: "essay",
)
#vp-question(
  [Một máy bay Boeing 777 cần đạt vận tốc $360 "km/h"$ trên đường băng để cất cánh. Đường băng Nội Bài dài $1.80 "km"$. Gia tốc không đổi tối thiểu máy bay cần có là bao nhiêu?],
  type: "essay",
  level: "TH",
  sol: [
    Đổi vận tốc: $v = 360 "km/h" = 100 "m/s"$.
Độ dài đường băng chính là quãng đường máy bay đi được: $s = 1.80 "km" = 1800 "m"$.
Vận tốc ban đầu của máy bay: $v_0 = 0 "m/s"$.
Áp dụng công thức liên hệ giữa gia tốc, vận tốc và quãng đường:
$v^2 - v_0^2 = 2 a s => a = (v^2 - v_0^2) / (2 s) = (100^2 - 0^2) / (2 dot 1800) approx 2.78 "m/s"^2$.
Vậy gia tốc tối thiểu máy bay cần có là $2.78 "m/s"^2$.
  ]
)

#vp-question(
  [(Đồ thị a-t): Đồ thị gia tốc của một con chó săn đuổi mồi trên một đường thẳng gồm 3 giai đoạn: $Delta t_1$ gia tốc $a=2"m/s"^2$, $Delta t_2$ gia tốc $a=0$, $Delta t_3$ gia tốc $a=-1"m/s"^2$. Chỉ dùng khái niệm diện tích đồ thị, hãy tính độ biến thiên vận tốc của chó săn sau toàn bộ quá trình nếu $Delta t_1 = Delta t_3 = 4"s"$.],
  type: "essay"
)

#vp-question(
  [Một giọt nước rơi thẳng đứng (rơi tự do với $a = g = 9.8"m/s"^2$) qua một ô cửa sổ cao 1.20 m. Thời gian giọt nước đi từ mép trên xuống mép dưới cửa sổ là 0.125 s. Tính vận tốc của giọt nước ngay khi nó đi qua mép trên cửa sổ.],
  type: "essay"
)

#vp-question(
  [Một electron đi vào một máy gia tốc hạt với vận tốc ban đầu $1.50 times 10^5 "m/s"$. Nó trải qua đoạn đường $1.00 "cm"$ và đi ra với vận tốc $5.70 times 10^6 "m/s"$. Gia tốc của electron bằng bao nhiêu?],
  type: "essay"
)

#vp-question(
  [Phương trình chuyển động của một vật là $x = 10 + 50t - 2t^2$ (m, s). Hãy: a) Nhận xét về tính chất chuyển động (nhanh dần hay chậm dần) lúc $t=0$. b) Tìm thời điểm vật đổi chiều chuyển động.],
  type: "essay"
)

#vp-question(
  [Một xe gắn máy chạy với vận tốc 15 m/s thì hãm phanh. Trong 3.0s đầu sau khi phanh, vận tốc giảm còn 10 m/s. Quãng đường xe đi được từ lúc bắt đầu phanh đến khi dừng hẳn là bao nhiêu? (Giả sử gia tốc không đổi).],
  type: "essay"
)

#vp-question(
  [(Khoảng cách an toàn): Một xe đi với vận tốc 137 km/h thì tài xế thấy chốt CSGT. Gia tốc hãm phanh tối đa là $-5.2 "m/s"^2$. Cần ít nhất bao nhiêu thời gian để xe hạ tốc độ xuống giới hạn cho phép 90 km/h?],
  type: "essay"
)

#vp-question(
  [Một vật chuyển động thẳng với gia tốc không đổi. Tại $t=0$, vận tốc là $v_0$. Sau khoảng thời gian $t_1$, vận tốc là $v_1$. Chứng minh rằng vận tốc trung bình trong khoảng thời gian này là $(v_0 + v_1)/2$. Mở rộng: Điều này có đúng nếu gia tốc thay đổi không?],
  type: "essay"
)

#vp-question(
  [(Chuyển động trên dốc): Một xe đạp lên dốc với vận tốc ban đầu $18 "km/h"$, gia tốc chậm dần đều là $0.2 "m/s"^2$. Dốc dài 50m. a) Xe có lên được tới đỉnh dốc không? b) Thời gian xe đi hết dốc là bao lâu? (Lưu ý phương trình bậc 2).],
  type: "essay"
)

#vp-question(
  [Hai xe đạp xuất phát cùng lúc từ A và B cách nhau 150m, đi ngược chiều nhau. Xe từ A có $v_0 = 5 "m/s"$ và tăng tốc với $a = 0.5 "m/s"^2$. Xe từ B có $v_0 = 10 "m/s"$ và tăng tốc với $a = 1.0 "m/s"^2$. Viết phương trình và tìm vị trí chúng đâm vào nhau.],
  type: "essay"
)

#vp-question(
  [Một đoàn tàu đang chạy với vận tốc $40 "km/h"$ thì tăng tốc với gia tốc không đổi. Đi được $1 "km"$ đầu tiên, vận tốc tăng thêm $Delta v$. Đi hết $1 "km"$ thứ hai, vận tốc tăng thêm một lượng bao nhiêu so với cuối km thứ nhất? (Bẫy: Tăng cùng 1 quãng đường thì lượng $Delta v$ sẽ không bằng nhau).],
  type: "essay"
)


#pagebreak()
#vp-level("2", "PHÁT TRIỂN TƯ DUY & MÔ HÌNH HÓA THỰC TẾ (18 Bài)")

#vp-subsection("Nhóm 2.1", "Phân tích Đồ thị và Cực trị đại số")

#vp-question(
  [(Đồ thị $v-t$ cắt nhau): Đồ thị vận tốc của xe 1 là đường thẳng đi qua $(t=0, v=0)$ và $(t=4, v=20)$. Xe 2 có đồ thị là đường thẳng qua $(t=0, v=20)$ và $(t=5, v=0)$. Giả sử chúng xuất phát cùng một vị trí. Hãy dùng diện tích đồ thị tìm thời điểm khoảng cách giữa hai xe là xa nhất trước khi một xe đổi chiều.],
  type: "essay"
)

#vp-question(
  [(Đuổi bắt trên đường ray): Tàu SE1 chạy với tốc độ $v_1 = 161 "km/h"$ thì kỹ sư phát hiện tàu hàng đang chạy cùng chiều phía trước với $v_2 = 29.0 "km/h"$. Khoảng cách lúc phát hiện là $D = 676 "m"$. Kỹ sư hãm phanh với gia tốc $a$. Dùng kiến thức đỉnh Parabol, tìm giá trị độ lớn tối thiểu của $|a|$ để 2 tàu không va chạm.],
  type: "essay"
)

#vp-question(
  [(Kiểm tra chất lượng bóng tennis): Bạn thả quả bóng từ độ cao 4.00m. Nó chạm đất và nảy lên độ cao 2.00m. Thời gian bóng chạm đất (bị bóp méo và đàn hồi) là 12.0 ms. Tính gia tốc trung bình của bóng trong 12 ms đó (Chú ý dấu và chiều của vector vận tốc trước/sau va chạm).],
  type: "essay"
)

#vp-question(
  [(Trượt ngã trên băng): Một vận động viên trượt băng đang trượt với vận tốc 10m/s thì bị ngã. Do ma sát, anh ta trượt chậm dần đều. Trong giây cuối cùng trước khi dừng hẳn, anh ta trượt được 1.0m. Tính gia tốc hãm và tổng thời gian ngã.],
  type: "essay"
)

#vp-question(
  [(Bài toán Giới hạn gia tốc tàu điện): Giới hạn gia tốc cho phép của tàu điện ngầm để hành khách không bị ngã là $1.34 "m/s"^2$. Hai ga cách nhau 806m. Tìm vận tốc tối đa tàu đạt được và thời gian đi giữa 2 ga nếu nó tăng tốc rồi hãm phanh ngay lập tức với cùng giới hạn gia tốc trên. Vẽ đồ thị $v-t$.],
  type: "essay"
)

#vp-subsection("Nhóm 2.2", "Định luật tỷ lệ & Chuyển động nhiều xe (Cấp số Galileo)")

#vp-question(
  [(Định luật số lẻ Galileo): Một vật trượt nhanh dần đều không vận tốc đầu từ đỉnh máng nghiêng. Bằng đại số, chứng minh rằng quãng đường vật đi được trong những khoảng thời gian $Delta t$ bằng nhau liên tiếp sẽ tỷ lệ với các số lẻ $1:3:5:7...$],
  type: "essay"
)

#vp-question(
  [Áp dụng câu trên: Một giọt nước rơi từ mái nhà (rơi tự do). Cứ cách 0.5s bạn chụp hình 1 lần. Khoảng cách giữa vị trí giọt nước trong bức hình thứ 3 và thứ 4 là $17.15"m"$. Tìm độ cao mái nhà biết trong bức hình thứ 6 giọt nước vừa chạm đất.],
  type: "essay"
)

#vp-question(
  [(Bài toán đoàn tàu Bắc Nam qua mặt): Bạn đứng ở ga nhìn đoàn tàu bắt đầu chuyển bánh (tăng tốc). Toa thứ nhất qua mặt bạn trong $5.0"s"$. Giả sử các toa dài bằng nhau và khoảng nối không đáng kể, toa thứ $n$ sẽ qua mặt bạn trong bao lâu? (Gợi ý: Tính thời gian tổng cho $n$ toa rồi trừ đi thời gian tổng cho $(n-1)$ toa).],
  type: "essay"
)

#vp-question(
  [Kẻ trộm cướp ngân hàng lên xe tẩu thoát với gia tốc $2.0 "m/s"^2$. 5.0 giây sau, cảnh sát đuổi theo từ cùng vị trí với vận tốc ban đầu là $v_0$ và gia tốc $3.0 "m/s"^2$. Tìm điều kiện của $v_0$ để cảnh sát chắc chắn đuổi kịp tên trộm.],
  type: "essay"
)

#vp-question(
  [Có $n$ ô tô đỗ trên đường thẳng cách đều nhau một đoạn $L$. Xe 1 bắt đầu chạy với gia tốc $a$. Khi xe 1 tới ngang xe 2 thì xe 2 bắt đầu chạy với gia tốc $a$, và cứ thế hiệu ứng dây chuyền. Tìm biểu thức khoảng cách giữa xe 1 và xe $n$ khi xe $n$ vừa bắt đầu chạy.],
  type: "essay"
)

#vp-subsection("Nhóm 2.3", "Mô hình hóa thực tế (Traffic & Tech)")

#vp-question(
  [
    (Sóng kẹt xe - Shockwave): Một dòng xe chạy trên cao tốc với vận tốc 25 m/s, mỗi xe cách nhau 20m. Phía trước có rào chắn, xe đầu tiên hãm phanh khẩn cấp với gia tốc $-5 "m/s"^2$. Các xe sau có thời gian phản xạ là $0.5"s"$ rồi cũng phanh với gia tốc y hệt. Hỏi có bao nhiêu xe bị đâm dồn toa vào nhau?
    
    #align(center)[
      #v(8pt)
      #image("/img/hinh1.png", width: 70%)
      #v(8pt)
    ]
  ],
  type: "essay"
)

#vp-question(
  [(Whiplash Injury - Chấn thương cổ): Trong va chạm ô tô từ phía sau, ghế đẩy thân người về phía trước với gia tốc đồ thị $a-t$ là một tam giác (từ $t=40"ms"$ đến $100"ms"$, gia tốc tăng từ 0 lên đỉnh $50"m/s"^2$ rồi giảm về 0). Cổ chưa kịp kéo đầu đi theo. Dùng diện tích tam giác đồ thị $a-t$, tính vận tốc của thân người so với đầu ở thời điểm $100"ms"$.],
  type: "essay"
)

#vp-question(
  [(Túi khí an toàn ô tô): Trong va chạm thử nghiệm, một chiếc xe đang chạy 100 km/h thì tông vào tường bê tông. Khoảng thời gian từ lúc chạm tường đến lúc xe dừng lại hẳn là 0.15s. Tính chiều dài nắp capo bị bẹp rúm (chính là quãng đường xe dịch chuyển trong 0.15s với giả sử gia tốc hãm là không đổi). Lực $G$ người lái phải chịu gấp bao nhiêu lần gia tốc trọng trường $g$?],
  type: "essay"
)

#vp-question(
  [Tại công trường, một công nhân thả rơi một viên gạch (từ trạng thái nghỉ) xuống giếng thang máy. Sau đó 1 giây, người này bực mình ném thêm một viên gạch thứ hai thẳng xuống với vận tốc $v_0$. Hai viên gạch đập xuống đáy giếng cùng một lúc. Biểu diễn thời gian rơi của viên thứ nhất theo $v_0$ và $g$.],
  type: "essay"
)

#vp-question(
  [(Cảm biến ngắt động cơ): Trong ổ cứng laptop có cảm biến gia tốc rơi tự do. Khi máy tính bị rơi khỏi bàn (chuyển động với $a = 9.8 "m/s"^2$), cảm biến cần 0.10s để ra lệnh khóa đầu từ bảo vệ đĩa. Nếu máy tính bị rơi từ độ cao 0.8m, đầu từ có kịp khóa trước khi máy chạm đất không? Chứng minh bằng phép toán.],
  type: "essay"
)

#vp-question(
  [Một vận động viên ném lao thực hiện cú đẩy cuối cùng. Quả lao được gia tốc từ lúc vung tay ở phía sau ngang qua vai tới khi rời tay dài $1.5"m"$. Nếu quả lao rời tay với tốc độ $28"m/s"$, gia tốc trung bình bàn tay tác dụng lên lao là bao nhiêu? So sánh thời gian quả lao ở trong tay vận động viên so với thời gian nó bay trên không trung.],
  type: "essay"
)

#vp-question(
  [(Toán học đồ thị): Đồ thị vị trí theo thời gian $x(t)$ của một vật là $x = c t^2 - b t^3$. Không dùng đạo hàm, hãy dùng phép đại số để chỉ ra rằng sẽ có một thời điểm mà gia tốc của vật bằng 0 (chuyển từ nhanh dần sang chậm dần). (Gợi ý: Xem xét sự đối xứng của phần đồ thị vận tốc).],
  type: "essay"
)

#vp-question(
  [Trên một máng trượt dốc hai đoạn, đoạn đầu dài $S_1$ có gia tốc $a_1$, đoạn sau dài $S_2$ có gia tốc $a_2$. Xe trượt từ đỉnh xuống không vận tốc đầu. Viết biểu thức tính vận tốc của xe tại đáy máng. Chứng minh rằng vận tốc cuối cùng này không phụ thuộc vào việc bạn trượt qua đoạn $S_1$ hay đoạn $S_2$ trước.],
  type: "essay"
)
