export interface InputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  /** Uppercase the input as the user types (mirrors RN autoCapitalize). */
  uppercase?: boolean;
}
