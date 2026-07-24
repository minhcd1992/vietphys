import { BuilderNode } from "../store/builderStore";
import { getTemplateCode } from "./templateRegistry"; // 🌟 Import Kho Mẫu Cứng

export const generateTypstCode = (rootNode: BuilderNode): string => {
  let headerCode = "";
  let footerCode = "";
  const rp = rootNode.properties || {};

  let code = `#import "/vietphys-package/vietphys.typ": *\n`;
  code += `#set text(lang: "vi", font: ("Arial", "Helvetica", "Noto Sans", "Liberation Sans"))\n`;
  
  if (rp.paperSize === 'a5') {
      code += `#set page(paper: "a5", margin: (top: ${rp.marginTop||'15pt'}, right: ${rp.marginRight||'15pt'}, bottom: ${rp.marginBottom||'15pt'}, left: ${rp.marginLeft||'15pt'}))\n\n`;
  } else {
      code += `#set page(paper: "a4", margin: (top: ${rp.marginTop||'15pt'}, right: ${rp.marginRight||'15pt'}, bottom: ${rp.marginBottom||'15pt'}, left: ${rp.marginLeft||'15pt'}))\n\n`;
  }

  // 1. Tải các mẫu LINH HOẠT từ LocalStorage
  let customChapterTpls: any[] = [];
  let customLessonTpls: any[] = [];
  let customSectionTpls: any[] = [];
  try {
     const storedChap = localStorage.getItem('vp_custom_chapter_tpls');
     if (storedChap) customChapterTpls = JSON.parse(storedChap);
     const storedLess = localStorage.getItem('vp_custom_lesson_tpls');
     if (storedLess) customLessonTpls = JSON.parse(storedLess);
     const storedSec = localStorage.getItem('vp_custom_section_tpls');
     if (storedSec) customSectionTpls = JSON.parse(storedSec);
  } catch (e) {}

  // 2. Hàm Bơm Dữ Liệu (Text, Màu sắc, Font) vào mẫu linh hoạt
  const injectDataToTemplate = (tplNode: any, data: {num?: string, title?: string}, themeProps?: any): any => {
      const clone = JSON.parse(JSON.stringify(tplNode));
      const replaceText = (str: string) => {
          if (!str || typeof str !== 'string') return str;
          return str.replace(/\{\{num\}\}/g, data.num || '').replace(/\{\{title\}\}/g, data.title || '');
      };
      const traverse = (n: any) => {
          if (n.id && !n.id.startsWith('virtual_')) n.id = `virtual_${Math.random().toString(36).substr(2, 9)}`;
          if (n.properties) {
              if (n.properties.content) n.properties.content = replaceText(n.properties.content);
              if (n.properties.title) n.properties.title = replaceText(n.properties.title);
              
              // Nhuộm màu và đổi font cho các phần tử con
              if (themeProps) {
                  if (themeProps.color) n.properties.color = themeProps.color;
                  if (themeProps.fontFamily && n.moduleName === "Text") n.properties.fontFamily = themeProps.fontFamily;
              }
          }
          if (n.children) n.children.forEach(traverse);
      };
      traverse(clone);
      return clone;
  };

  const formatColor = (c?: string) => {
      if (!c || c === 'none') return 'none';
      if (c.startsWith('#')) return `rgb("${c}")`;
      return c;
  };

  const formatBorder = (p: any, side = '') => {
      const style = p[`border${side}Style`];
      if (!style || style === 'none') return 'none';
      return `${p[`border${side}Width`] || '1pt'} + ${formatColor(p[`border${side}Color`] || '#000000')}`;
  };

  const escapeTypstString = (str?: string | number) => {
      if (str === undefined || str === null) return "";
      return String(str).replace(/"/g, '\\"');
  };

  const extractImgString = (raw: string) => {
      if (!raw) return "";
      let str = raw.trim();
      const match = str.match(/url\(['"]?(.*?)['"]?\)/i);
      if (match) return match[1];
      return str.replace(/['";]+$/, '').trim();
  };

  const renderNode = (node: BuilderNode, indent = ""): string => {
      if (node.moduleName === "Header") return "";
      if (node.moduleName === "Footer") return "";
      
      let out = "";
      const p = node.properties || {};
      
      let bgStr = "none";
      let placeImageOverlay = "";

      if (p.bgType === 'gradient') {
          bgStr = `gradient.linear(${formatColor(p.bgGradientStart || '#1890FF')}, ${formatColor(p.bgGradientEnd || '#722ED1')}, angle: ${p.gradientAngle || 135}deg)`;
      } else if (p.bgType === 'image' && p.bgImage) {
          bgStr = "none"; 
          let cleanBgImage = extractImgString(p.bgImage);
          let imgTypst = "";
          let dynamicThemeColorHex = p.color || '#1890FF';

          if (cleanBgImage.startsWith('<svg') || cleanBgImage.startsWith('data:image/svg+xml')) {
              let rawSvg = "";
              if (cleanBgImage.startsWith('<svg')) {
                  rawSvg = cleanBgImage;
              } else {
                  let isBase64 = cleanBgImage.includes(';base64,');
                  let svgData = cleanBgImage.substring(cleanBgImage.indexOf(',') + 1);
                  if (isBase64) {
                      try { rawSvg = decodeURIComponent(escape(atob(svgData))); } catch(e) { try { rawSvg = atob(svgData); } catch (err) { rawSvg = ""; } }
                  } else {
                      try { rawSvg = decodeURIComponent(svgData); } catch (e) { rawSvg = unescape(svgData); }
                  }
              }
              rawSvg = rawSvg.replace(/\{\{color\}\}/gi, dynamicThemeColorHex);
              let escapedSvg = rawSvg.replace(/"/g, '\\"').replace(/\n/g, ' ');
              imgTypst = `image(bytes("${escapedSvg}"), format: "svg")`;
          } else if (cleanBgImage.startsWith('data:image/')) {
              imgTypst = `none /* Base64 Image */`;
          } else {
              imgTypst = `image("${escapeTypstString(cleanBgImage)}")`;
          }

          if (!imgTypst.startsWith('none')) {
              if (p.bgImageDisplay === 'pattern') {
                  let stretchedImg = imgTypst.replace(/\)$/, ', width: 100%, height: 100%)');
                  bgStr = `tiling(size: (${p.bgPatternW || '60pt'}, ${p.bgPatternH || '60pt'}))[#${stretchedImg}]`;
              } else {
                  bgStr = "none";
                  let fitStr = p.bgImageDisplay === 'stretch' ? `, width: 100%, height: 100%, fit: "stretch"` : (p.bgImageDisplay === 'contain' ? `, width: 100%, height: 100%, fit: "contain"` : `, width: 100%, height: 100%, fit: "cover"`);
                  placeImageOverlay = `#place(top + left)[#block(width: 100%, height: 100%)[#${imgTypst.replace(/\)$/, fitStr + ')')}]\n${indent}      ]\n${indent}      `;
              }
          }
      } else { bgStr = formatColor(p.bg); }

      let borderStr = p.borderLinked !== false && p.borderStyle && p.borderStyle !== 'none' ? `border: ${formatBorder(p)}, ` : (p.borderLinked === false ? `border: (top: ${formatBorder(p, 'Top')}, right: ${formatBorder(p, 'Right')}, bottom: ${formatBorder(p, 'Bottom')}, left: ${formatBorder(p, 'Left')}), ` : "");
      let radiusStr = p.radiusLinked !== false ? (p.radius && p.radius !== '0pt' ? `radius: ${p.radius}, ` : "") : `radius: (top-left: ${p.radiusTopLeft||'0pt'}, top-right: ${p.radiusTopRight||'0pt'}, bottom-right: ${p.radiusBottomRight||'0pt'}, bottom-left: ${p.radiusBottomLeft||'0pt'}), `;
      let paddingStr = p.paddingLinked !== false ? (p.padding && p.padding !== '0pt' ? `padding: ${p.padding}, ` : "") : `padding: (top: ${p.paddingTop||'0pt'}, right: ${p.paddingRight||'0pt'}, bottom: ${p.paddingBottom||'0pt'}, left: ${p.paddingLeft||'0pt'}), `;
      let marginStr = p.marginLinked !== false ? (p.margin && p.margin !== '0pt' ? `margin: ${p.margin}, ` : "") : `margin: (top: ${p.marginTop||'0pt'}, right: ${p.marginRight||'0pt'}, bottom: ${p.marginBottom||'0pt'}, left: ${p.marginLeft||'0pt'}), `;

      switch (node.moduleName) {
          case "Container": {
              let innerCode = "";
              if (node.children) innerCode = node.children.map(c => renderNode(c, indent + "      ")).join("");

              let containerContent = innerCode;
              if (p.layoutType === 'grid') {
                  const cols = p.gridCols || "1fr 1fr";
                  containerContent = `#grid(columns: (${cols.split(/\s+/).filter(Boolean).join(", ")}), column-gutter: ${p.gap || '0pt'}, row-gutter: ${p.gap || '0pt'},\n${indent}      ${innerCode}\n${indent}    )`;
              } else if (p.direction === 'row') {
                  containerContent = `#stack(dir: ltr, spacing: ${p.gap || '0pt'},\n${indent}      ${innerCode}\n${indent}    )`;
              } else {
                  containerContent = `#stack(dir: ttb, spacing: ${p.gap || '0pt'},\n${indent}      ${innerCode}\n${indent}    )`;
              }

              let boxCode = `#block(width: ${p.width || '100%'}, ${p.height && p.height !== 'auto' ? `height: ${p.height}, ` : ""})[\n`;
              boxCode += `${indent}  #vp-css-box(bg: ${bgStr}, ${radiusStr}${paddingStr}${marginStr}${borderStr}width: 100%, ${p.height && p.height !== 'auto' ? `height: 100%` : ""})[\n`;
              boxCode += `${indent}    #align(${p.align || 'left'})[\n`;
              if (placeImageOverlay) boxCode += `${indent}      ${placeImageOverlay}\n`;
              boxCode += `${indent}      ${containerContent}\n`;
              boxCode += `${indent}    ]\n`;
              boxCode += `${indent}  ]\n`;
              boxCode += `${indent}]\n`;
              out += boxCode;
              break;
          }
          
          case "Text": {
              const fontStr = p.fontFamily ? `font: "${p.fontFamily}", ` : ``;
              let textContent = p.content || "";
              out += `${indent}#pad(${p.padding || '0pt'})[\n${indent}  #text(${fontStr}fill: ${formatColor(p.color)}, size: ${p.fontSize || 12}${p.fontUnit || 'pt'}, weight: "${p.fontWeight || 'regular'}", tracking: ${p.letterSpacing || '0pt'})[\n${indent}    ${textContent.replace(/\n/g, '\\\n' + indent + '    ')}\n${indent}  ]\n${indent}]\n`;
              break;
          }
          
          case "Box": {
              let boxType = "info";
              if (p.boxType === 'warning') boxType = "warning";
              if (p.boxType === 'tip') boxType = "tip";
              out += `${indent}#vp-box(type: "${boxType}", title: "${escapeTypstString(p.title)}")[\n${indent}  ${(p.content || "").replace(/\n/g, '\n' + indent + '  ')}\n${indent}]\n`;
              break;
          }
          
          case "Image": {
              out += `${indent}#align(${p.align || 'center'})[#image("${escapeTypstString(p.content)}", width: ${p.width || 100}%)]\n`;
              break;
          }
          
          case "Icon": {
              const faName = p.iconName ? p.iconName.replace('fa-', '') : 'star';
              out += `${indent}#text(fill: ${formatColor(p.color)}, size: ${p.fontSize || 12}pt)[#fa-icon("${faName}")]\n`;
              break;
          }
          
          case "RawTypst": {
              out += `${indent}${p.content}\n`;
              break;
          }

          case "QuestionBlock": {
              if (p.questionData && p.questionData.length > 0) {
                  const items = p.questionData.map((q: any) => {
                      const opts = q.options && q.options.length > 0 && q.options[0] !== "" 
                         ? `options: (${q.options.map((opt: string) => `[${opt.replace(/\n/g, ' ')}]`).join(", ")}), layout: ${p.optionsLayout || 4},` 
                         : "";
                      const lvl = rp.qShowLevel !== false && q.level ? `level: "${q.level}",` : "";
                      const src = rp.qShowSource !== false && q.topic ? `source: "${q.topic}",` : "";
                      const sol = rp.qShowSolution === true && q.solution ? `solution: [${q.solution.replace(/\n/g, '\n' + indent + '    ')}],` : "";
                      return `${indent}  (stem: [${q.stem.replace(/\n/g, '\n' + indent + '    ')}], ${opts} ${lvl} ${src} ${sol}),`;
                  }).join("\n");
                  
                  let configStr = "";
                  if (rp.qPrefix) configStr += `prefix: "${rp.qPrefix}", `;
                  if (rp.qColor) configStr += `color: ${formatColor(rp.qColor)}, `;
                  if (rp.qBg) configStr += `bg: ${formatColor(rp.qBg)}, `;
                  if (rp.qLevelColor) configStr += `level-color: ${formatColor(rp.qLevelColor)}, `;
                  if (rp.qSourceColor) configStr += `source-color: ${formatColor(rp.qSourceColor)}, `;

                  out += `${indent}#vp-render-questions(${configStr}questions: (\n${items}\n${indent}))\n`;
              }
              break;
          }
          
          case "Form": {
              out += `${indent}#vp-form(num: "${escapeTypstString(p.num)}", title: "${escapeTypstString(p.title)}")\n`;
              break;
          }

          // 🌟🌟🌟 DUAL-ENGINE: KIỂM TRA LINH HOẠT TRƯỚC, CODE CỨNG SAU 🌟🌟🌟
          case "Chapter": {
              let tplC = p.template && p.template !== 'global' ? p.template : (rp.tplChapter || 'A');
              // Quy đổi ID cũ sang ID cứng mới
              if (tplC === 'A') tplC = 'chap_dashed_box';
              if (tplC === 'B') tplC = 'chap_hexagon';
              
              const customTpl = customChapterTpls.find((t: any) => t.id === tplC);
              if (customTpl && customTpl.nodeData) {
                  // Gặp Mẫu Linh hoạt => Bơm biến p và biên dịch đệ quy
                  const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title }, p);
                  out += renderNode(virtualNode, indent);
              } else {
                  // Không thấy => Gọi thẳng code cứng từ thư viện Registry
                  out += getTemplateCode('chapter', tplC, {
                      num: p.num || "1", title: p.title || "TÊN CHƯƠNG",
                      color: p.color, fontFamily: p.fontFamily,
                      numSize: p.numSize, titleSize: p.titleSize
                  });
              }
              break;
          }
          
          case "Lesson": {
              let tplL = p.template && p.template !== 'global' ? p.template : (rp.tplLesson || 'A');
              // Quy đổi ID cũ sang ID cứng mới (Nếu có)
              if (tplL === 'A' || tplL === 'B') tplL = 'less_ribbon_pen';

              const customTpl = customLessonTpls.find((t: any) => t.id === tplL);
              if (customTpl && customTpl.nodeData) {
                  const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title }, p);
                  out += renderNode(virtualNode, indent);
              } else {
                  out += getTemplateCode('lesson', tplL, {
                      num: p.num || "1", title: p.title || "TÊN BÀI",
                      color: p.color, fontFamily: p.fontFamily,
                      numSize: p.numSize, titleSize: p.titleSize
                  });
              }
              break;
          }
          
          case "Section": {
              let tplS = p.template && p.template !== 'global' ? p.template : (rp.tplSection || 'A');
              // Quy đổi ID cũ sang ID cứng mới (Nếu có)
              if (tplS === 'A' || tplS === 'B') tplS = 'sec_star_underline';

              const customTpl = customSectionTpls.find((t: any) => t.id === tplS);
              if (customTpl && customTpl.nodeData) {
                  const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title }, p);
                  out += renderNode(virtualNode, indent);
              } else {
                  out += getTemplateCode('section', tplS, {
                      num: p.num || "I", title: p.title || "TIÊU ĐỀ MỤC",
                      color: p.color, fontFamily: p.fontFamily,
                      numSize: p.numSize, titleSize: p.titleSize
                  });
              }
              break;
          }

          default: break;
      }

      if (p.position === 'absolute') {
          const dx = p.left || "0%";
          const dy = p.top || "0%";
          out = `${indent}#place(top + left, dx: ${dx}, dy: ${dy})[\n${out}${indent}]\n`;
      }
      return out;
  };

  rootNode.children?.forEach(c => {
      if (c.moduleName === "Header") {
          headerCode = renderNode(c);
      } else if (c.moduleName === "Footer") {
          footerCode = renderNode(c);
      }
  });

  if (headerCode || footerCode) {
      code += `#set page(\n`;
      if (headerCode) {
          code += `  header: locate(loc => {\n`;
          code += `    ${headerCode.trim()}\n`;
          code += `  }),\n`;
      }
      if (footerCode) {
          code += `  footer: locate(loc => {\n`;
          code += `    ${footerCode.trim()}\n`;
          code += `  }),\n`;
      }
      code += `)\n\n`;
  }

  rootNode.children?.forEach(c => {
      if (c.moduleName !== "Header" && c.moduleName !== "Footer") {
          code += renderNode(c);
      }
  });

  // Render bảng đáp án nếu được bật (Global setting)
  if (rp.qShowAns === true) {
      code += `\n#v(20pt)\n#vp-print-keys()\n`;
  }

  return code;
};