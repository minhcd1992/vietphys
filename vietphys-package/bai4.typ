#import "my-macros.typ": *
#set text(lang: "vi")
#set par(justify: true)
#show: layout-kage-pro
#vp-config(ans: true, sol: true) 

// ==========================================
// BÀI HỌC MỚI
// ==========================================
#vp-lesson("4", "SỰ RƠI TỰ DO (FREE-FALL ACCELERATION)")

// -----------------------------------------------------------------
#vp-section("1", "TÓM TẮT LÝ THUYẾT")
// -----------------------------------------------------------------

#vp-subsection("1.1", "Bản chất của sự rơi tự do")
- *Định nghĩa:* Sự rơi tự do là sự rơi của một vật chỉ dưới tác dụng của trọng lực. Nếu ta có thể loại bỏ hoàn toàn sức cản của không khí, mọi vật (dù là một quả tạ sắt hay một cái lông chim) đều rơi với cùng một gia tốc không đổi hướng thẳng đứng xuống dưới.
- *Gia tốc rơi tự do* ($g$): Gia tốc này thay đổi nhẹ tùy theo vĩ độ và độ cao, nhưng ở gần mặt đất, ta thường lấy giá trị trung bình $g approx 9.8 "m/s"^2$ hoặc $g = 10 "m/s"^2$ để tính toán.
- Bản chất sự rơi tự do chính là chuyển động thẳng nhanh dần đều không vận tốc đầu ($v_0 = 0$).

#align(center)[
  #v(8pt)
  #vp-image("hinh1.png", width: 70%)
  #v(8pt)
]

#vp-subsection("1.2", "Các phương trình Động học (Vũ khí đại số)")
Vì đây là chuyển động thẳng biến đổi đều, ta dùng lại toàn bộ 4 phương trình ở Bài 3 nhưng chuyển sang trục tung ($O y$).

- *Trường hợp 1: Thả vật rơi tự do từ trên cao xuống.* Thường chọn gốc tọa độ $O$ tại vị trí thả, chiều dương hướng xuống dưới. Khi đó gia tốc $a = g > 0$, vận tốc đầu $v_0 = 0$.
  - Vận tốc tức thời: $v = g t$
  - Quãng đường (Độ cao đã rơi): $s = 1/2 g t^2$
  - Hệ thức độc lập: $v^2 = 2 g s$

- *Trường hợp 2: Bài toán ném thẳng đứng (Lên hoặc Xuống).* Thường chọn chiều dương hướng lên trên. Khi đó gia tốc trọng trường luôn hướng xuống nên $a = -g$.
  - Vận tốc tức thời: $v = v_0 - g t$
  - Phương trình tọa độ: $y = y_0 + v_0 t - 1/2 g t^2$
  - Hệ thức độc lập: $v^2 - v_0^2 = -2 g(y - y_0)$

#vp-subsection("1.3", "Các \"Bẫy\" Khái Niệm Cần Tránh")

#vp-box(type: "warning", title: "Bẫy số 1 (Gia tốc tại đỉnh)")[
  Khi ném một vật thẳng đứng lên cao, tại độ cao cực đại, vận tốc của vật bằng 0 ($v = 0$) nhưng gia tốc của nó vẫn là $-g$ (không phải bằng 0). Nếu gia tốc bằng 0 tại đỉnh, vật sẽ lơ lửng trên đó mãi mãi!
]

#vp-box(type: "warning", title: "Bẫy số 2 (Rơi từ vật đang chuyển động)")[
  Khi một gói hàng bị rớt ra từ một khinh khí cầu đang bay lên, vận tốc ban đầu của gói hàng so với mặt đất không bằng 0, mà nó bằng chính vận tốc của khinh khí cầu lúc đó. Gói hàng sẽ bay lên thêm một đoạn rồi mới rơi xuống.
]

// -----------------------------------------------------------------
#vp-section("2", "PHÂN LOẠI DẠNG BÀI & PHƯƠNG PHÁP GIẢI")
// -----------------------------------------------------------------

