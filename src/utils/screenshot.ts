import { Base64 } from 'js-base64';
import { download, getMapImageName } from './file';

const SVG_XMLNS = 'http://www.w3.org/2000/svg';
const DIV_XMLNS = 'http://www.w3.org/1999/xhtml';

export async function getScreenshot(el: HTMLElement) {
  console.time('getScreenshot');
  const { width, height } = el.getBoundingClientRect();
  const html = `
    <svg width="${width}" height="${height}" xmlns="${SVG_XMLNS}">
      <foreignObject width="100%" height="100%">
        <div xmlns="${DIV_XMLNS}">
          ${htmlToText(el)}
        </div>
      </foreignObject>
    </svg>`;

  // const svg = new Blob([html], {
  //   type: 'image/svg+xml;charset=utf-8',
  // });
  // const url = window.URL.createObjectURL(svg);
  // console.log(url);
  // window.open(url);

  const img = new Image();
  const canvas = document.createElement('canvas');
  img.src = `data:image/svg+xml;base64,${Base64.encode(html)}`;
  await new Promise<void>(resolve => {
    img.onload = () => resolve();
  });
  canvas.width = width * 1.5;
  canvas.height = height * 1.5;
  canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>(resolve => {
    canvas.toBlob(blob => resolve(blob!), 'image/jpeg');
  });
  download(blob, getMapImageName());
  console.timeEnd('getScreenshot');
}

function htmlToText(node: Element | Text) {
  if (node.nodeName === '#text') return (node as Text).data;
  const nodeName = node.nodeName.toLowerCase();
  let attr: string;
  if (nodeName === 'svg') {
    attr = getAttributeString(node as Element, [
      'xmlns',
      'width',
      'height',
      'version',
    ]);
  } else if (nodeName === 'path') {
    attr = getAttributeString(node as Element, ['d', 'style'], ['fill']);
  } else {
    attr = getAttributeString(
      node as Element,
      ['style'],
      [
        'box-sizing',
        'position',
        'top',
        'left',
        'display',
        'align-items',
        'justify-content',
        'width',
        'height',
        'font-size',
        'font-family',
        'font-weight',
        'color',
        'text-align',
        'text-shadow',
        'background-color',
        'background-image',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color',
        'border-top-width',
        'border-right-width',
        'border-bottom-width',
        'border-left-width',
        'border-top-style',
        'border-right-style',
        'border-bottom-style',
        'border-left-style',
        'transform',
        'transform-origin',
        'z-index',
        'border-radius',
        'margin',
      ],
    );
  }
  let txt = `<${nodeName} ${attr}>`;
  const { childNodes } = node;
  for (let i = 0, l = childNodes.length; i < l; i++) {
    txt += htmlToText(childNodes[i] as Element | Text);
  }
  txt += `</${nodeName}>`;
  return txt;
}

function getAttributeString(
  node: Element,
  attrNames: string[],
  styleNames?: string[],
) {
  const attrs = [];
  for (const name of attrNames) {
    let v: string;
    if (name === 'style') {
      if (typeof styleNames === 'undefined') {
        throw new Error('[getAttributeString] styleNames undefined!');
      }
      v = getStyleString(node, styleNames);
    } else {
      const attr = node.getAttribute(name);
      if (attr === null) {
        throw new Error(`[getAttributeString] unknown attribution "${name}"!`);
      }
      v = attr;
    }
    attrs.push(`${name}="${v}"`);
  }
  return attrs.join(' ');
}

function getStyleString(node: Element, styleNames: string[]) {
  const css = window.getComputedStyle(node);
  const styles = [];
  for (const name of styleNames) {
    const fName = separatorToCamelName(name);
    let value = css[fName as keyof CSSStyleDeclaration] as string;
    if (['fontFamily', 'backgroundImage'].includes(fName)) {
      value = value.replace(/"/g, '');
    }
    styles.push(`${name}: ${value};`);
  }
  return styles.join(' ');
}

function separatorToCamelName(name: string) {
  const nameArr = name.split(/-/g);
  let newName = '';
  for (let i = 0, j = nameArr.length; i < j; i++) {
    const item = nameArr[i];
    if (i === 0) {
      newName += item;
    } else {
      newName += `${item[0].toLocaleUpperCase()}${item.substring(1)}`;
    }
  }
  return newName;
}
