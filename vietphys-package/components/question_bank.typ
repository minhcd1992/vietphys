// =================================================================
// TÊN GÓI: ENGINE CÂU HỎI VÀ LỜI GIẢI (Core Logic)
// =================================================================

// CẤP VŨ KHÍ (IMPORT) CHO ENGINE HOẠT ĐỘNG
#import "../themes/colors.typ": *
#import "../themes/settings.typ": *
#import "../legacy/state.typ": *
#import "../legacy/utils.typ": *
#import "../components/containers.typ": *
#import "../components/typography.typ": *

#let _typst-type = type
#let _render-dotlines(lines-count) = {
  if lines-count > 0 {
    v(8pt)
    for i in range(lines-count) {
      line(length: 100%, stroke: (paint: luma(120), thickness: 0.8pt, dash: "dotted"))
      v(1.2em)
    }
  }
}
#let _render-short-boxes(border-color, bg-color, ans-str, show-ans, ans-color) = {
  v(8pt)
  let chars = ()
  if show-ans and ans-str != none { chars = str(ans-str).clusters() }
  while chars.len() < 4 { chars.push("") }
  chars = chars.slice(0, 4)
  align(right)[
    #stack(dir: ltr, spacing: 6pt,
      ..chars.map(c => box(
        width: 1.8em, height: 1.8em,
        stroke: 1.2pt + if c != "" { ans-color } else { border-color },
        fill: if c != "" { bg-color } else { bg-color },
        radius: 2pt,
        align(center + horizon)[#text(fill: ans-color, weight: "bold", size: 14pt)[#c]]
      ))
    )
  ]
}
#let bg-color-or(c) = if _typst-type(c) == color { c.lighten(85%) } else { rgb("#FFF1F0") }
#let _render-tf(statements, style, header-bg, header-color, border-color, row-bg, ans-tf, show-ans, correct-color, wrong-color, box-bg, box-border, box-width) = {
  if statements.len() > 0 {
    v(8pt)
    
    // TÍNH TOÁN MÀU SẮC TỪ THEME TRUYỀN VÀO
    let fill-val = if box-bg == auto { none } else { box-bg }
    let stroke-color = if box-border == auto { luma(150) } else { box-border }
    let stroke-size = if box-width == auto { 0.8pt } else { box-width }
    
    // TẠO Ô VUÔNG LINH HOẠT
    let empty-box = box(width: 12pt, height: 12pt, fill: fill-val, stroke: stroke-size + stroke-color, radius: 2pt)

    if style == "table" {
      table(
        columns: (1fr, 35pt, 35pt),
        align: (left+horizon, center+horizon, center+horizon),
        stroke: 0.5pt + border-color,
        table.cell(fill: header-bg, align: center, text(fill: header-color, weight: "bold")[Phát biểu]),
        table.cell(fill: header-bg, align: center, text(fill: header-color, weight: "bold")[Đ]),
        table.cell(fill: header-bg, align: center, text(fill: header-color, weight: "bold")[S]),
        ..statements.enumerate().map(((i, s)) => {
          let is-d = show-ans and ans-tf.len() > i and ans-tf.at(i) == "Đ"
          let is-s = show-ans and ans-tf.len() > i and ans-tf.at(i) == "S"
          (
            table.cell(fill: row-bg, align: left, [ *#("abcd".at(i)))* #s ]),
            table.cell(fill: if is-d { bg-color-or(correct-color) } else { row-bg })[
              #if is-d { text(fill: correct-color, weight: "bold")[✓] } else { empty-box }
            ],
            table.cell(fill: if is-s { bg-color-or(wrong-color) } else { row-bg })[
              #if is-s { text(fill: wrong-color, weight: "bold")[✗] } else { empty-box }
            ],
          )
        }).flatten()
      )
    } else {
      for (i, s) in statements.enumerate() [
        *#("abcd".at(i)))*
        #if show-ans and ans-tf.len() > i [
          #let correct = ans-tf.at(i) == "Đ"
          #text(fill: if correct { correct-color } else { wrong-color }, weight: "bold")[ (#if correct [✓ Đ] else [✗ S])]
        ] else [
          #h(4pt) #empty-box Đ #h(4pt) #empty-box S
        ]
        #s \ #v(4pt)
      ]
    }
  }
}
#let _render-mcq-marker(letter, shape, mark-bg, mark-border, mark-width, text-color) = {
  let fill-val = if mark-bg == auto { none } else { mark-bg }
  let content = text(fill: text-color, weight: "bold")[#letter]
  if shape == "square" {
    box(fill: fill-val, stroke: mark-width + mark-border, radius: 3pt, inset: (x: 4pt, y: 4pt), outset: (y: 1pt), baseline: 15%, content)
  } else {
    box(fill: fill-val, stroke: mark-width + mark-border, radius: 50%, inset: (x: 4pt, y: 4pt), outset: (y: 1pt), baseline: 15%, content)
  }
}
#let _render-essay-answer(ans, show-ans, ans-color) = {
  if show-ans and ans != none {
    v(8pt)
    text(fill: ans-color, weight: "bold")[➜ Đáp số: #ans]
  }
}

