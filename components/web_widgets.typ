// 1. NATIVE SHAPE DIVIDERS (Thuật toán Lượng giác - Tương thích MỌI phiên bản)
#let vp-shape-divider(type: "wave", color: rgb("#1890FF"), position: "top", height: 35pt) = {
  let content = none
  
  if type == "wave" {
    // Tạo sóng bằng hàm sin() thay vì Bezier để vượt qua giới hạn phiên bản Typst
    let pts = ( (0%, 0%), )
    let wave-pts = range(0, 101, step: 2).map(i => {
      let x = i * 1%
      let angle = i * 10.8deg // Tính toán 3 chu kỳ sóng mượt mà
      let y = 60% + 40% * calc.sin(angle)
      (x, y)
    })
    pts = pts + wave-pts + ( (100%, 0%), )
    content = polygon(fill: color, ..pts)
    
  } else if type == "arrow" {
    content = polygon(
      fill: color,
      (0%, 0%), (50%, 100%), (100%, 0%)
    )
  } else if type == "tilt" {
    content = polygon(
      fill: color,
      (0%, 0%), (100%, 100%), (100%, 0%)
    )
  }
  
  set block(spacing: 0pt)
  box(width: 100%, height: height, clip: true)[
    #if position == "bottom" {
      rotate(180deg, reflow: true)[#content]
    } else {
      content
    }
  ]
}

// ==========================================
// THÊM TIẾP CÁC MODULE UI (NẾU CHƯA THÊM)
// ==========================================

// 2. THE BLURB (Hộp Thông tin Trực quan)
#let vp-blurb(icon: none, title: "", body, color: rgb("#1890FF")) = {
  block(width: 100%, fill: color.lighten(92%), stroke: 1pt + color.lighten(70%), radius: 8pt, inset: 16pt)[
    #grid(columns: (auto, 1fr), gutter: 15pt,
      align(top)[#text(fill: color, size: 24pt)[#icon]],
      [
        #text(fill: color.darken(20%), size: 14pt, weight: "bold")[#title]
        #v(6pt)
        // Đã xóa thuộc tính leading gây lỗi
        #text(fill: luma(60), size: 11pt)[#body]
      ]
    )
  ]
}

// 3. TESTIMONIAL (Trích dẫn / Khẩu quyết)
#let vp-testimonial(author: "", role: "", body, color: rgb("#1890FF")) = {
  block(width: 100%, inset: (left: 20pt, top: 16pt, bottom: 16pt, right: 16pt), stroke: (left: 4pt + color), fill: luma(250))[
    #text(size: 13pt, style: "italic", fill: luma(80))[“#body”]
    #v(12pt)
    #text(weight: "bold", size: 12pt, fill: color.darken(20%))[#author] \
    #text(size: 10pt, fill: luma(120))[#role]
  ]
}

// 4. CALL TO ACTION (Kêu gọi hành động)
#let vp-cta(title: "", body: "", button-text: "", color: rgb("#1890FF")) = {
  block(width: 100%, radius: 8pt, fill: color, inset: 24pt)[
    #grid(columns: (1fr, auto), gutter: 20pt, align: horizon,
      [
        #text(size: 18pt, weight: "bold", fill: white)[#title]
        #v(8pt)
        #text(size: 12pt, fill: white.darken(10%))[#body]
      ],
      if button-text != "" [
        #box(fill: white, radius: 20pt, inset: (x: 20pt, y: 12pt))[
          #text(fill: color, weight: "bold")[#button-text]
        ]
      ] else []
    )
  ]
}