declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown> | undefined
    ) => void;
    dataLayer: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  if (
    typeof window === 'undefined' ||
    !GA_ID ||
    typeof window.gtag !== 'function'
  )
    return;
  window.gtag('config', GA_ID, { page_path: url });
};

export const event = (
  action: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function')
    return;
  window.gtag('event', action, params);
};

export const GA_EVENTS = {
  toolUse: 'tool_use',
  toolClick: 'tool_click',
  toolGenerate: 'tool_generate',
  toolCopy: 'tool_copy',
  gamePlay: 'game_play',
  gameCheckin: 'game_checkin',
  newsletterSubscribe: 'newsletter_subscribe',
  localeSwitch: 'locale_switch',
  themeSwitch: 'theme_switch',
  categoryFilter: 'category_filter',
  priceFilter: 'price_filter',
  search: 'search',
  wishlistSubmit: 'wishlist_submit',
  wishlistVote: 'wishlist_vote',
  pageDuration: 'page_duration',
} as const;
