// Import màu sắc từ thư mục themes
#import "../themes/colors.typ": *

#let vp-heading(title, level: 1, color: vp-colors.primary) = {
  if level == 1 {
    v(1em)
    text(size: 14pt, weight: "bold", fill: color, title)
    v(-0.5em)
    line(length: 100%, stroke: 1.5pt + color)
    v(1em)
  } else if level == 2 {
    v(0.8em)
    text(size: 13pt, weight: "bold", fill: color, title)
    v(0.5em)
  } else {
    // Fallback an toàn cho level 3 trở lên
    block(text(size: 14pt, weight: "bold", fill: black)[#title])
  }
}

// =================================================================
// [ MODULE 2.5: BẢNG SỐ LIỆU THÔNG MINH ]
// =================================================================
#let vp-table(
  cols: auto,
  header: (),
  align: center + horizon,
  theme-color: rgb("#1890FF"), // Mặc định dùng vp-colors.primary
  ..cells
) = {
  table(
    columns: cols,
    align: align,
    stroke: 0.5pt + theme-color.lighten(50%),
    fill: (x, y) => {
      if y == 0 { theme-color } // Hàng đầu tiên tô màu đậm
      else if calc.even(y) { theme-color.lighten(90%) } // Các hàng chẵn tô nền nhạt xen kẽ
      else { none }
    },
    // Tự động in đậm và tô màu trắng cho chữ ở hàng tiêu đề
    ..header.map(h => text(fill: white, weight: "bold")[#h]),
    
    // Đổ toàn bộ dữ liệu vào các ô còn lại
    ..cells
  )
}