#vp-form("1", "Bài toán \"Đóng băng thời gian\" (Quãng đường trong giây thứ n)")
- *Tư duy:* Học sinh thường nhầm lẫn giữa "quãng đường đi trong $n$ giây" và "quãng đường đi trong giây thứ $n$".
- *Phương pháp:* Quãng đường rơi trong giây thứ $n$ = (Quãng đường rơi trong $n$ giây) $-$ (Quãng đường rơi trong $n-1$ giây). Phương pháp này luyện kỹ năng khai triển hằng đẳng thức rất tốt.

#vp-form("2", "Bài toán hai vật gặp nhau trong không trung")
- *Tư duy:* Đây là lúc kỹ năng chọn mốc thời gian chung phát huy tác dụng.
- *Phương pháp:* Chọn mốc thời gian $t = 0$ là lúc vật thứ nhất bắt đầu rơi. Vật thứ hai rơi sau vật thứ nhất $Delta t$ giây thì thời gian rơi của vật hai là $(t - Delta t)$. Viết phương trình tọa độ $y_1$, $y_2$ và cho $y_1 = y_2$ để tìm thời điểm gặp nhau.

#vp-form("3", "Chuyển động tương đối trong sự rơi (Thang máy, Trực thăng)")
- *Tư duy:* Đây là dạng bài cực khó nếu không nắm vững tính tương đối. Khi đứng trong thang máy đang đi lên nhanh dần đều với gia tốc $a$, nếu bạn thả một vật, vật đó chịu tác dụng của trọng lực $g$ (so với đất).
- *Phương pháp giải nhanh:* Hãy gắn hệ quy chiếu vào chính cái thang máy đó! Trong hệ quy chiếu thang máy, vật sẽ rơi với một "gia tốc biểu kiến" là $g_"bk" = g + a$ (nếu thang máy đi lên) hoặc $g_"bk" = g - a$ (nếu thang đi xuống). Sau đó dùng công thức $s = 1/2 g_"bk" t^2$.

// -----------------------------------------------------------------
#vp-section("3", "VÍ DỤ MINH HỌA (Phân tích sâu)")
// -----------------------------------------------------------------

#vp-question(
  [
    *Ví dụ 1 (Dạng 1): Bí ẩn của giọt nước trên mái nhà* \
    Một giọt nước rơi tự do từ mái nhà (không vận tốc đầu). Trong $1.0 "s"$ cuối cùng trước khi chạm đất, nó rơi được một nửa tổng độ cao của mái nhà. Lấy $g = 9.8 "m/s"^2$. Bằng phép tính đại số, hãy tính tổng thời gian rơi và độ cao của mái nhà.
  ],
  type: "essay",
  sol: [
    *Phân tích/Chiến thuật:* Bài toán khuyết quá nhiều dữ kiện, chỉ cho biết thời gian chặng cuối. Ta sẽ gọi tổng thời gian rơi là $t$. Vậy thời gian rơi nửa quãng đường đầu sẽ là $(t - 1.0)$. Áp dụng công thức $h = 1/2 g t^2$ cho 2 mốc thời gian này rồi lập tỷ lệ.
    
    *Giải chi tiết:* \
    Gọi $h$ là tổng độ cao, $t$ là tổng thời gian. Ta có: $h = 1/2 g t^2$ (1) \
    Nửa quãng đường đầu ($0.5 h$) được rơi trong thời gian $(t - 1.0)$ giây. Ta có: $0.5 h = 1/2 g(t - 1.0)^2$ (2) \
    Lấy (1) chia (2), ta triệt tiêu được $h$ và $g$: 
    $ t^2 / (t - 1.0)^2 = 2 => t / (t - 1.0) = sqrt(2) $
    Giải phương trình bậc 1: 
    $ sqrt(2)(t - 1.0) = t => t(sqrt(2) - 1) = sqrt(2) => t approx 3.41 "s". $
    Thay $t = 3.41 "s"$ vào (1): $h = 1/2 (9.8) (3.41)^2 approx 57.0 "m"$.
    
    *Nhận xét:* Bài toán cho thấy sức mạnh của việc lập tỷ lệ. Nếu học sinh cố gắng giải hệ phương trình bậc 2 thông thường bằng cách khai triển $(t - 1)^2$, bài toán sẽ dài hơn rất nhiều. Việc căn bậc hai hai vế (vì $t > 0$) giúp giảm bậc phương trình.
  ]
)