// =================================================================
// COMPONENT CHÍNH: Câu Hỏi
// =================================================================
#let vp-question(
  stem, type: "mcq", options: (), statements: (), ans: none, ans-tf: (), sol: none, level: none, source: none,
  lines: auto, q-bg: auto, q-border: auto, tf-header-bg: auto, ans-color: auto, tf-correct-color: auto, tf-wrong-color: auto, ans-shape: auto, ans-mark-bg: auto, ans-mark-border: auto, ans-mark-width: auto, ans-text-color: auto, level-color: auto, source-color: auto,
  q-radius: 5pt, q-padding: 12pt, q-margin: 6pt, lbl-color: rgb("#1890FF"), lbl-bg: none, lbl-radius: 0pt, lbl-padding: 0pt, icon-before: none, icon-after: none, opt-color: rgb("#333333"), opt-bg: none, opt-border: none, opt-radius: 0pt, opt-padding: 0pt, tf-style: "table", tf-header-color: white, tf-border: rgb("#E8E8E8"), tf-row-bg: none, short-border: rgb("#333333"), short-bg: none, image: none, image-ratio: 0.65, image-gap: 4%, image-side: "right", image-valign: top,
) = {
  vp-q-counter.step()
  context {
    let num = vp-q-counter.get().first()
    let is-ans = vp-show-ans.get()
    let is-sol = vp-show-sol.get()
    let is-level = vp-show-level.get()
    let is-source = vp-show-source.get()
    
    let theme-dict = vp-theme-state.get()
    let theme = theme-dict.at(type)

    let final-bg = if q-bg == auto { theme.bg } else { q-bg }
    let final-border = if q-border == auto { theme.border } else { q-border }
    let final-lines = if lines == auto { theme.lines } else { lines }
    let final-tf-header = if tf-header-bg == auto { theme.tf-header } else { tf-header-bg }
    let final-ans-color = if ans-color == auto { theme.ans-color } else { ans-color }
    let final-tf-correct = if tf-correct-color == auto { theme.tf-correct-color } else { tf-correct-color }
    let final-tf-wrong = if tf-wrong-color == auto { theme.tf-wrong-color } else { tf-wrong-color }
    let final-ans-shape = if ans-shape == auto { theme.ans-shape } else { ans-shape }
    let final-ans-mark-bg = if ans-mark-bg == auto { theme.ans-mark-bg } else { ans-mark-bg }
    let final-ans-mark-border = if ans-mark-border == auto { theme.ans-mark-border } else { ans-mark-border }
    let final-ans-mark-width = if ans-mark-width == auto { theme.ans-mark-width } else { ans-mark-width }
    let final-ans-text-color = if ans-text-color == auto { theme.ans-text-color } else { ans-text-color }
    let final-level-color = if level-color == auto { theme.level-color } else { level-color }
    let final-source-color = if source-color == auto { theme.source-color } else { source-color }

    vp-sol-store.update(arr => {
      arr.push((num: num, type: type, ans: ans, ans-tf: ans-tf, sol: sol, shown_inline: is-sol))
      arr
    })

    let has-visible-source = is-source and source != none

    let inner-content = [
      #box(fill: lbl-bg, radius: lbl-radius, inset: lbl-padding, outset: (y: 2pt))[
        #text(weight: "bold", fill: lbl-color)[
          #if icon-before != none [#icon-before ] Câu #num:#if icon-after != none [ #icon-after]
        ]
      ]
      #if is-level and level != none [ #text(fill: final-level-color, weight: "bold")[ \[#level\]] ]
      #if has-visible-source [ #text(fill: final-source-color, style: "italic")[ \[#source\]] ]
      #if has-visible-source [ \ ] else [ ]
      #stem
      #if type == "mcq" and options.len() > 0 [
        #v(8pt)
        #let max-w = 0pt
        #for (i, opt) in options.enumerate() {
          let size = measure(opt)
          if size.width > max-w { max-w = size.width }
        }
        #let total-w = max-w + 40pt 
        #let cols-count = if total-w > 7.5cm { 1 } else if total-w > 3.5cm { 2 } else { 4 }
        #let pad-top = 0pt
        #if _typst-type(opt-padding) == dictionary {
          pad-top = opt-padding.at("top", default: opt-padding.at("y", default: 0pt))
        } else if _typst-type(opt-padding) == length { pad-top = opt-padding }

        #vp-row(
          cols: (1fr,) * cols-count, gap: 12pt,
          ..options.enumerate().map(((i, opt)) => {
            let is-correct = is-ans and ans == str("ABCD".at(i))
            let letter = str("ABCD".at(i)) + "."
            let marker = if is-correct {
              _render-mcq-marker(letter, final-ans-shape, final-ans-mark-bg, final-ans-mark-border, final-ans-mark-width, final-ans-text-color)
            } else {
              box(fill: opt-bg, stroke: opt-border, radius: opt-radius, inset: opt-padding, baseline: 15%)[#text(weight: "bold", fill: opt-color)[#letter]]
            }
            let opt-content = if is-correct { text(fill: final-ans-text-color, weight: "bold")[#opt] } else { opt }
            let current-top-inset = if is-correct { 4pt } else { pad-top }
            [
              #grid(columns: (auto, 1fr), gutter: 6pt, marker, box(inset: (top: current-top-inset))[#opt-content])
            ]
          })
        )
      ] else if type == "tf" [
        #_render-tf(statements, tf-style, final-tf-header, tf-header-color, tf-border, tf-row-bg, ans-tf, is-ans, final-tf-correct, final-tf-wrong, final-ans-mark-bg, final-ans-mark-border, final-ans-mark-width)
      ] else if type == "short" [
        #_render-short-boxes(short-border, short-bg, ans, is-ans, final-ans-color)
      ] else if type == "essay" [
        #_render-essay-answer(ans, is-ans, final-ans-color)
      ]
      #if not is-sol [ #_render-dotlines(final-lines) ]
      #if is-sol and sol != none [
        #v(12pt)
        #block(fill: rgb("#FAFAFA"), stroke: (left: 2pt + vp-colors.primary), inset: 10pt, width: 100%, breakable: true)[*Lời giải:* \ #v(4pt) #sol]
      ]
    ]

    let final-content = if image != none {
      vp-img-side(image, ratio: image-ratio, gap: image-gap, side: image-side, valign: image-valign, inner-content)
    } else { inner-content }

    vp-block(bg: final-bg, border: final-border, radius: q-radius, padding: q-padding, margin: q-margin)[#final-content]
  }
}

