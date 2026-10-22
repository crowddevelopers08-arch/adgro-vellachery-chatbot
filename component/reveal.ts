export function revealDelay(index: number, step = 0.15) {
  return { animationDelay: `${index * step}s` };
}
