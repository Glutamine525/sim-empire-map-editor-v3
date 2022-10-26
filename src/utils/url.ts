export function getImgUrl(name: string) {
  const url = `/assets/img/${name}`;
  return process.env.NODE_ENV === 'production' ? url : new URL(url, import.meta.url).href;
}
