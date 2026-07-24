#import "/vietphys-package/vietphys.typ": *

// 1. HEADER DẠNG BANNER PHÁ CÁCH CÓ SHAPE DIVIDER
#set page(margin: (top: 0cm, left: 1.5cm, right: 1.5cm, bottom: 2cm))

#block(width: 100%, fill: vp-colors.primary, inset: (top: 3cm, bottom: 1cm, left: 2cm, right: 2cm))[
  #text(fill: white, size: 24pt, weight: "bold")[CHƯƠNG 1: DAO ĐỘNG CƠ] \
  #v(8pt)
  #text(fill: white.darken(10%), size: 12pt)[Khám phá quy luật chuyển động lặp lại của vạn vật trong vũ trụ.]
]
// Gắn Shape Divider "Wave" hướng xuống dưới để nối liền với Banner
#vp-shape-divider(type: "wave", color: vp-colors.primary, position: "top", height: 40pt)

#v(1cm)

// 2. DÙNG BLURB LÀM MỤC TIÊU BÀI HỌC
#grid(columns: (1fr, 1fr), gutter: 15pt,
  vp-blurb(icon: "🎯", title: "Mục tiêu Kỹ năng", color: rgb("#52C41A"))[
    Thành thạo vòng tròn lượng giác, giải nhanh các bài toán thời gian, quãng đường.
  ],
  vp-blurb(icon: "⚠️", title: "Bẫy Thường Gặp", color: rgb("#FAAD14"))[
    Chú ý đổi đơn vị pha ban đầu về radian, phân biệt rõ vận tốc và tốc độ.
  ]
)

#v(1cm)

// 3. DÙNG TESTIMONIAL LÀM TRÍCH DẪN ĐẦU CHƯƠNG
#vp-testimonial(
  author: "Galileo Galilei", 
  role: "Nhà thiên văn học, vật lý học người Ý", 
  color: rgb("#722ED1")
)[
  Tự nhiên được viết bằng ngôn ngữ của toán học, và những ký tự của nó là các hình tam giác, hình tròn và các hình hình học khác. Dao động của một con lắc chính là nhịp đập của vũ trụ.
]

#v(1cm)

// 4. DÙNG CTA LÀM NÚT KÊU GỌI
#vp-cta(
  title: "Sẵn sàng chinh phục chuyên đề này chưa?", 
  body: "Hãy lấy giấy nháp, máy tính Casio và bắt đầu với các câu hỏi khởi động bên dưới.",
  button-text: "BẮT ĐẦU NGAY",
  color: rgb("#FF4D4F")
)

#v(1cm)

// 5. CHÈN THỬ SHAPE DIVIDER MŨI TÊN CHỈ XUỐNG BÀI TẬP
#vp-shape-divider(type: "arrow", color: luma(240), position: "bottom", height: 30pt)
#block(width: 100%, fill: luma(240), inset: 20pt)[
  #text(weight: "bold", size: 16pt)[PHẦN A. CÂU HỎI KHỞI ĐỘNG]
]