#vp-question(
  [
    *Ví dụ 2 (Dạng 3): Màn "ảo thuật" trên khinh khí cầu* \
    Một khinh khí cầu đang bay lên thẳng đứng với tốc độ không đổi $12 "m/s"$. Khi khinh khí cầu ở độ cao $80 "m"$ so với mặt đất, một kiện hàng vô tình bị văng ra ngoài. Lấy $g = 9.8 "m/s"^2$. \
    a) Kiện hàng có rơi xuống đất ngay lập tức không? Giải thích. \
    b) Tính thời gian từ lúc kiện hàng văng ra đến khi chạm đất.

    #align(center)[
      #v(8pt)
      #vp-image("hinh1.png", width: 70%)
      #v(8pt)
    ]
  ],
  type: "essay",
  sol: [
    *Phân tích/Chiến thuật:* Học sinh cực kỳ dễ sai ở đây khi cho rằng $v_0 = 0$. Theo nguyên lý quán tính, kiện hàng tách ra từ khinh khí cầu nên nó mang luôn vận tốc của khinh khí cầu lúc đó ($12 "m/s"$ hướng lên). Đây thực chất là bài toán NÉM LÊN từ độ cao $80 "m"$.
    
    *Giải chi tiết:* \
    a) Kiện hàng không rơi xuống ngay. Nó bị "ném" lên trên với $v_0 = +12 "m/s"$. Do tác dụng của trọng lực, nó sẽ bay chậm dần lên thêm một đoạn, đạt đỉnh, rồi mới rơi tự do xuống đất. \
    b) Chọn gốc tọa độ $O$ tại mặt đất, chiều dương hướng lên trên. Tọa độ ban đầu: $y_0 = 80 "m"$. Vận tốc đầu: $v_0 = 12 "m/s"$. Gia tốc: $a = -g = -9.8 "m/s"^2$. \
    Phương trình tọa độ của kiện hàng: $y = 80 + 12 t - 4.9 t^2$. \
    Khi kiện hàng chạm đất: $y = 0 => -4.9 t^2 + 12 t + 80 = 0$. \
    Dùng công thức nghiệm giải phương trình bậc 2, ta được 2 nghiệm: $t = 5.46 "s"$ và $t = -3.01 "s"$. Loại nghiệm âm. Vậy thời gian rơi là $t = 5.46 "s"$.
    
    *Nhận xét:* Nghiệm âm $t = -3.01 "s"$ mang ý nghĩa gì? Toán học coi như kiện hàng đã được ném từ mặt đất từ trước đó $3.01 "s"$ để bay lên tới độ cao $80 "m"$ với vận tốc $12 "m/s"$. Nhưng vật lý chỉ bắt đầu khảo sát từ lúc $t = 0$, nên ta loại nghiệm âm này.
  ]
)

// -----------------------------------------------------------------
#vp-section("4", "BÀI TẬP RÈN LUYỆN (25 BÀI)")
// -----------------------------------------------------------------

#vp-level("1", "Củng cố kỹ năng và Tránh bẫy khái niệm (12 Bài)")

#vp-question(
  [(Test cơ bản): Tại công trường xây dựng, một công nhân vô tình làm rơi chiếc cờ lê từ độ cao $45 "m"$ xuống đất. Lấy $g = 9.8 "m/s"^2$. a) Cờ lê rơi trong bao lâu? b) Tốc độ của cờ lê ngay trước khi chạm đất là bao nhiêu?],
  type: "essay"
)

