export interface TemplateProps {
    num?: string;
    title?: string;
    color?: string;
    fontFamily?: string;
    titleSize?: string; 
    numSize?: string;   
}

export const chapterTemplates = {
    // 1. MẪU LỤC GIÁC (CỦA THẦY MINH VẼ BẰNG AFFINITY)
    "chap_style_1": (p: TemplateProps) => {
        const c = p.color || "#1E3A8A"; 
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        // SVG do thầy tự vẽ, đã được tối ưu:
        const svg = `<svg viewBox="0 0 778 93" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><g transform="matrix(1,0,0,1,-7.275,-3.545)"><g transform="matrix(0.937,0,0,0.937,-14.94,-4.909)"><path d="M109.175,10.132L151.133,34.356L151.133,82.805L109.175,107.03L67.217,82.805L67.217,34.356L109.175,10.132Z" style="fill:none;stroke:${c};stroke-width:2.22px;"/></g><path d="M126.721,26.502L643.696,26.502" style="fill:none;stroke:${c};stroke-width:2.08px;"/><path d="M111.419,84.587L779.934,84.587" style="fill:none;stroke:${c};stroke-width:2.08px;"/><path d="M754.059,84.587L780.462,58.185L780.462,84.587L754.059,84.587Z" style="fill:${c};stroke:${c};stroke-width:2.08px;"/><g transform="matrix(0.553,0,0,0.553,21.481,22.346)"><path d="M48.064,50L20.594,50" style="fill:none;stroke:${c};stroke-width:3.77px;"/></g><g transform="matrix(1,0,0,1,0,-1.716)"><circle cx="655.974" cy="28.218" r="12.277" style="fill:none;stroke:${c};stroke-width:2.08px;"/></g><g transform="matrix(1,0,0,1,-635.379,21.782)"><circle cx="655.974" cy="28.218" r="12.277" style="fill:none;stroke:${c};stroke-width:2.08px;"/></g><path d="M668.251,26.502L779.934,26.502" style="fill:none;stroke:${c};stroke-width:2.08px;stroke-dasharray:2.083,2.083;"/></g></svg>`.replace(/"/g, '\\"');
        
        return `
#v(10pt)
#block(width: 100%, height: 70pt)[
  #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("${svg}"), format: "svg", width: 100%, height: 100%, fit: "stretch")]]
  #place(top + left, dx: 11.5%, dy: 15%)[
    #align(center)[
      #text(${font}fill: rgb("${c}"), size: 9pt, weight: "bold")[CHƯƠNG]\\
      #text(${font}fill: rgb("${c}"), size: ${p.numSize || '26pt'}, weight: "bold")[${p.num}]
    ]
  ]
  #place(top + left, dx: 26%, dy: 35%)[
    #text(${font}fill: rgb("${c}"), size: ${p.titleSize || '24pt'}, weight: "bold")[#upper("${p.title}")]
  ]
]
#v(10pt)
`;
    },

    // 2. MẪU VÒNG TRÒN KÉP (NHIỆT HỌC)
    "chap_style_2": (p: TemplateProps) => {
        const c = p.color || "#388E3C"; // Xanh lá
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        const svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="85" y="15" width="640" height="70" rx="15" fill="white" stroke="${c}" stroke-width="1.5"/><path d="M 685 15 L 710 15 A 15 15 0 0 1 725 30 L 725 85 A 15 15 0 0 1 710 100 L 685 100 Z" fill="${c}" opacity="0.3"/><path d="M 705 45 v 20 a 8 8 0 1 0 10 0 v -20 a 5 5 0 0 0 -10 0 z" fill="none" stroke="${c}" stroke-width="2"/><circle cx="680" cy="25" r="2" fill="${c}"/><circle cx="690" cy="25" r="2" fill="${c}"/><circle cx="700" cy="25" r="2" fill="${c}"/><circle cx="85" cy="50" r="40" fill="white" stroke="${c}" stroke-width="3"/><path d="M 85 0 A 50 50 0 0 0 35 50 A 50 50 0 0 0 85 100" fill="none" stroke="${c}" stroke-width="3"/><circle cx="85" cy="0" r="3" fill="${c}"/><circle cx="85" cy="100" r="3" fill="${c}"/></svg>`.replace(/"/g, '\\"');
        return `
#v(10pt)
#block(width: 100%, height: 70pt)[
  #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("${svg}"), format: "svg", width: 100%, height: 100%, fit: "stretch")]]
  #place(top + left, dx: 7.2%, dy: 22%)[
    #align(center)[
      #text(${font}fill: rgb("${c}"), size: 9pt, weight: "bold")[CHƯƠNG]\\
      #text(${font}fill: rgb("${c}"), size: ${p.numSize || '26pt'}, weight: "bold")[${p.num}]
    ]
  ]
  #place(top + left, dx: 22%, dy: 35%)[
    #text(${font}fill: rgb("${c}"), size: ${p.titleSize || '24pt'}, weight: "bold")[#upper("${p.title}")]
  ]
]
#v(10pt)
`;
    },

    // 3. MẪU RUY BĂNG (ĐIỆN HỌC)
    "chap_style_3": (p: TemplateProps) => {
        const c = p.color || "#F59E0B"; // Vàng cam
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        const svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="35" y="25" width="690" height="60" fill="white" stroke="${c}" stroke-width="1.5"/><line x1="35" y1="85" x2="500" y2="85" stroke="white" stroke-width="3"/><line x1="35" y1="85" x2="500" y2="85" stroke="${c}" stroke-width="1.5" stroke-dasharray="8 4"/><polygon points="35,0 120,0 120,70 77.5,95 35,70" fill="${c}"/><polygon points="25,10 35,10 35,25 25,10" fill="${c}" opacity="0.6"/><circle cx="670" cy="45" r="10" fill="none" stroke="${c}" stroke-width="1.5"/><text x="670" y="49" font-family="Arial" font-size="10" font-weight="bold" fill="${c}" text-anchor="middle">V</text><path d="M 620 70 l 10 0 l 5 -10 l 10 20 l 10 -20 l 10 20 l 5 -10 l 10 0" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="670" y1="55" x2="670" y2="70" stroke="${c}" stroke-width="1.5"/></svg>`.replace(/"/g, '\\"');
        return `
#v(10pt)
#block(width: 100%, height: 70pt)[
  #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("${svg}"), format: "svg", width: 100%, height: 100%, fit: "stretch")]]
  #place(top + left, dx: 7.2%, dy: 15%)[
    #align(center)[
      #text(${font}fill: white, size: 9pt, weight: "bold")[CHƯƠNG]\\
      #text(${font}fill: white, size: ${p.numSize || '26pt'}, weight: "bold")[${p.num}]
    ]
  ]
  #place(top + left, dx: 22%, dy: 45%)[
    #text(${font}fill: black, size: ${p.titleSize || '22pt'}, weight: "bold")[#upper("${p.title}")]
  ]
]
#v(10pt)
`;
    },

    // 4. MẪU BÌNH HÀNH NGHIÊNG (SÓNG)
    "chap_style_4": (p: TemplateProps) => {
        const c = p.color || "#0694A2"; // Xanh ngọc
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        const svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="140" y1="20" x2="720" y2="20" stroke="${c}" stroke-width="1.5"/><circle cx="725" cy="20" r="2.5" fill="${c}"/><path d="M 620 80 l 15 -15 l 20 30 l 20 -30 l 15 15 l 20 0" fill="none" stroke="${c}" stroke-width="1.5"/><line x1="620" y1="80" x2="160" y2="80" stroke="${c}" stroke-width="1.5"/><polygon points="30,90 60,10 140,10 110,90" fill="${c}"/><line x1="145" y1="20" x2="120" y2="80" stroke="${c}" stroke-width="1.5"/><path d="M 115 95 l 10 -10 m 5 10 l 10 -10 m 5 10 l 10 -10 m 5 10 l 10 -10 m 5 10 l 10 -10" fill="none" stroke="${c}" stroke-width="2" opacity="0.4"/></svg>`.replace(/"/g, '\\"');
        return `
#v(10pt)
#block(width: 100%, height: 70pt)[
  #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("${svg}"), format: "svg", width: 100%, height: 100%, fit: "stretch")]]
  #place(top + left, dx: 9.5%, dy: 22%)[
    #align(center)[
      #text(${font}fill: white, size: 9pt, weight: "bold")[CHƯƠNG]\\
      #text(${font}fill: white, size: ${p.numSize || '26pt'}, weight: "bold")[${p.num}]
    ]
  ]
  #place(top + left, dx: 26%, dy: 35%)[
    #text(${font}fill: rgb("${c}"), size: ${p.titleSize || '22pt'}, weight: "bold")[#upper("${p.title}")]
  ]
]
#v(10pt)
`;
    },

    // 5. MẪU TIA SÁNG (QUANG HỌC)
    "chap_style_5": (p: TemplateProps) => {
        const c = p.color || "#6B21A8"; // Tím
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        const svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><line x1="110" y1="20" x2="720" y2="20" stroke="${c}" stroke-width="1.5"/><circle cx="725" cy="20" r="2.5" fill="${c}"/><line x1="110" y1="80" x2="600" y2="80" stroke="${c}" stroke-width="1.5"/><circle cx="610" cy="80" r="1.5" fill="${c}"/><circle cx="620" cy="80" r="1.5" fill="${c}"/><circle cx="630" cy="80" r="1.5" fill="${c}"/><circle cx="640" cy="80" r="1.5" fill="${c}"/><circle cx="85" cy="50" r="35" fill="white" stroke="${c}" stroke-width="2"/><circle cx="85" cy="50" r="43" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="85" cy="50" r="50" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="35" cy="50" r="2.5" fill="${c}"/><circle cx="85" cy="100" r="2.5" fill="${c}"/><path d="M 680 50 l 40 0 M 700 30 l 0 40 M 686 36 l 28 28 M 686 64 l 28 -28" fill="none" stroke="${c}" stroke-width="1.5"/></svg>`.replace(/"/g, '\\"');
        return `
#v(10pt)
#block(width: 100%, height: 70pt)[
  #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("${svg}"), format: "svg", width: 100%, height: 100%, fit: "stretch")]]
  #place(top + left, dx: 7.2%, dy: 22%)[
    #align(center)[
      #text(${font}fill: rgb("${c}"), size: 9pt, weight: "bold")[CHƯƠNG]\\
      #text(${font}fill: rgb("${c}"), size: ${p.numSize || '26pt'}, weight: "bold")[${p.num}]
    ]
  ]
  #place(top + left, dx: 24%, dy: 35%)[
    #text(${font}fill: black, size: ${p.titleSize || '24pt'}, weight: "bold")[#upper("${p.title}")]
  ]
]
#v(10pt)
`;
    },

    // 6. MẪU NGUYÊN TỬ (HIỆN ĐẠI)
    "chap_style_6": (p: TemplateProps) => {
        const c = p.color || "#475569"; // Xám xanh
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        const svg = `<svg viewBox="0 0 736 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="25" width="650" height="60" fill="white" stroke="${c}" stroke-width="1.5"/><path d="M 660 15 l -15 10 m -5 -10 l -15 10 m -5 -10 l -30 0" fill="none" stroke="${c}" stroke-width="4" opacity="0.6"/><polygon points="35,10 110,10 110,95 72.5,75 35,95" fill="${c}"/><polygon points="110,10 120,10 110,25" fill="${c}" opacity="0.6"/><ellipse cx="670" cy="55" rx="15" ry="6" transform="rotate(30 670 55)" fill="none" stroke="${c}" stroke-width="1.5"/><ellipse cx="670" cy="55" rx="15" ry="6" transform="rotate(90 670 55)" fill="none" stroke="${c}" stroke-width="1.5"/><ellipse cx="670" cy="55" rx="15" ry="6" transform="rotate(150 670 55)" fill="none" stroke="${c}" stroke-width="1.5"/><circle cx="670" cy="55" r="2" fill="${c}"/><circle cx="670" cy="95" r="2" fill="${c}"/><circle cx="680" cy="95" r="2" fill="${c}"/><circle cx="690" cy="95" r="2" fill="${c}"/></svg>`.replace(/"/g, '\\"');
        return `
#v(10pt)
#block(width: 100%, height: 70pt)[
  #place(top + left)[#block(width: 100%, height: 100%)[#image(bytes("${svg}"), format: "svg", width: 100%, height: 100%, fit: "stretch")]]
  #place(top + left, dx: 6%, dy: 20%)[
    #align(center)[
      #text(${font}fill: white, size: 9pt, weight: "bold")[CHƯƠNG]\\
      #text(${font}fill: white, size: ${p.numSize || '26pt'}, weight: "bold")[${p.num}]
    ]
  ]
  #place(top + left, dx: 22%, dy: 45%)[
    #text(${font}fill: black, size: ${p.titleSize || '22pt'}, weight: "bold")[#upper("${p.title}")]
  ]
]
#v(10pt)
`;
    }
};

