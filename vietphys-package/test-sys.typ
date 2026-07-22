#import "my-macros.typ": *
#set text(lang: "vi")

#set page(
  paper: "a4",
  margin: (top: 2cm, bottom: 2cm, left: 1.5cm, right: 1.5cm),
  header-ascent: 0pt,
  header: [
    #vp-css-box(bg: none, padding: 10pt, radius: 0pt, border: 6pt + rgb("#1890FF"))[
      #stack(dir: ltr, spacing: 10pt)[
        #align(left)[
          #text(size: 12pt, weight: "regular", fill: rgb("#000000"))[Nhập văn bản thuần túy...]
        ]
        #align(center)[
          #text(size: 16pt, fill: rgb("#1890FF"))[#fa-star()]
        ]
      ]
    ]
  ],
)

#pad(10pt)[
#vp-css-box(bg: none, padding: 10pt, radius: 6pt, border: none)[
  #stack(dir: ttb, spacing: 10pt)[
    #vp-chapter("I", "TÊN CHƯƠNG", color: rgb("#1890FF"))
  ]
]
]
#vp-lesson("1", "TÊN BÀI HỌC", color: rgb("#4d8cc7"))
#vp-section("1", "TIÊU ĐỀ PHẦN", color: rgb("#1890FF"))
#vp-css-box(bg: none, padding: 10pt, radius: 0pt, border: none)[
  #stack(dir: ttb, spacing: 10pt)[
    #vp-form("1", "Tên dạng bài", color: rgb("#FF3B1D"))
    #align(left)[
      #text(size: 12pt, weight: "regular", fill: rgb("#000000"))[Nhập văn bản thuần túy...]
    ]
  ]
]
#vp-css-box(bg: none, padding: 10pt, radius: 0pt, border: none)[
  #stack(dir: ltr, spacing: 10pt)[
    #align(left)[
      #text(size: 12pt, weight: "regular", fill: rgb("#000000"))[Nhập văn bản thuần túy...]
    ]
    #align(center)[#v(8pt)#image("/vietphys-package/img/placeholder_hinh_1.png", width: 70%)#v(8pt)]
    #align(center)[
      #text(size: 16pt, fill: rgb("#1890FF"))[#fa-star()]
    ]
  ]
]
#vp-lesson("1", "TÊN BÀI HỌC", color: rgb("#1890FF"))
#vp-chapter("I", "TÊN CHƯƠNG", color: rgb("#941944"))
