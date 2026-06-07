export interface InputProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  uppercase?: boolean;
}
