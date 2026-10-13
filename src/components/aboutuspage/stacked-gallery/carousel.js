export const wrapIndex = (index, count) => ((index % count) + count) % count;

export function cardPosition(index, active, count, width, tablet) {
  let position = index - active;
  if (position > count / 2) position -= count;
  if (position < -count / 2) position += count;
  const firstScale = 0.88;
  const secondScale = 0.77;
  const firstX = width / 2 - width * firstScale / 2 + width * firstScale * (tablet ? 0.1 : 0.2);
  const secondX = firstX + width * (firstScale - secondScale) / 2 + width * secondScale * (tablet ? 0.08 : 0.15);
  const distance = Math.abs(position);
  return {
    x: distance === 0 ? 0 : Math.sign(position) * (distance === 1 ? firstX : secondX),
    scale: distance === 0 ? 1 : distance === 1 ? firstScale : secondScale,
    zIndex: distance === 0 ? 5 : distance === 1 ? 4 : 3,
    opacity: distance <= 2 ? 1 : 0,
  };
}