#vp-question(
  [Trong môn bóng chuyền, một cầu thủ thực hiện cú phát bóng nhảy (jump serve) và đánh bóng ở độ cao $3.0 "m"$ theo phương ngang. Nếu không có lực cản, hãy tính thời gian quả bóng ở trong không trung cho đến khi chạm sàn. Lấy $g = 9.8 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [Từ độ cao $h = 20 "m"$, một vật được ném thẳng đứng hướng xuống với vận tốc ban đầu $v_0$. Nó chạm đất sớm hơn $1 "s"$ so với một vật rơi tự do thả từ cùng độ cao. Tính $v_0$. Lấy $g = 10 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [(Định luật tỷ lệ Galileo): Một quả táo rơi tự do từ đỉnh một tòa nhà cao tầng. Chứng minh rằng độ dài quãng đường nó rơi được trong các giây liên tiếp (giây 1, giây 2, giây 3...) tuân theo tỷ lệ của các số lẻ liên tiếp: $1:3:5:7...$],
  type: "essay"
)

#vp-question(
  [Dựa vào kết quả bài 4: Nếu trong giây thứ 3 quả táo rơi được $25 "m"$, hãy tính độ cao tòa nhà biết quả táo chạm đất đúng ở giây thứ 6. (Lấy $g = 10 "m/s"^2$).],
  type: "essay"
)

#vp-question(
  [Một quả bóng chày được ném thẳng đứng lên cao với tốc độ $25.0 "m/s"$. a) Độ cao cực đại nó đạt được là bao nhiêu? b) Sau bao lâu nó trở lại tay người ném?],
  type: "essay"
)

#vp-question(
  [Bạn ném một quả cà chua thẳng đứng lên cao. Trong thời gian đi lên (ascent), độ dời của nó mang dấu gì? Gia tốc của nó mang dấu gì (chọn chiều dương hướng lên)? Tại điểm cao nhất, vận tốc và gia tốc của quả cà chua là bao nhiêu?],
  type: "essay"
)

#vp-question(
  [Hai hòn đá được ném thẳng đứng từ mép một vách đá: hòn thứ nhất ném lên với $v_0 = 12 "m/s"$, hòn thứ hai ném xuống với $v_0 = 12 "m/s"$. Bằng lập luận vật lý (không cần giải phương trình phức tạp), hãy so sánh tốc độ của hai hòn đá ngay trước khi chúng đập xuống mặt nước bên dưới.],
  type: "essay"
)

#vp-question(
  [Một khinh khí cầu đang bay lên với tốc độ $12 "m/s"$. Ở độ cao $80 "m"$, một túi cát được thả ra. Tính tốc độ của túi cát khi nó vừa chạm đất. Lấy $g = 9.8 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [Một tên lửa mô hình được phóng thẳng đứng. Vận tốc của nó biến thiên theo phương trình $v = 40 - 10 t$ ($"m/s"$). a) Tên lửa bay lên hay rơi xuống ở thời điểm $t = 2 "s"$ và $t = 5 "s"$? b) Tìm độ cao cực đại của tên lửa (Biết $t = 0$ xuất phát từ mặt đất).],
  type: "essay"
)

#vp-question(
  [Một thiết bị thử nghiệm thả rơi trong tháp chân không từ độ cao $145 "m"$. Thời gian rơi là bao nhiêu? Nếu đáy tháp có thiết bị hãm phanh với gia tốc giảm tốc khổng lồ là $25 g$ (với $g = 9.8 "m/s"^2$), tính quãng đường thiết bị bị nén lại trong quá trình hãm.],
  type: "essay"
)

#vp-question(
  [Để kiểm tra chất lượng một quả bóng tennis, người ta thả nó rơi tự do từ độ cao $4.0 "m"$ xuống sàn cứng. Nó nảy lên tới độ cao $2.0 "m"$. Thời gian bóng tiếp xúc với sàn (bị bóp méo rồi bung ra) là $12.0 "ms"$. Tính gia tốc trung bình của quả bóng trong khoảng thời gian va chạm đó (Chú ý xét chiều của vector vận tốc).],
  type: "essay"
)

