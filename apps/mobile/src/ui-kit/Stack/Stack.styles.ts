import type { ViewStyle } from 'react-native';
import type { StackProps } from './Stack.types';

export function stackStyle(props: StackProps): ViewStyle {
  return {
    flexDirection: props.direction ?? 'column',
    gap: props.gap ?? 0,
    alignItems: props.align,
    justifyContent: props.justify,
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
  };
}
