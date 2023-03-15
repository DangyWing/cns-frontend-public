export function stringLength(str: string) {
  return [...new Intl.Segmenter().segment(str)].length;
}
