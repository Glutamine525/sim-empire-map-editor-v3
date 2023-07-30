import { Base64 } from 'js-base64';
import { hideLoading } from '@/app/editor/_components/loading';
import { BLOCK_PX } from '@/app/editor/_config';
import { MapLength } from '@/app/editor/_map-core/type';
import { rgbToHex } from './color';
import { download, getMapImageName } from './file';

const SVG_XMLNS = 'http://www.w3.org/2000/svg';
const DIV_XMLNS = 'http://www.w3.org/1999/xhtml';

export async function getScreenshot(
  el: HTMLElement,
  scale = 2,
  quality = 0.8,
  rotate45deg = false,
  copyrightId = 'copyright',
) {
  try {
    console.time('getScreenshot');
    const img = await getHtmlImage(el);
    const { width, height } = el.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw 'null context';
    }
    const [w, h] = [width * scale, height * scale];
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    if (rotate45deg) {
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 4);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.rotate(-Math.PI / 4);
      ctx.translate(-w / 2, -h / 2);
      const bgData = ctx.getImageData(0, 0, 1, 1).data!;
      ctx.fillStyle = rgbToHex(bgData[0], bgData[1], bgData[2]);
      ctx.fillRect(0, 0, 400 * scale, h); // remove strange copyright after rotate
      ctx.fillRect(0, h - 400 * scale, w, 400 * scale); // remove strange copyright before rotate
      const copyright = document.getElementById(copyrightId);
      if (!copyright) {
        throw 'copyright dom not found';
      }
      const copyrightImg = await getHtmlImage(copyright);
      ctx.drawImage(copyrightImg, BLOCK_PX * scale, BLOCK_PX * scale, w, h);
    }
    const blob = await new Promise<Blob>(resolve => {
      canvas.toBlob(blob => resolve(blob!), 'image/jpeg', quality);
    });
    download(blob, getMapImageName());
  } finally {
    hideLoading();
    console.timeEnd('getScreenshot');
  }
}

async function getHtmlImage(el: HTMLElement) {
  // const { width, height } = el.getBoundingClientRect();
  const size = BLOCK_PX * (MapLength + 2);
  const html = `
    <svg width="${size}" height="${size}" xmlns="${SVG_XMLNS}">
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
  img.crossOrigin = 'anonymous';
  img.src = `data:image/svg+xml;base64,${Base64.encode(html)}`;
  await new Promise<void>(resolve => {
    img.onload = () => resolve();
  });
  return img;
}

function htmlToText(node: Element | Text) {
  if (node.nodeName === '#text') return (node as Text).data;
  const nodeName = node.nodeName.toLowerCase();
  const className = (node as Element)?.getAttribute('class');
  let attr: string;
  if (className?.includes('debug')) {
    return '';
  } else if (nodeName === 'svg') {
    attr = getAttributeString(node as Element, [
      'xmlns',
      'width',
      'height',
      'version',
    ]);
  } else if (nodeName === 'path') {
    attr = getAttributeString(node as Element, ['d', 'style'], ['fill']);
  } else if (nodeName === 'img') {
    attr = getAttributeString(
      node as Element,
      ['src', 'width', 'height', 'style'],
      ['display'],
    );
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
        'box-shadow',
        'filter',
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
