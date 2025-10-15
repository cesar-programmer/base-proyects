import * as htmlToImage from 'html-to-image';

function triggerDownload(url, filename, revoke = false) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  if (revoke) {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

const defaultOptions = {
  cacheBust: true,
  backgroundColor: '#ffffff',
  pixelRatio: 2,
  filter: (node) => {
    return !(node?.getAttribute && node.getAttribute('data-no-export') === 'true');
  },
};

export async function downloadNodeAsPng(node, filename, options = {}) {
  const dataUrl = await htmlToImage.toPng(node, { ...defaultOptions, ...options });
  triggerDownload(dataUrl, filename);
}

export async function downloadNodeAsJpeg(node, filename, options = {}) {
  const dataUrl = await htmlToImage.toJpeg(node, { ...defaultOptions, quality: 0.95, ...options });
  triggerDownload(dataUrl, filename);
}

export async function downloadNodeAsSvg(node, filename, options = {}) {
  const dataUrl = await htmlToImage.toSvg(node, { ...defaultOptions, ...options });
  triggerDownload(dataUrl, filename);
}

export async function downloadSvgElement(svgEl, filename) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  triggerDownload(objectUrl, filename, true);
}