#pagebreak()
#vp-level("2", "Phát triển tư duy và Bối cảnh phức tạp (13 Bài)")

#vp-subsection("Nhóm 2.1", "Bài toán Giọt nước rò rỉ (Chuỗi vật rơi)")

#vp-question(
  [(Hiệu ứng ảo giác khoảng cách): Nước nhỏ giọt từ một vòi sen cách mặt sàn $200 "cm"$. Các giọt nước rơi cách nhau những khoảng thời gian đều đặn. Giọt thứ nhất vừa chạm sàn thì giọt thứ tư bắt đầu rơi khỏi vòi. Tại thời điểm đó, hãy tính khoảng cách từ vòi đến giọt thứ hai và giọt thứ ba.],
  type: "essay"
)

#vp-question(
  [Vẫn hệ thống vòi nước rơi như Bài 13. Khi thời gian trôi đi, khoảng cách không gian giữa hai giọt nước liên tiếp (VD: giọt 1 và giọt 2) sẽ tăng lên hay giảm đi hay giữ nguyên trong quá trình chúng cùng đang rơi trên không trung? Hãy chứng minh bằng toán học đại số.],
  type: "essay"
)

#vp-subsection("Nhóm 2.2", "Rượt đuổi và Gặp nhau trong không trung")

#vp-question(
  [(Người Nhện hành động): Từ đỉnh một tòa nhà cao $60 "m"$, một tên trộm nhảy xuống (rơi tự do). Đúng $1.2 "s"$ sau, Người Nhện phóng tơ thẳng đứng xuống dưới với tốc độ $v_0$ để đuổi theo. Tính $v_0$ nhỏ nhất để Người Nhện kịp vồ lấy tên trộm ngay trước khi hắn chạm đất. Lấy $g = 9.8 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [Hai viên kim cương bị tuột khỏi tay một tên trộm đang leo vách núi. Viên thứ nhất rơi, và đúng $1.0 "s"$ sau viên thứ hai rơi theo (đều rơi tự do từ trạng thái nghỉ). Sau bao lâu kể từ lúc viên thứ nhất rơi, khoảng cách giữa 2 viên kim cương là $10 "m"$? Lấy $g = 9.8 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [Từ mặt đất, tung một quả bóng chày thẳng đứng lên cao với tốc độ $v_0 = 15 "m/s"$. Cùng lúc đó, từ độ cao $10 "m"$ ngay phía trên, một quả bóng tennis được thả rơi tự do. Hai quả bóng sẽ đập vào nhau ở độ cao bao nhiêu so với mặt đất? Lấy $g = 9.8 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [Một quả cầu thép được thả rơi từ nóc một tòa nhà. Nó đi qua một ô cửa sổ cao $1.20 "m"$ trong đúng $0.125 "s"$. Quả cầu chạm đất, nảy lên đúng bằng độ cao cũ và lại đi ngang qua ô cửa sổ đó (từ dưới lên) cũng trong $0.125 "s"$. Thời gian quả cầu khuất tầm nhìn (nằm hoàn toàn bên dưới cửa sổ) là $2.00 "s"$. Tòa nhà cao bao nhiêu? (Gợi ý: Tìm vận tốc quả cầu ở mép dưới cửa sổ).],
  type: "essay"
)

#vp-subsection("Nhóm 2.3", "Hệ quy chiếu chuyển động (Toán Thang máy)")

#vp-question(
  [(Mắc kẹt trong thang máy): Một thang máy không có trần đang đi lên đều với tốc độ $10 "m/s"$. Một cậu bé đứng trong thang máy ném một quả bóng thẳng đứng lên trên. Tốc độ ban đầu của quả bóng so với cậu bé là $20 "m/s"$. Lúc ném, sàn thang máy đang cách mặt đất $28 "m"$. \
  a) Độ cao cực đại quả bóng đạt tới so với mặt đất là bao nhiêu? \
  b) Sau bao lâu quả bóng rơi trở lại sàn thang máy? (Giải bằng 2 cách: dùng HQC mặt đất và dùng HQC gắn với thang máy).],
  type: "essay"
)

