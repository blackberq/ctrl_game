import type { CSSProperties, ReactNode } from "react";

export type TextVariant = "title" | "heading" | "body" | "muted" | "label";

export interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}
