#let vp-colors = (
  primary: rgb("#1890FF"),
  success: rgb("#52C41A"),
  warning: rgb("#FAAD14"),
  danger: rgb("#FF4D4F"),
  text-main: rgb("#333333"),
  border: rgb("#E8E8E8")
)

#let vp-theme-state = state("vp-theme", (
  mcq:   (bg: none, border: none, lines: 0, tf-header: rgb("#1890FF"), ans-color: rgb("#FF4D4F"), tf-correct-color: rgb("#52C41A"), tf-wrong-color: rgb("#FF4D4F"), ans-shape: "circle", ans-mark-bg: auto, ans-mark-border: rgb("#FF4D4F"), ans-mark-width: 1.5pt, ans-text-color: rgb("#FF4D4F"), level-color: rgb("#FAAD14"), source-color: luma(120)),
  tf:    (bg: none, border: 0.5pt + luma(180), lines: 0, tf-header: rgb("#262626"), ans-color: rgb("#FF4D4F"), tf-correct-color: rgb("#52C41A"), tf-wrong-color: rgb("#FF4D4F"), ans-shape: "circle", ans-mark-bg: auto, ans-mark-border: rgb("#FF4D4F"), ans-mark-width: 1.5pt, ans-text-color: rgb("#FF4D4F"), level-color: rgb("#FAAD14"), source-color: luma(120)),
  short: (bg: rgb("#FFFBE6"), border: 1pt + rgb("#FAAD14"), lines: 2, tf-header: rgb("#1890FF"), ans-color: rgb("#FF4D4F"), tf-correct-color: rgb("#52C41A"), tf-wrong-color: rgb("#FF4D4F"), ans-shape: "circle", ans-mark-bg: auto, ans-mark-border: rgb("#FF4D4F"), ans-mark-width: 1.5pt, ans-text-color: rgb("#FF4D4F"), level-color: rgb("#FAAD14"), source-color: luma(120)),
  essay: (bg: rgb("#FFF1F0"), border: 1pt + rgb("#FF4D4F"), lines: 5, tf-header: rgb("#1890FF"), ans-color: rgb("#FF4D4F"), tf-correct-color: rgb("#52C41A"), tf-wrong-color: rgb("#FF4D4F"), ans-shape: "circle", ans-mark-bg: auto, ans-mark-border: rgb("#FF4D4F"), ans-mark-width: 1.5pt, ans-text-color: rgb("#FF4D4F"), level-color: rgb("#FAAD14"), source-color: luma(120)),
))

#let vp-set-theme(q-type, bg: auto, border: auto, lines: auto, tf-header: auto, ans-color: auto, tf-correct-color: auto, tf-wrong-color: auto, ans-shape: auto, ans-mark-bg: auto, ans-mark-border: auto, ans-mark-width: auto, ans-text-color: auto, level-color: auto, source-color: auto) = {
  vp-theme-state.update(dict => {
    let new-style = dict.at(q-type)
    if bg != auto { new-style.bg = bg }
    if border != auto { new-style.border = border }
    if lines != auto { new-style.lines = lines }
    if tf-header != auto { new-style.tf-header = tf-header }
    if ans-color != auto { new-style.ans-color = ans-color }
    if tf-correct-color != auto { new-style.tf-correct-color = tf-correct-color }
    if tf-wrong-color != auto { new-style.tf-wrong-color = tf-wrong-color }
    if ans-shape != auto { new-style.ans-shape = ans-shape }
    if ans-mark-bg != auto { new-style.ans-mark-bg = ans-mark-bg }
    if ans-mark-border != auto { new-style.ans-mark-border = ans-mark-border }
    if ans-mark-width != auto { new-style.ans-mark-width = ans-mark-width }
    if ans-text-color != auto { new-style.ans-text-color = ans-text-color }
    if level-color != auto { new-style.level-color = level-color }
    if source-color != auto { new-style.source-color = source-color }
    dict.insert(q-type, new-style)
    return dict
  })
}