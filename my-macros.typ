// =================================================================
// my-macros.typ - CÁC HÀM TÙY CHỈNH RIÊNG CHO TÀI LIỆU
// =================================================================
#import "vietphys.typ": *

// -----------------------------------------------------------------
// BẢNG MÀU TÙY CHỈNH CỦA DỰ ÁN
// -----------------------------------------------------------------
#let FlameRed = rgb("FF3B1D")
#let FireOrange = rgb("FF7A1D")
#let NiceBlue = rgb("1890FF")
#let NiceGreen = rgb("52C41A")
#let NiceViolet = rgb("722ED1")
#let Paper = rgb("F8F8F8")
#let vpgray = rgb("606060")

// -----------------------------------------------------------------
// CÁC COMPONENT GIAO DIỆN
// -----------------------------------------------------------------
// Ghi đè khoảng cách giữa các câu hỏi trên toàn bộ tài liệu (6pt là đẹp nhất)
#let vp-question = vp-question.with(
  q-margin: 6pt, // Giãn dòng 6pt
  lines: 5       // Mặc định tự luận chừa 5 dòng
)

// 1. CHƯƠNG (Viền nét đứt, nhãn Chương nổi góc trên cùng bên trái)
#let vp-chapter(num-str, title, color: NiceBlue) = {
  v(15pt)
  vp-css-box(
    align(center)[#upper(title)],
    border: (paint: color, thickness: 1pt, dash: "dashed"),
    padding: (top: 22pt, bottom: 15pt, x: 15pt),
    text-color: color,
    text-size: 22pt,
    label-top-left: (
      text: "Chương " + num-str, 
      bg: color, color: white, size: 14pt, dx: 15pt, dy: -14pt
    )
  )
  v(10pt)
}

// 2. BÀI HỌC (Bóng đổ 3D, viền trái nổi bật, Icon Cây bút)
#let vp-lesson(num-str, title, color: NiceBlue) = {
  v(12pt)
  vp-css-box(
    [BÀI #num-str: #upper(title)],
    icon: fa-pen(),
    bg: color,
    border: (left: 6pt + FireOrange),
    shadow: (dx: 3pt, dy: 3pt, color: black.lighten(20%)), 
    padding: (x: 16pt, y: 12pt),
    text-color: white,
    text-size: 16pt
  )
  v(8pt)
}

// 3. MỤC LỚN (Chia 2 cột: Icon độc lập + Chữ gạch chân kéo dài 100%)
#let vp-section(num-str, title, color: NiceBlue) = {
  let title-str = upper(title)
  let icon = fa-star()
  if "LÝ THUYẾT" in title-str {
    icon = fa-book-open()
  } else if "PHÂN LOẠI" in title-str or "PHƯƠNG PHÁP" in title-str or "DẠNG" in title-str {
    icon = fa-tasks()
  } else if "VÍ DỤ" in title-str {
    icon = fa-lightbulb()
  } else if "BÀI TẬP" in title-str {
    icon = fa-graduation-cap()
  }

  v(12pt)
  grid(
    columns: (auto, 1fr), 
    column-gutter: 10pt,
    align: (center + horizon, left + horizon),
    
    box(
      fill: color,
      radius: 4pt,
      width: 2.2em,
      height: 2.2em
    )[
      #place(center + horizon)[
        #text(fill: white, size: 1.2em)[#icon]
      ]
    ],
    
    block(
      width: 100%,
      stroke: (bottom: 1.5pt + color.lighten(30%)), 
      inset: (bottom: 8pt) 
    )[
      #text(fill: color, weight: "bold", size: 14pt)[#num-str. #upper(title)]
    ]
  )
  v(6pt)
}

// 4. MỤC NHỎ (Văn bản thuần túy)
#let vp-subsection(num-str, title, color: black) = {
  v(8pt)
  text(weight: "bold", size: 12pt, fill: color)[#num-str. #title]
  v(4pt)
}

