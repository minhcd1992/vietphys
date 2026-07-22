import { BuilderNode } from '../store/builderStore';

export const generateTypstCode = (rootNode: BuilderNode): string => {
  let headerCode = ""; let footerCode = ""; let bodyCode = "";

  const formatColor = (c?: string) => {
    if (!c || c === 'none') return 'none';
    if (c.startsWith('#')) return `rgb("${c}")`;
    return c;
  };

  const formatBorder = (style?: string, width?: string, color?: string) => {
    if (!style || style === 'none') return 'none';
    const c = formatColor(color) || 'black';
    if (style === 'solid') return `${width || '1pt'} + ${c}`;
    return `(paint: ${c}, thickness: ${width || '1pt'}, dash: "${style}")`;
  };

  const getSpacingDict = (p: any, prefix: string) => {
    if (p[`${prefix}Linked`] !== false && p[prefix]) return p[prefix];
    const t = p[`${prefix}Top`]; const r = p[`${prefix}Right`];
    const b = p[`${prefix}Bottom`]; const l = p[`${prefix}Left`];
    let dict: string[] = [];
    if (t && t !== '0pt') dict.push(`top: ${t}`);
    if (r && r !== '0pt') dict.push(`right: ${r}`);
    if (b && b !== '0pt') dict.push(`bottom: ${b}`);
    if (l && l !== '0pt') dict.push(`left: ${l}`);
    if (dict.length === 0) return '0pt';
    return `(${dict.join(', ')})`;
  };

  const getRadiusDict = (p: any) => {
    if (p.radiusLinked !== false && p.radius) return p.radius;
    const tl = p.radiusTopLeft; const tr = p.radiusTopRight;
    const br = p.radiusBottomRight; const bl = p.radiusBottomLeft;
    let dict: string[] = [];
    if (tl && tl !== '0pt') dict.push(`top-left: ${tl}`);
    if (tr && tr !== '0pt') dict.push(`top-right: ${tr}`);
    if (br && br !== '0pt') dict.push(`bottom-right: ${br}`);
    if (bl && bl !== '0pt') dict.push(`bottom-left: ${bl}`);
    if (dict.length === 0) return '0pt';
    return `(${dict.join(', ')})`;
  };

  const getBorderDict = (p: any) => {
    if (p.borderLinked !== false) return formatBorder(p.borderStyle, p.borderWidth, p.borderColor);
    const sides: string[] = [];
    ['Top', 'Right', 'Bottom', 'Left'].forEach(s => {
       const b = formatBorder(p[`border${s}Style`], p[`border${s}Width`], p[`border${s}Color`]);
       if (b !== 'none') sides.push(`${s.toLowerCase()}: ${b}`);
    });
    if (sides.length === 0) return 'none';
    return `(${sides.join(', ')})`;
  };

  const renderNode = (node: BuilderNode, indent = ""): string => {
    const p = node.properties;
    let out = "";
    
    if (node.type === "Container") {
      const isHF = node.moduleName === "Header" || node.moduleName === "Footer";
      const flexDir = p.direction === 'row' ? 'ltr' : 'ttb';
      
      let bgCode = formatColor(p.bg);
      if (p.bgType === 'gradient' && p.bgGradientStart && p.bgGradientEnd) {
        bgCode = `gradient.linear(${formatColor(p.bgGradientStart)}, ${formatColor(p.bgGradientEnd)})`;
      }

      let boxProps = `bg: ${bgCode}, padding: ${getSpacingDict(p, 'padding')}, radius: ${getRadiusDict(p)}, border: ${getBorderDict(p)}`;

      let innerContent = "";
      if (p.direction === 'row') {
         const colWidths = node.children?.map(c => (!c.properties.width || c.properties.width === '100%') ? '1fr' : c.properties.width).join(', ') || '1fr';
         innerContent = `${indent}  #grid(columns: (${colWidths}), column-gutter: ${p.gap || '0pt'}, align: horizon)[\n`;
         node.children?.forEach(c => { innerContent += `${indent}    [\n${renderNode(c, indent + "      ")}${indent}    ],\n`; });
         innerContent += `${indent}  ]\n`;
      } else {
         innerContent = `${indent}  #stack(dir: ttb, spacing: ${p.gap || '0pt'})[\n`;
         node.children?.forEach(c => innerContent += renderNode(c, indent + "    "));
         innerContent += `${indent}  ]\n`;
      }

      let boxCode = `${indent}#vp-css-box(${boxProps})[\n${innerContent}${indent}]\n`;
      const marginDict = getSpacingDict(p, 'margin');
      if (!isHF && marginDict !== '0pt') out += `${indent}#pad${marginDict}[\n${boxCode}${indent}]\n`;
      else out += boxCode;
      
    } else {
      const colorArg = p.color ? `, color: ${formatColor(p.color)}` : "";
      const fSize = `${p.fontSize || '12'}${p.fontUnit || 'pt'}`;

      switch (node.moduleName) {
        case "Chapter": out += `${indent}#vp-chapter("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Lesson": out += `${indent}#vp-lesson("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Section": out += `${indent}#vp-section("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Form": out += `${indent}#vp-form("${p.num}", "${p.title}"${colorArg})\n`; break;
        case "Box": out += `${indent}#vp-box(type: "${p.boxType || 'note'}", title: "${p.title}")[\n${indent}  ${p.content}\n${indent}]\n`; break;
        case "Image": out += `${indent}#image("/vietphys-package/img/${p.content}", width: 100%)\n`; break;
        case "Text": out += `${indent}#set text(size: ${fSize}, weight: "${p.fontWeight || 'regular'}", fill: ${formatColor(p.color)})\n${indent}${p.content}\n`; break;
        case "Icon": out += `${indent}#text(size: ${fSize}, fill: ${formatColor(p.color)})[#${p.iconName}()]\n`; break;
      }

      if (p.align && p.align !== 'left') out = `${indent}#align(${p.align})[\n  ${out}${indent}]\n`;
      const marginDict = getSpacingDict(p, 'margin');
      if (marginDict !== '0pt') out = `${indent}#pad${marginDict}[\n${out}${indent}]\n`;
    }

    if (p.position === 'absolute') {
       let dx = p.left && p.left !== '0pt' ? `, dx: ${p.left}` : '';
       let dy = p.top && p.top !== '0pt' ? `, dy: ${p.top}` : '';
       out = `${indent}#place(top + left${dx}${dy})[\n${out}${indent}]\n`;
    }

    return out;
  };

  rootNode.children?.forEach(node => {
    if (node.moduleName === "Header") headerCode += renderNode(node, "    ");
    else if (node.moduleName === "Footer") footerCode += renderNode(node, "    ");
    else bodyCode += renderNode(node, "");
  });

  let code = `#import "vietphys-package/my-macros.typ": *\n#set text(lang: "vi")\n\n`;
  code += `#set page(\n  paper: "a4",\n  margin: (top: 2cm, bottom: 2cm, left: 1.5cm, right: 1.5cm),\n`;
  if (headerCode) code += `  header-ascent: 0pt,\n  header: [\n${headerCode}  ],\n`;
  if (footerCode) code += `  footer-descent: 0pt,\n  footer: [\n${footerCode}  ],\n`;
  code += `)\n\n${bodyCode}`;
  return code;
};