/**
 * AIHues English-only compatibility shim.
 *
 * Older static pages still call window.i18n.t() or toggleLang(). Keep those
 * calls harmless while forcing the document language to English.
 */
(function () {
  'use strict';

  const i18n = {
    lang: 'en',
    init() {
      document.documentElement.lang = 'en';
      this.updateToggleButton();
    },
    toggle() {
      this.init();
    },
    apply() {
      this.init();
    },
    updateToggleButton() {
      document.querySelectorAll('.lang-btn, .lang-toggle').forEach((btn) => {
        btn.textContent = 'EN';
        btn.setAttribute('aria-label', 'English');
      });
    },
    t(en) {
      return en;
    },
  };

  window.toggleLang = function () {
    i18n.toggle();
  };

  window.i18n = i18n;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }
})();
