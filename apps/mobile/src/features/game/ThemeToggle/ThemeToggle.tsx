import { selectColorScheme, toggleColorScheme } from '@ctrl-game/client';
import { Button } from '../../../ui-kit';
import { useAppDispatch, useAppSelector } from '../../../hooks';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const scheme = useAppSelector(selectColorScheme);
  return (
    <Button variant="ghost" onPress={() => dispatch(toggleColorScheme())}>
      {scheme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}
