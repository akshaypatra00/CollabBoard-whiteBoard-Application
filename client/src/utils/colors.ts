export const STROKE_COLORS = [
  '#1e1e1e',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#9c36b5',
  '#e8590c',
  '#099268',
  '#74c0fc',
  '#ffffff',
];

export const FILL_COLORS = [
  'transparent',
  '#ffc9c9',
  '#b2f2bb',
  '#a5d8ff',
  '#ffec99',
  '#eebefa',
  '#ffd8a8',
  '#c3fae8',
  '#f1f3f5',
  '#1e1e1e',
];

export const STROKE_WIDTHS = [2, 4, 8, 16];

export const FONT_SIZES = [16, 20, 28, 36, 48];

export const CURSOR_COLORS = [
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#9c36b5',
  '#099268',
  '#d6336c',
  '#4c6ef5',
];

export const getRandomCursorColor = (): string => {
  const index = Math.floor(Math.random() * CURSOR_COLORS.length);
  return CURSOR_COLORS[index];
};
