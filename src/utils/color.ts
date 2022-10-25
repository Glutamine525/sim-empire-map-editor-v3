export function getColors() {
  const getter = (name: string) =>
    `rgb(${getComputedStyle(document.body).getPropertyValue(name).replace(/\s/, '')})`;

  return {
    backgroundOuterColor: getter('--gray-2'),
    backgroundInnerColor: getter('--gray-3'),
    borderColor: getter('--gray-2'),
  };
}
