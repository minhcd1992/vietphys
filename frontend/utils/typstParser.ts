import { BuilderNode } from "../store/builderStore";

export const generateTypstCode = (rootNode: BuilderNode): string => {
  let headerCode = "";
  let footerCode = "";
  const rp = rootNode.properties || {};

  // Thầy lưu ý giữ nguyên đường dẫn import này như thầy đã thiết lập
  let code = `#import "/vietphys-package/vietphys.typ": *\n`;
  code += `#set text(lang: "vi")\n`;
  
  if (rp.paperSize === 'a5') {
      code += `#set page(paper: "a5", margin: (top: ${rp.marginTop||'15pt'}, right: ${rp.marginRight||'15pt'}, bottom: ${rp.marginBottom||'15pt'}, left: ${rp.marginLeft||'15pt'}))\n\n`;
  } else {
      code += `#set page(paper: "a4", margin: (top: ${rp.marginTop||'15pt'}, right: ${rp.marginRight||'15pt'}, bottom: ${rp.marginBottom||'15pt'}, left: ${rp.marginLeft||'15pt'}))\n\n`;
  }

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

  const injectDataToTemplate = (tplNode: any, data: {num?: string, title?: string}): any => {
      const clone = JSON.parse(JSON.stringify(tplNode));
      const replaceText = (str: string) => {
          if (!str || typeof str !== 'string') return str;
          return str.replace(/\{\{num\}\}/g, data.num || '').replace(/\{\{title\}\}/g, data.title || '');
      };
      const traverse = (n: any) => {
          if (n.properties) {
              if (n.properties.content) n.properties.content = replaceText(n.properties.content);
              if (n.properties.title) n.properties.title = replaceText(n.properties.title);
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
      } 
      // BỘ LỌC VÀ GIẢI MÃ SVG HOÀN TOÀN MỚI
      else if (p.bgType === 'image' && p.bgImage) {
          bgStr = "none"; 
          let cleanBgImage = extractImgString(p.bgImage);
          let imgTypst = "";

          if (cleanBgImage.startsWith('<svg')) {
              let escapedSvg = cleanBgImage.replace(/"/g, '\\"').replace(/\n/g, ' ');
              // Thêm tường minh định dạng format: "svg"
              imgTypst = `image.decode("${escapedSvg}", format: "svg")`;
          } 
          else if (cleanBgImage.startsWith('data:image/svg+xml')) {
              let isBase64 = cleanBgImage.includes(';base64,');
              let svgData = cleanBgImage.substring(cleanBgImage.indexOf(',') + 1);
              let rawSvg = "";

              if (isBase64) {
                  try { 
                      // Mẹo giải mã Base64 an toàn tuyệt đối cho Javascript
                      rawSvg = decodeURIComponent(escape(atob(svgData))); 
                  } catch(e) {
                      try { rawSvg = atob(svgData); } catch (err) { rawSvg = ""; }
                  }
              } else {
                  try { rawSvg = decodeURIComponent(svgData); }
                  catch (e) { rawSvg = unescape(svgData); }
              }

              let escapedSvg = rawSvg.replace(/"/g, '\\"').replace(/\n/g, ' ');
              // Thêm tường minh định dạng format: "svg"
              imgTypst = `image.decode("${escapedSvg}", format: "svg")`;
          } 
          else if (cleanBgImage.startsWith('data:image/')) {
              imgTypst = `none /* Ảnh Base64 quá dài, Typst cần file path để xuất PDF. Vui lòng dán Link file hoặc dùng SVG Pattern! */`;
          } 
          else {
              imgTypst = `image("${escapeTypstString(cleanBgImage)}")`;
          }

          if (!imgTypst.startsWith('none')) {
              if (p.bgImageDisplay === 'pattern') {
                  bgStr = `pattern(size: (${p.bgPatternW || '60pt'}, ${p.bgPatternH || '60pt'}))[#${imgTypst}]`;
              } else {
                  let fitStr = "";
                  if (p.bgImageDisplay === 'cover' || !p.bgImageDisplay) fitStr = `, width: 100%, height: 100%, fit: "cover"`;
                  else if (p.bgImageDisplay === 'contain') fitStr = `, width: 100%, height: 100%, fit: "contain"`;
                  else if (p.bgImageDisplay === 'stretch') fitStr = `, width: 100%, height: 100%`;

                  placeImageOverlay = `#place(center + horizon)[#${imgTypst.replace(/\)$/, fitStr + ')')}]\n${indent}      `;
              }
          }
      } 
      else {
          bgStr = formatColor(p.bg);
      }

      let borderStr = "";
      if (p.borderLinked !== false && p.borderStyle && p.borderStyle !== 'none') {
         borderStr = `border: ${formatBorder(p)}, `;
      } else if (p.borderLinked === false) {
         borderStr = `border: (top: ${formatBorder(p, 'Top')}, right: ${formatBorder(p, 'Right')}, bottom: ${formatBorder(p, 'Bottom')}, left: ${formatBorder(p, 'Left')}), `;
      }

      let radiusStr = p.radiusLinked !== false ? p.radius || '0pt' : `(top-left: ${p.radiusTopLeft||'0pt'}, top-right: ${p.radiusTopRight||'0pt'}, bottom-right: ${p.radiusBottomRight||'0pt'}, bottom-left: ${p.radiusBottomLeft||'0pt'})`;
      let paddingStr = p.paddingLinked !== false ? p.padding || '0pt' : `(top: ${p.paddingTop||'0pt'}, right: ${p.paddingRight||'0pt'}, bottom: ${p.paddingBottom||'0pt'}, left: ${p.paddingLeft||'0pt'})`;
      let marginStr = p.marginLinked !== false ? p.margin || '0pt' : `(top: ${p.marginTop||'0pt'}, right: ${p.marginRight||'0pt'}, bottom: ${p.marginBottom||'0pt'}, left: ${p.marginLeft||'0pt'})`;

      switch (node.moduleName) {
          case "Container": {
              let inner = "";
              if (node.children && node.children.length > 0) {
                  inner = node.children.map((c: any) => renderNode(c, indent + "        ")).join("");
              }
              
              let containerCode = "";
              if (p.layoutType === 'grid') {
                 let cols = p.gridCols || "1fr 1fr";
                 let typstCols = cols.split(/\s+/).filter(Boolean).join(", ");
                 containerCode = `#grid(columns: (${typstCols}), column-gutter: ${p.gap || "0pt"}, row-gutter: ${p.gap || "0pt"}, align: ${p.align || 'left'})[\n${inner}${indent}      ]`;
              } else {
                 if (p.direction === 'row') {
                     containerCode = `#stack(dir: ltr, spacing: ${p.gap || "0pt"})[\n${inner}${indent}      ]`;
                 } else {
                     containerCode = `#stack(dir: ttb, spacing: ${p.gap || "0pt"})[\n${inner}${indent}      ]`;
                 }
              }

              if (p.height && p.height !== 'auto') {
                  containerCode = `#block(height: ${p.height})[\n${indent}        ${containerCode}\n${indent}      ]`;
              }

              out += `${indent}#pad(${marginStr})[\n`;
              out += `${indent}  #vp-css-box(bg: ${bgStr}, ${borderStr}radius: ${radiusStr}, padding: ${paddingStr}, width: ${p.width || '100%'})[\n`;
              out += `${indent}    #align(${p.align || "left"})[\n`;
              out += `${indent}      ${placeImageOverlay}${containerCode}\n`;
              out += `${indent}    ]\n`;
              out += `${indent}  ]\n`;
              out += `${indent}]\n`;
              break;
          }
          
          case "Text": {
              let txtContent = p.content || "";
              let fontCode = p.fontFamily ? `font: "${p.fontFamily}", ` : "";
              let weightCode = p.fontWeight === '900' ? 'black' : (p.fontWeight === 'bold' ? 'bold' : 'regular');
              let trackingCode = p.letterSpacing && p.letterSpacing !== '0pt' ? `tracking: ${p.letterSpacing}, ` : "";

              let textCode = `#text(${fontCode}fill: ${formatColor(p.color || '#000000')}, size: ${p.fontSize || 12}${p.fontUnit || 'pt'}, weight: "${weightCode}", ${trackingCode})[\n`;
              
              txtContent = txtContent
                  .replace(/\*(.*?)\*/g, '#strong[$1]')
                  .replace(/_(.*?)_/g, '#emph[$1]')
                  .replace(/#text\(\s*size:\s*([^,)]+)[^)]*\)\s*\[(.*?)\]/g, '#text(size: $1)[$2]')
                  .replace(/<br \/>/g, '\\ ')
                  .replace(/\n/g, '\n' + indent + '          ');

              textCode += `${indent}          ${txtContent}\n`;
              textCode += `${indent}        ]`;

              if (p.height && p.height !== 'auto') {
                  textCode = `#block(height: ${p.height})[\n${indent}        ${textCode}\n${indent}      ]`;
              }

              out += `${indent}#pad(${marginStr})[\n`;
              out += `${indent}  #vp-css-box(bg: ${bgStr}, ${borderStr}radius: ${radiusStr}, padding: ${paddingStr}, width: ${p.width || '100%'})[\n`;
              out += `${indent}    #align(${p.align || "left"})[\n`;
              out += `${indent}      ${placeImageOverlay}${textCode}\n`;
              out += `${indent}    ]\n`;
              out += `${indent}  ]\n`;
              out += `${indent}]\n`;
              break;
          }
          
          case "Chapter": {
              const tplC = p.template && p.template !== 'global' ? p.template : (rp.tplChapter || 'A');
              const colC = formatColor(p.color || '#1890FF');
              if (tplC === 'A') {
                  out += `${indent}#v(15pt)\n${indent}#vp-css-box(align(center)[#upper("${escapeTypstString(p.title)}")], border: (paint: ${colC}, thickness: 1pt, dash: "dashed"), padding: (top: 22pt, bottom: 15pt, x: 15pt), text-color: ${colC}, text-size: 22pt, label-top-left: (text: "Chương ${escapeTypstString(p.num)}", bg: ${colC}, color: white, size: 14pt, dx: 15pt, dy: -14pt))\n${indent}#v(10pt)\n`;
              } else if (tplC === 'B') {
                  out += `${indent}#v(10pt)\n${indent}#vp-css-box(bg: ${colC}, padding: 20pt, radius: 8pt)[\n${indent}  #align(center)[\n${indent}    #text(fill: white.darken(20%), size: 14pt, weight: "bold")[CHƯƠNG ${escapeTypstString(p.num)}]\n${indent}    #v(5pt)\n${indent}    #text(fill: white, size: 24pt, weight: "bold")[#upper("${escapeTypstString(p.title)}")]\n${indent}  ]\n${indent}]\n${indent}#v(10pt)\n`;
              } else {
                  const customTpl = customChapterTpls.find((t: any) => t.id === tplC);
                  if (customTpl && customTpl.nodeData) {
                      const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title });
                      out += renderNode(virtualNode, indent);
                  } else {
                      out += `${indent}#text(fill: red)[Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!]\n`;
                  }
              }
              break;
          }
          
          case "Lesson": {
              const tplL = p.template && p.template !== 'global' ? p.template : (rp.tplLesson || 'A');
              const colL = formatColor(p.color || '#1890FF');
              if (tplL === 'A') {
                  out += `${indent}#v(12pt)\n${indent}#vp-css-box([BÀI ${escapeTypstString(p.num)}: #upper("${escapeTypstString(p.title)}")], icon: fa-pen(), bg: ${colL}, border: (left: 6pt + rgb("#FF7A1D")), shadow: (dx: 3pt, dy: 3pt, color: black.lighten(20%)), padding: (x: 16pt, y: 12pt), text-color: white, text-size: 16pt)\n${indent}#v(8pt)\n`;
              } else if (tplL === 'B') {
                  out += `${indent}#v(10pt)\n${indent}#vp-css-box(bg: ${colL}.lighten(90%), border: 1.5pt + ${colL}, radius: 20pt, padding: (x: 16pt, y: 10pt), text-color: ${colL}, text-size: 16pt)[#align(center)[BÀI ${escapeTypstString(p.num)}: ${escapeTypstString(p.title)}]]\n${indent}#v(10pt)\n`;
              } else {
                  const customTpl = customLessonTpls.find((t: any) => t.id === tplL);
                  if (customTpl && customTpl.nodeData) {
                      const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title });
                      out += renderNode(virtualNode, indent);
                  } else {
                      out += `${indent}#text(fill: red)[Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!]\n`;
                  }
              }
              break;
          }
          
          case "Section": {
              const tplS = p.template && p.template !== 'global' ? p.template : (rp.tplSection || 'A');
              const colS = formatColor(p.color || '#1890FF');
              if (tplS === 'A') {
                  out += `${indent}#v(12pt)\n${indent}#grid(columns: (auto, 1fr), column-gutter: 10pt, align: (center + horizon, left + horizon), box(fill: ${colS}, radius: 4pt, width: 2.2em, height: 2.2em)[#place(center + horizon)[#text(fill: white, size: 1.2em)[#fa-star()]]], block(width: 100%, stroke: (bottom: 1.5pt + ${colS}.lighten(30%)), inset: (bottom: 8pt))[#text(fill: ${colS}, weight: "bold", size: 14pt)[${escapeTypstString(p.num)}. #upper("${escapeTypstString(p.title)}")]])\n${indent}#v(6pt)\n`;
              } else if (tplS === 'B') {
                  out += `${indent}#v(10pt)\n${indent}#block(width: 100%, stroke: (bottom: 2pt + ${colS}), inset: (bottom: 5pt))[#text(fill: ${colS}, size: 16pt, weight: "bold")[${escapeTypstString(p.num)}. ${escapeTypstString(p.title)}]]\n${indent}#v(8pt)\n`;
              } else {
                  const customTpl = customSectionTpls.find((t: any) => t.id === tplS);
                  if (customTpl && customTpl.nodeData) {
                      const virtualNode = injectDataToTemplate(customTpl.nodeData, { num: p.num, title: p.title });
                      out += renderNode(virtualNode, indent);
                  } else {
                      out += `${indent}#text(fill: red)[Lỗi: Không tìm thấy Mẫu Tùy Chỉnh!]\n`;
                  }
              }
              break;
          }
          
          case "RawTypst": {
              out += `${indent}${p.content || ''}\n`;
              break;
          }
          
          case "Icon": {
              let icColor = p.color ? `fill: ${formatColor(p.color)}, ` : "";
              let icSize = p.fontSize ? `size: ${p.fontSize}${p.fontUnit||'pt'}, ` : "";
              out += `${indent}#text(${icColor}${icSize})[#${p.iconName || 'fa-star'}()]\n`;
              break;
          }
          
          case "Image": {
             let w = p.width || "100";
             out += `${indent}#align(${p.align || 'center'})[\n`;
             out += `${indent}  #image("${p.content || 'placeholder.png'}", width: ${w}%)\n`;
             out += `${indent}]\n`;
             break;
          }
          
          case "Box": {
              let bType = p.boxType || 'info';
              let bColor = bType === 'warning' ? '#FF3B1D' : bType === 'tip' ? '#52C41A' : '#1890FF';
              let bIcon = bType === 'warning' ? 'fa-exclamation-triangle()' : bType === 'tip' ? 'fa-lightbulb()' : 'fa-bookmark()';
              out += `${indent}#vp-css-box(bg: ${formatColor(bColor)}.lighten(90%), border: (left: 4pt + ${formatColor(bColor)}), padding: 12pt, radius: (right: 4pt))[\n`;
              out += `${indent}  #text(fill: ${formatColor(bColor)}, weight: "bold", size: 12pt)[#${bIcon} ${escapeTypstString(p.title)}]\n`;
              out += `${indent}  #v(4pt)\n`;
              out += `${indent}  #text(fill: luma(60))[\n`;
              let bContent = (p.content || "").replace(/\n/g, '\n' + indent + '    ');
              out += `${indent}    ${bContent}\n`;
              out += `${indent}  ]\n`;
              out += `${indent}]\n`;
              break;
          }
          
          case "QuestionBlock": {
              out += `${indent}#v(10pt)\n`;
              const qs = p.questionData || [];
              if (qs.length === 0) {
                  out += `${indent}// Khối câu hỏi trống\n`;
                  break;
              }
              
              const gColor = rp.qColor || '#1890FF';
              const gBg = rp.qBg || 'none';
              const lColor = rp.qLevelColor || '#6f42c1';
              const sColor = rp.qSourceColor || '#52C41A';

              qs.forEach((q: any, i: number) => {
                  out += `${indent}#vp-question-box(\n`;
                  out += `${indent}  prefix: "${escapeTypstString(p.prefix || 'Câu')} ${i + 1}",\n`;
                  out += `${indent}  color: ${formatColor(p.color || gColor)},\n`;
                  out += `${indent}  bg: ${formatColor(p.bg || gBg)},\n`;
                  if (q.level && rp.qShowLevel !== false) out += `${indent}  level: "${escapeTypstString(q.level)}", level-color: ${formatColor(p.levelColor || lColor)},\n`;
                  if (q.topic && rp.qShowSource !== false) out += `${indent}  source: "${escapeTypstString(q.topic)}", source-color: ${formatColor(p.sourceColor || sColor)},\n`;
                  out += `${indent})[\n`;
                  
                  let stem = (q.stem || "").replace(/\n/g, '\n' + indent + '  ');
                  out += `${indent}  ${stem}\n`;
                  out += `${indent}]\n`;

                  if (p.showOptions !== false && q.options && q.options.length > 0 && q.options[0] !== "") {
                      const optCols = p.optionsLayout || 4;
                      out += `${indent}#v(6pt)\n`;
                      out += `${indent}#vp-mcq-grid(columns: ${optCols})[\n`;
                      q.options.forEach((opt: string, idx: number) => {
                          let oText = (opt || "").replace(/\n/g, '\n' + indent + '  ');
                          out += `${indent}  #vp-mcq-opt("${String.fromCharCode(65 + idx)}")[\n`;
                          out += `${indent}    ${oText}\n`;
                          out += `${indent}  ]\n`;
                      });
                      out += `${indent}]\n`;
                  }

                  if (p.showSolution && q.solution) {
                      out += `${indent}#vp-solution(color: ${formatColor(p.color || gColor)})[\n`;
                      let sol = (q.solution || "").replace(/\n/g, '\n' + indent + '  ');
                      out += `${indent}  ${sol}\n`;
                      out += `${indent}]\n`;
                  }
                  out += `${indent}#v(10pt)\n`;
              });
              break;
          }
          default:
              break;
      }

      if (p.position === 'absolute') {
          const dx = p.left || "0%";
          const dy = p.top || "0%";
          out = `${indent}#place(top + left, dx: ${dx}, dy: ${dy})[\n${out}${indent}]\n`;
      }

      return out;
  };

  if (rootNode.children) {
      rootNode.children.forEach((child: any) => {
          if (child.moduleName === "Header") {
              let content = "";
              if (child.children) content = child.children.map((c: any) => renderNode(c, "    ")).join("");
              headerCode = `#set page(header: [\n${content}\n])\n`;
          } else if (child.moduleName === "Footer") {
              let content = "";
              if (child.children) content = child.children.map((c: any) => renderNode(c, "    ")).join("");
              footerCode = `#set page(footer: [\n${content}\n])\n`;
          }
      });
  }

  code += headerCode;
  code += footerCode;
  code += `\n`;
  
  if (rootNode.children) {
      rootNode.children.forEach((child: any) => {
          code += renderNode(child, "");
      });
  }

  return code;
};