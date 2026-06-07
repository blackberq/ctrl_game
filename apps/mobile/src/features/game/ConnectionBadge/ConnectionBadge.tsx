import { View } from 'react-native';
import { selectStatus } from '@ctrl-game/client';
import { Badge } from '../../../ui-kit';
import { useAppSelector } from '../../../hooks';
import { statusTone, styles } from './ConnectionBadge.styles';

export function ConnectionBadge() {
  const status = useAppSelector(selectStatus);
  return (
    <View style={styles.wrap}>
      <Badge tone={statusTone[status]}>{status}</Badge>
    </View>
  );
}
