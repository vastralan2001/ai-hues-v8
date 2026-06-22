'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

import { t as dictT, type Locale } from './dict';
import { event, GA_EVENTS } from './gtag';

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: (k: string) => dictT('en', k),
  setLocale: () => {},
});

export function I18nProvider({
  children,
  initialLocale = 'en',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (l: Locale) => {
      if (l === locale) return;
      setLocaleState(l);
      document.cookie = `aihues-locale=${l};path=/;max-age=31536000`;
      document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
      event(GA_EVENTS.localeSwitch, { from: locale, to: l });
      window.location.reload();
    },
    [locale]
  );

  const t = useCallback((key: string) => dictT(locale, key), [locale]);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
