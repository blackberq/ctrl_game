import { Card, Text, useTheme, useThemedStyles } from '../../../ui-kit';
import { makeStyles } from './TopicBanner.styles';
import type { TopicBannerProps } from './TopicBanner.types';

export function TopicBanner({ topic }: TopicBannerProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Card tone="accent" gap={theme.spacing.xs}>
      <Text variant="label" color={theme.colors.primary}>
        ТЕМА РОЗПОВІДІ
      </Text>
      <Text style={styles.topicText}>{topic}</Text>
    </Card>
  );
}
