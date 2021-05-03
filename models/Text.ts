import type { i18n } from '@/lib/translate';

export type Text = ReturnType<typeof i18n.translate> | string;
