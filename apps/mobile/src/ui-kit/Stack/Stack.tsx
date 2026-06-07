import { View } from 'react-native';
import { stackStyle } from './Stack.styles';
import type { StackProps } from './Stack.types';

export function Stack(props: StackProps) {
  return <View style={[stackStyle(props), props.style]}>{props.children}</View>;
}
