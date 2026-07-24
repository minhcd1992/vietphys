// KHỐI TIÊU ĐỀ CHƯƠNG (CHAPTER)
#let vp-chapter(
  num: "1",
  title: "TÊN CHƯƠNG",
  style: "chap_hexagon", 
  color: rgb("#1E3A8A"),
  font: "Arial"
) = {
  v(15pt)
  if style == "chap_hexagon" {
    // ----------------------------------------------------
    // MẪU 1: LỤC GIÁC (DỰA TRÊN THIẾT KẾ CỦA THẦY MINH)
    // ----------------------------------------------------
    block(width: 100%, height: 70pt)[
      // 1. Đường kẻ ngang tự động kéo dài 100% bề rộng trang
      #place(top + left, dx: 100pt, dy: 35pt)[#line(length: 100%, stroke: 1.5pt + color)]
      
      // 2. Chấm tròn trang trí ở cuối (Neo bằng hệ tọa độ right)
      #place(top + right, dx: 0pt, dy: 35pt)[#circle(radius: 2pt, fill: color, stroke: none)]
      #place(top + right, dx: -10pt, dy: 35pt)[#circle(radius: 2pt, fill: color, stroke: none)]
      
      // 3. Khối đa giác Native (Không dùng SVG)
      #place(top + left, dx: 0pt, dy: 5pt)[
        #polygon(
          fill: white, stroke: 2.5pt + color,
          (25pt, 0pt), (75pt, 0pt), (100pt, 30pt), (75pt, 60pt), (25pt, 60pt), (0pt, 30pt)
        )
      ]
      
      // 4. Định vị chữ lọt lòng Lục giác
      #place(top + left, dx: 26pt, dy: 15pt)[
        #align(center)[
          #text(fill: color, font: font, size: 9pt, weight: "bold")[CHƯƠNG]\
          #text(fill: color, font: font, size: 26pt, weight: "black")[#num]
        ]
      ]
      
      // 5. Định vị Tên Chương nằm sát đường kẻ ngang
      #place(top + left, dx: 120pt, dy: 22pt)[
        #text(fill: color, font: font, size: 22pt, weight: "bold")[#upper(title)]
      ]
    ]
  } else {
    // ----------------------------------------------------
    // MẪU MẶC ĐỊNH: BO GÓC CƠ BẢN
    // ----------------------------------------------------
    align(center)[
      #block(fill: color.lighten(90%), radius: 10pt, inset: 20pt, width: 100%)[
        #text(fill: color, font: font, size: 12pt, weight: "bold")[CHƯƠNG #num] \
        #text(fill: color, font: font, size: 24pt, weight: "black")[#upper(title)]
      ]
    ]
  }
  v(15pt)
}

// KHỐI BÀI HỌC (LESSON)
#let vp-lesson(
  num: "1",
  title: "TÊN BÀI HỌC",
  style: "less_ribbon",
  color: rgb("#FF7A1D"),
  font: "Arial"
) = {
  v(10pt)
  block(width: 100%, stroke: (left: 6pt + color), inset: (left: 10pt))[
    #text(fill: color, font: font, size: 16pt, weight: "bold")[BÀI #num: #upper(title)]
  ]
  v(5pt)
}

// KHỐI MỤC LỚN (SECTION)
#let vp-section(
  num: "I",
  title: "TIÊU ĐỀ MỤC",
  style: "sec_underline",
  color: rgb("#1890FF"),
  font: "Arial"
) = {
  v(10pt)
  block(width: 100%, stroke: (bottom: 1.5pt + color), inset: (bottom: 5pt))[
    #text(fill: color, font: font, size: 14pt, weight: "bold")[#num. #upper(title)]
  ]
  v(5pt)
}