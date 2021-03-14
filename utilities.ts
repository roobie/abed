export function padLeft(s: string, width: number): string {
  const diff = width - s.length;
  const out = new Array(1 + width - s.length);
  for (let i = 0; i < diff; ++i) {
    out[i] = " ";
  }
  out[out.length - 1] = s;
  return out.join("");
}
