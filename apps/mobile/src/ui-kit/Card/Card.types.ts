import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type CardTone = 'surface' | 'accent' | 'success';

export interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}
