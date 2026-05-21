/**
 * AIHues i18n System v3 — 中英文切换系统
 * 
 * Features:
 * - Auto-caches English originals on first load
 * - Supports data-zh attributes for text, placeholders, titles
 * - Gracefully handles pages with NO data-zh (won't error)
 * - Persists language choice across pages via localStorage
 * 
 * Usage: <span data-zh="中文">English</span>
 * Toggle: <button class="lang-btn" onclick="toggleLang()">中文</button>
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'aihues_lang';

  // ── Detect language ──────────────────────────────────────────────────────
  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'zh') return saved;
    return (navigator.language && navigator.language.startsWith('zh')) ? 'zh' : 'en';
  }

  // ── Main i18n object ─────────────────────────────────────────────────────
  const i18n = {
    lang: detectLang(),
    _cached: false,

    /** Initialize — call once after DOM ready */
    init() {
      this._cacheEnglish();
      this.apply();
      this.updateToggleButton();
    },

    /** Toggle EN ↔ ZH */
    toggle() {
      this.lang = this.lang === 'en' ? 'zh' : 'en';
      localStorage.setItem(STORAGE_KEY, this.lang);
      this.apply();
      this.updateToggleButton();
    },

    /** Cache English originals (runs once) */
    _cacheEnglish() {
      if (this._cached) return;

      try {
        document.querySelectorAll('[data-zh]').forEach((el) => {
          if (!el.dataset.en) {
            el.dataset.en = el.textContent.trim();
          }
        });

        document.querySelectorAll('[data-zh-placeholder]').forEach((el) => {
          if (!el.dataset.enPlaceholder) {
            el.dataset.enPlaceholder = el.placeholder || '';
          }
        });

        const title = document.querySelector('title[data-zh]');
        if (title && !title.dataset.en) {
          title.dataset.en = title.textContent.trim();
        }
      } catch (e) {
        console.warn('[i18n] cache error:', e);
      }

      this._cached = true;
    },

    /** Apply current language to the page */
    apply() {
      document.documentElement.lang = this.lang === 'zh' ? 'zh-CN' : 'en';

      try {
        // Toggle data-zh elements
        document.querySelectorAll('[data-zh]').forEach((el) => {
          if (this.lang === 'zh' && el.dataset.zh) {
            el.textContent = el.dataset.zh;
          } else if (el.dataset.en) {
            el.textContent = el.dataset.en;
          }
        });

        // Toggle placeholders
        document.querySelectorAll('[data-zh-placeholder]').forEach((el) => {
          if (this.lang === 'zh' && el.dataset.zhPlaceholder) {
            el.placeholder = el.dataset.zhPlaceholder;
          } else if (el.dataset.enPlaceholder !== undefined) {
            el.placeholder = el.dataset.enPlaceholder;
          }
        });

        // Toggle title
        const title = document.querySelector('title[data-zh]');
        if (title) {
          if (this.lang === 'zh' && title.dataset.zh) {
            document.title = title.dataset.zh;
          } else if (title.dataset.en) {
            document.title = title.dataset.en;
          }
        }
      } catch (e) {
        console.warn('[i18n] apply error:', e);
      }
    },

    /** Update toggle button text */
    updateToggleButton() {
      const btn = document.querySelector('.lang-btn');
      if (btn) {
        btn.textContent = this.lang === 'en' ? '中文' : 'EN';
      }
    },

    /** Translate helper for JS-generated content */
    t(en, zh) {
      return this.lang === 'zh' ? zh : en;
    }
  };

  // ── Global toggle function ───────────────────────────────────────────────
  window.toggleLang = function () {
    i18n.toggle();
  };

  // ── Expose i18n globally ─────────────────────────────────────────────────
  window.i18n = i18n;

  // ── Auto-init ────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }
})();