// 5. DẠNG BÀI (Hộp màu nhạt, bo góc một bên, Icon Tasks)
#let vp-form(num-str, title, color: FlameRed) = {
  v(8pt)
  vp-css-box(
    [Dạng #num-str: #title],
    icon: fa-tasks(),
    bg: color.lighten(90%),
    border: (left: 4pt + color),
    radius: (right: 4pt),
    padding: 10pt,
    text-color: color,
    text-size: 12pt
  )
  v(4pt)
}

// 6. MỨC ĐỘ (Hộp căn giữa, viền bao quanh)
#let vp-level(num-str, title, color: FireOrange) = {
  v(10pt)
  align(center)[
    #vp-css-box(
      [MỨC #num-str: #upper(title)],
      width: auto, 
      bg: color.lighten(95%),
      border: 1.5pt + color,
      radius: 4pt,
      padding: (x: 12pt, y: 6pt),
      text-color: color,
      text-size: 12pt
    )
  ]
  v(6pt)
}

// 7. THANH CHIA PHẦN ĐỀ THI
#let vp-part(title) = {
  v(1em)
  vp-css-box(
    title,
    bg: rgb("#E6F7FF"),
    border: (left: 4pt + NiceBlue),
    radius: (right: 4pt),
    padding: (x: 12pt, y: 8pt),
    text-color: NiceBlue,
    text-size: 13pt
  )
  v(0.5em)
}

// 8. HỘP SƯ PHẠM (Ghi chú, Cảnh báo, Mẹo giải)
#let vp-box(body, title: "Ghi chú", type: "note") = {
  let cfg = (
    note: (color: NiceBlue, icon: fa-bookmark()),
    warning: (color: FlameRed, icon: fa-exclamation-triangle()),
    tip: (color: NiceGreen, icon: fa-lightbulb())
  ).at(type, default: (color: NiceBlue, icon: fa-info-circle()))
  
  v(0.5em)
  block(
    width: 100%,
    stroke: (left: 4pt + cfg.color, rest: 0.5pt + vpgray.lighten(70%)),
    fill: cfg.color.lighten(90%),
    radius: (right: 4pt),
    inset: 12pt,
    breakable: true
  )[
    #text(weight: "bold", fill: cfg.color)[#cfg.icon #h(4pt) #title]
    #v(4pt)
    #body
  ]
  v(0.5em)
}

// -----------------------------------------------------------------
// HEADER & FOOTER & LAYOUT
// -----------------------------------------------------------------

#let kage-header() = {
  vp-css-box(
    grid(
      columns: (1fr, auto),
      align: (left + horizon, right + horizon),
      text(style: "italic", fill: vpgray)[Tài liệu Vật lý 10 - Nâng cao],
      text(weight: "bold", fill: NiceBlue)[Chương I: Động học chất điểm]
    ),
    bg: none,
    border: (bottom: 1.5pt + NiceBlue), 
    padding: (bottom: 8pt, top: 0pt, x: 0pt),
    radius: 0pt
  )
}

#let kage-footer() = context {
  vp-css-box(
    grid(
      columns: (1fr, auto),
      align: (left + horizon, right + horizon),
      [
        #text(fill: FlameRed, weight: "bold")[Học Kage]
        #h(6pt) #text(fill: FlameRed)[#fa-bolt()] #h(6pt) 
        #text(fill: black, weight: "bold")[Level Up Your Knowledge]
      ],
      vp-css-box(
        text(fill: white, weight: "bold")[#counter(page).display()],
        width: auto,
        bg: FlameRed,
        radius: 4pt, 
        padding: (x: 10pt, y: 4pt)
      )
    ),
    bg: none,
    border: (top: 1pt + vpgray.lighten(40%)), 
    padding: (top: 10pt, bottom: 0pt, x: 0pt),
    radius: 0pt
  )
}

#let layout-kage-pro(body) = {
  set page(
    paper: "a4",
    margin: (top: 2.5cm, bottom: 2cm, left: 1.5cm, right: 1.5cm),
    header: kage-header(),
    footer: kage-footer(),
    footer-descent: 30%,
  )
  set text(font: "Times New Roman", size: 12pt, lang: "vi")
  set par(justify: true)
  body
}