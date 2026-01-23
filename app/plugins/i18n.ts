import { createI18n } from 'vue-i18n';
import en from '~/locales/en';
import es from '~/locales/es';
import ru from '~/locales/ru';

const messages = {
  en,
  es,
  ru
} as const;

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages
  });

  vueApp.use(i18n);
});
