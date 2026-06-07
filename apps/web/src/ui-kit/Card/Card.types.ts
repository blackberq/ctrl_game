import type { CSSProperties, ReactNode } from "react";

export type CardTone = "surface" | "accent" | "success";

export interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  gap?: number;
  style?: CSSProperties;
}
