/** Font sizes in px/dp. */
export const fontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 26,
  display: 40,
} as const;

/**
 * Font weights as strings — valid for both DOM (`fontWeight`) and React Native
 * (`TextStyle["fontWeight"]`).
 */
export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export type FontSize = typeof fontSize;
export type FontSizeToken = keyof FontSize;
export type FontWeight = typeof fontWeight;
export type FontWeightToken = keyof FontWeight;
