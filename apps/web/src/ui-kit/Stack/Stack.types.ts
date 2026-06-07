import type { CSSProperties, ReactNode } from "react";

export interface StackProps {
  children: ReactNode;
  direction?: "row" | "column";
  gap?: number;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: boolean;
  style?: CSSProperties;
}
