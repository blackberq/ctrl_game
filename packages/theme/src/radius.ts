/** Corner radius scale. */
export const radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  pill: 999,
} as const;

export type Radius = typeof radius;
export type RadiusToken = keyof Radius;
