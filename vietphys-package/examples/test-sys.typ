#import "/vietphys-package/vietphys.typ": *
#set text(lang: "vi")
#set page(paper: "a4", margin: (top: 15pt, right: 15pt, bottom: 15pt, left: 15pt))


#pad(0pt)[
  #vp-css-box(bg: none, radius: 0pt, padding: 0pt, width: 100%)[
    #align(left)[
      #block(width: 100%, height: 80pt)[
        #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("<svg viewBox=\"0 0 800 100\" xmlns=\"http://www.w3.org/2000/svg\">   <!-- Đường gạch và dấu chấm bên trái -->   <circle cx=\"20\" cy=\"50\" r=\"3\" fill=\"none\" stroke=\"#008f3e\" stroke-width=\"1.5\"/>   <line x1=\"23\" y1=\"50\" x2=\"50\" y2=\"50\" stroke=\"#008f3e\" stroke-width=\"1.5\"/>      <!-- Đường gạch ngang phía trên -->   <line x1=\"135\" y1=\"15\" x2=\"700\" y2=\"15\" stroke=\"#008f3e\" stroke-width=\"1.5\"/>   <!-- 5 dấu chấm phía trên bên phải -->   <circle cx=\"715\" cy=\"15\" r=\"2.5\" fill=\"#008f3e\"/>   <circle cx=\"730\" cy=\"15\" r=\"2.5\" fill=\"#008f3e\"/>   <circle cx=\"745\" cy=\"15\" r=\"2.5\" fill=\"#008f3e\"/>   <circle cx=\"760\" cy=\"15\" r=\"2.5\" fill=\"#008f3e\"/>   <circle cx=\"775\" cy=\"15\" r=\"2.5\" fill=\"#008f3e\"/>    <!-- Đường gạch ngang phía dưới -->   <line x1=\"135\" y1=\"85\" x2=\"780\" y2=\"85\" stroke=\"#008f3e\" stroke-width=\"1.5\"/>   <!-- Hình tam giác góc dưới bên phải -->   <polygon points=\"780,85 780,65 760,85\" fill=\"#008f3e\"/>    <!-- Hình Lục giác (Vẽ cuối để đè lên các nét kia) -->   <polygon points=\"50,50 75,15 135,15 160,50 135,85 75,85\" fill=\"white\" stroke=\"#008f3e\" stroke-width=\"3\"/> </svg>"), format: "svg", width: 100%, height: 100%, fit: "stretch")]
      ]
              #place(top + left, dx: 5.5%, dy: 20%)[
        #pad(0pt)[
          #vp-css-box(bg: none, radius: 0pt, padding: 0pt, width: 15%)[
            #align(center)[
              #block(width: 100%)[
                #pad(0pt)[
                  #text(fill: rgb("#079243"), size: 12pt, weight: "regular", )[
                  #text(size: 9pt)[CHƯƠNG]\ 
                  #text(size: 26pt)[{{num}}]
                ]
                ]
              ]
            ]
          ]
        ]
        ]
        #place(top + left, dx: 25%, dy: 35%)[
        #pad(0pt)[
          #vp-css-box(bg: none, radius: 0pt, padding: 0pt, width: 55%)[
            #align(left)[
              #block(width: 100%)[
                #pad(0pt)[
                  #text(fill: rgb("#05a325"), size: 30pt, weight: "bold", )[
                  {{title}}
                ]
                ]
              ]
            ]
          ]
        ]
        ]
#pad(10pt)[
          #v(0pt)
        ]
      ]
    ]
  ]
]
