import type { ReactNode } from 'react';
import type { FlexStyle, StyleProp, ViewStyle } from 'react-native';

export interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
  align?: FlexStyle['alignItems'];
  justify?: FlexStyle['justifyContent'];
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
}