// 📦 KHO MẪU BÀI HỌC (LESSON)
export const lessonTemplates = {
    "less_ribbon_pen": (p: TemplateProps) => {
        const c = p.color || "#FF7A1D";
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        return `
#v(12pt)
#vp-css-box(
  [#text(${font}size: ${p.numSize || '16pt'})[BÀI ${p.num}:] #text(${font}size: ${p.titleSize || '16pt'})[#upper("${p.title}")]], 
  icon: fa-pen(), 
  bg: rgb("${c}"), 
  border: (left: 6pt + rgb("#FF3B1D")), 
  shadow: (dx: 3pt, dy: 3pt, color: black.lighten(20%)), 
  padding: (x: 16pt, y: 12pt), 
  text-color: white
)
#v(8pt)
`;
    }
};

// 📦 KHO MẪU MỤC LỚN (SECTION)
export const sectionTemplates = {
    "sec_star_underline": (p: TemplateProps) => {
        const c = p.color || "#1890FF";
        const font = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
        return `
#v(12pt)
#grid(
  columns: (auto, 1fr), 
  column-gutter: 10pt, 
  align: (center + horizon, left + horizon), 
  box(fill: rgb("${c}"), radius: 4pt, width: 2.2em, height: 2.2em)[#place(center + horizon)[#text(fill: white, size: 1.2em)[#fa-star()]]], 
  block(width: 100%, stroke: (bottom: 1.5pt + rgb("${c}").lighten(30%)), inset: (bottom: 8pt))[
    #text(${font}fill: rgb("${c}"), weight: "bold", size: ${p.titleSize || '14pt'})[${p.num}. #upper("${p.title}")]
  ]
)
#v(6pt)
`;
    }
};

export const getTemplateCode = (type: 'chapter' | 'lesson' | 'section', id: string, props: TemplateProps): string => {
    try {
        if (type === 'chapter' && chapterTemplates[id as keyof typeof chapterTemplates]) 
            return chapterTemplates[id as keyof typeof chapterTemplates](props);
        if (type === 'lesson' && lessonTemplates[id as keyof typeof lessonTemplates]) 
            return lessonTemplates[id as keyof typeof lessonTemplates](props);
        if (type === 'section' && sectionTemplates[id as keyof typeof sectionTemplates]) 
            return sectionTemplates[id as keyof typeof sectionTemplates](props);
        
        return `#text(fill: red)[Lỗi: Không tìm thấy ID Mẫu "${id}"]\n`;
    } catch (e) {
        return `#text(fill: red)[Lỗi biên dịch Mẫu: ${id}]\n`;
    }
};