#vp-question(
  [Một thang máy đang đi lên nhanh dần đều với gia tốc $a = 2 "m/s"^2$. Từ trần thang máy cách sàn $h = 2.47 "m"$, một chiếc bù-loong bị tuột và rơi xuống. Lấy $g = 9.8 "m/s"^2$. Không dùng vi tích phân, hãy sử dụng hệ quy chiếu gắn với thang máy để tính thời gian bù-loong chạm sàn thang máy.],
  type: "essay"
)

#vp-subsection("Nhóm 2.4", "Phân tích thực tiễn & Cực trị")

#vp-question(
  [(Hang time trong bóng rổ): "Lưu lại trên không" (Hang time) là một ảo giác vật lý mà các vận động viên bóng rổ chuyên nghiệp tạo ra. Cảm giác như họ dừng lại ở đỉnh cú nhảy lâu hơn bình thường. Giả sử Michael Jordan thực hiện cú bật nhảy thẳng đứng với tốc độ đầu $v_0 = 7.00 "m/s"$. Hãy tính tỷ lệ % thời gian anh ta ở trong nửa trên của quỹ đạo cú nhảy (từ độ cao $0.5 H_"max"$ lên $H_"max"$ rồi rơi về $0.5 H_"max"$) so với tổng thời gian nhảy. Kết quả sẽ giải thích hiện tượng ảo giác này.],
  type: "essay"
)

#vp-question(
  [(Thiết kế game Flappy Bird): Lập trình viên thiết kế trò chơi quy định: chim Flappy rơi tự do với gia tốc $g$. Mỗi khi người chơi chạm màn hình, chim lập tức có một vận tốc hướng lên là $v_0$. Để chim đi qua một khe hẹp nằm ngang (độ cao không đổi), người chơi phải chạm màn hình đều đặn. Tính chu kỳ (khoảng thời gian giữa 2 lần chạm) theo $v_0$ và $g$.],
  type: "essay"
)

#vp-question(
  [Một tên lính pháo binh bắn một viên đạn thẳng đứng lên trời với tốc độ $v_0 = 30 "m/s"$. Ngay sau khi bắn, một chiếc trực thăng tàng hình đang bay ngang với tốc độ cao đi ngang qua ngay trên đầu khẩu pháo. Viên đạn cắm vào trực thăng. Khám nghiệm cho thấy lúc cắm vào, vận tốc thẳng đứng của viên đạn chỉ còn đúng bằng một nửa vận tốc ban đầu của nó. Trực thăng đang bay ở độ cao bao nhiêu? Có mấy đáp án cho độ cao này? Lấy $g = 10 "m/s"^2$.],
  type: "essay"
)

#vp-question(
  [Một phi hành gia hạ cánh xuống hành tinh X. Để đo trọng trường, anh ta tung một viên đá lên cao $2.0 "m"$ so với tay. Máy đo stroboscopic chụp lại vị trí viên đá cứ mỗi $0.5 "s"$. Nếu có một bức ảnh chụp đúng lúc viên đá đạt đỉnh cao nhất, và bức ảnh trước đó $0.5 "s"$ thấy viên đá cách đỉnh một khoảng $0.75 "m"$. Tìm gia tốc rơi tự do trên hành tinh này.],
  type: "essay"
)

#vp-question(
  [(Toán học đồ thị): Đồ thị vận tốc $v-t$ của một quả bóng rơi tự do từ độ cao $h$ xuống mặt đất đàn hồi (bóng nảy lên liên tục không mất năng lượng) sẽ có dạng hình gì? (Gợi ý: Mô tả bằng lời sự thay đổi của đồ thị qua mỗi lần chạm đất).],
  type: "essay"
)