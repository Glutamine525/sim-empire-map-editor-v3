export function genRandomCode(len: number) {
  return Array(len)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
}
