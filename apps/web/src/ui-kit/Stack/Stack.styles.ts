import type { CSSProperties } from "react";
import type { StackProps } from "./Stack.types";

export function stackStyle(props: StackProps): CSSProperties {
  return {
    display: "flex",
    flexDirection: props.direction ?? "column",
    gap: props.gap ?? 0,
    alignItems: props.align,
    justifyContent: props.justify,
    flexWrap: props.wrap ? "wrap" : "nowrap",
    ...props.style,
  };
}
