import { stackStyle } from "./Stack.styles";
import type { StackProps } from "./Stack.types";

export function Stack(props: StackProps) {
  return <div style={stackStyle(props)}>{props.children}</div>;
}