// =================================================================
// CÁC HÀM XUẤT ĐÁP ÁN CUỐI SÁCH
// =================================================================
#let vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT") = {
  context {
    let arr = vp-sol-store.get().filter(item => item.sol != none and not item.shown_inline)
    if arr.len() > 0 {
      vp-heading([#title], level: 1, color: vp-colors.success)
      for item in arr {
        block(fill: rgb("#F6FFED"), stroke: 1pt + vp-colors.success, radius: 4pt, inset: 12pt, width: 100%, breakable: true)[
          *Câu #item.num:* \ #v(4pt) #item.sol
        ]
        v(10pt)
      }
    }
  }
}

#let vp-print-keys(title: "BẢNG ĐÁP ÁN NHANH") = {
  context {
    let store = vp-sol-store.get()
    let mcqs = store.filter(x => x.type == "mcq" and x.ans != none)
    let tfs = store.filter(x => x.type == "tf" and x.ans-tf != ())
    let shorts = store.filter(x => (x.type == "short" or x.type == "essay") and x.ans != none)

    if store.len() > 0 {
      vp-heading([#title], level: 1, color: vp-colors.danger)
      if mcqs.len() > 0 {
        vp-heading([PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN], level: 2, color: vp-colors.primary)
        table(
          columns: (1fr,) * 5, stroke: 0.5pt + vp-colors.border, align: center + horizon,
          ..mcqs.map(it => [ *#it.num.* #text(fill: vp-colors.danger, weight: "bold")[#it.ans] ])
        )
      }
      if tfs.len() > 0 {
        vp-heading([PHẦN II. TRẮC NGHIỆM ĐÚNG/SAI], level: 2, color: vp-colors.primary)
        table(
          columns: (auto, 1fr, 1fr, 1fr, 1fr), stroke: 0.5pt + vp-colors.border, align: center + horizon,
          table.cell(fill: rgb("#FAFAFA"))[*Câu*], table.cell(fill: rgb("#FAFAFA"))[*a)*], table.cell(fill: rgb("#FAFAFA"))[*b)*], table.cell(fill: rgb("#FAFAFA"))[*c)*], table.cell(fill: rgb("#FAFAFA"))[*d)*],
          ..tfs.map(it => {
            let cells = (table.cell(fill: rgb("#FAFAFA"))[*#it.num*],)
            let ans = it.ans-tf
            while ans.len() < 4 { ans.push("") }
            for a in ans.slice(0, 4) {
              let c = if a == "Đ" { vp-colors.success } else if a == "S" { vp-colors.danger } else { black }
              cells.push(text(fill: c, weight: "bold")[#a])
            }
            cells
          }).flatten()
        )
      }
      if shorts.len() > 0 {
        vp-heading([PHẦN III. TRẢ LỜI NGẮN], level: 2, color: vp-colors.primary)
        table(
          columns: (1fr,) * 4, stroke: 0.5pt + vp-colors.border, align: center + horizon,
          ..shorts.map(it => [ *#it.num.* #text(fill: vp-colors.danger, weight: "bold")[#it.ans] ])
        )
      }
    }
  }
}