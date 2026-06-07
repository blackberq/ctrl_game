import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

export type TextVariant = 'title' | 'heading' | 'body' | 'muted' | 'label';

export interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
}
