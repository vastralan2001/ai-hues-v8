/**
 * ============================================================
 * AIHues v6 - Multi-Theme System
 * 6 Presets: light | dark | forest | sunset | ocean | minimal
 * ============================================================
 *
 * API:
 *   setTheme(themeName)       - Switch to a theme
 *   getCurrentTheme()          - Get current theme name
 *   initThemeSystem()          - Initialize on page load
 *   createThemeSelector()      - Create theme picker UI
 *   showThemeToast(themeName)  - Show switch feedback
 *
 * LocalStorage key: 'aihues_theme_preset'
 */

(function () {
  'use strict';

  /* ========================
   *  Theme Configuration
   * ======================== */
  var THEMES = [
    { id: 'light',   name: '\u9ED8\u8BA4\u6D45\u8272', color: '#ffffff' },
    { id: 'dark',    name: '\u6697\u591C\u7D2B',     color: '#14141f' },
    { id: 'forest',  name: '\u68EE\u6797\u7EFF',     color: '#4caf50' },
    { id: 'sunset',  name: '\u65E5\u843D\u6A59',     color: '#ff8c42' },
    { id: 'ocean',   name: '\u6DF1\u6D77\u84DD',     color: '#42a5f5' },
    { id: 'minimal', name: '\u6781\u7B80\u767D',     color: '#e0e0e0' }
  ];

  var STORAGE_KEY = 'aihues_theme_preset';
  var THEME_ATTR  = 'data-theme';
  var DEFAULT_THEME = 'light';

  /* ========================
   *  Internal Helpers
   * ======================== */

  /**
   * Get a valid theme ID, falling back to DEFAULT_THEME.
   * @param {string} name
   * @returns {string}
   */
  function _resolveTheme(name) {
    var found = false;
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === name) {
        found = true;
        break;
      }
    }
    return found ? name : DEFAULT_THEME;
  }

  /**
   * Find theme config by ID.
   * @param {string} id
   * @returns {Object|null}
   */
  function _getThemeConfig(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return null;
  }

  /**
   * Debounce helper for rapid clicks.
   */
  function _debounce(fn, wait) {
    var timer = null;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  /* ========================
   *  Public API
   * ======================== */

  /**
   * Switch to the specified theme.
   * @param {string} themeName  - One of: light, dark, forest, sunset, ocean, minimal
   */
  function setTheme(themeName) {
    var resolved = _resolveTheme(themeName);
    var root = document.documentElement;

    // Apply theme
    root.setAttribute(THEME_ATTR, resolved);

    // Persist
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch (e) {
      // Storage may be disabled in private mode
    }

    // Update selector UI if present
    _updateSelectorState(resolved);

    // Dispatch custom event for other components to listen
    if (typeof window !== 'undefined') {
      var event;
      try {
        event = new CustomEvent('themechange', {
          detail: { theme: resolved, previous: root.getAttribute(THEME_ATTR) }
        });
      } catch (e) {
        // IE11 fallback
        event = document.createEvent('CustomEvent');
        event.initCustomEvent('themechange', true, true, {
          theme: resolved,
          previous: root.getAttribute(THEME_ATTR)
        });
      }
      window.dispatchEvent(event);
    }

    return resolved;
  }

  /**
   * Get the currently active theme name.
   * @returns {string}
   */
  function getCurrentTheme() {
    return document.documentElement.getAttribute(THEME_ATTR) || DEFAULT_THEME;
  }

  /**
   * Initialize the theme system on page load.
   * Reads saved preference or falls back to system dark mode.
   */
  function initThemeSystem() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Storage unavailable
    }

    var theme;
    if (saved) {
      // Validate saved theme against known presets
      theme = _resolveTheme(saved);
    } else {
      // Fallback to system preference (only for dark vs light)
      var prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : DEFAULT_THEME;
    }

    // Apply immediately to avoid flash
    document.documentElement.setAttribute(THEME_ATTR, theme);

    // Create selector UI if container exists or after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _autoInsertSelector);
    } else {
      _autoInsertSelector();
    }

    return theme;
  }

  /**
   * Show a toast notification when theme changes.
   * @param {string} themeName
   */
  function showThemeToast(themeName) {
    var cfg = _getThemeConfig(themeName);
    if (!cfg) return;

    // Remove existing toast
    var existing = document.querySelector('.aihues-theme-toast');
    if (existing) existing.remove();

    // Create toast element
    var toast = document.createElement('div');
    toast.className = 'aihues-theme-toast show';
    toast.innerHTML = '<span class="toast-dot" style="background:' + cfg.color + '"></span>' +
                      '\u5DF2\u5207\u6362\u5230\uFF1A' + cfg.name;
    document.body.appendChild(toast);

    // Auto-dismiss
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 300);
    }, 1800);
  }

  /* ========================
   *  Theme Selector UI
   * ======================== */

  /**
   * Create the theme selector widget.
   * @param {string|HTMLElement} container  - Target container (selector string or element)
   * @returns {HTMLElement} The selector element
   */
  function createThemeSelector(container) {
    var target = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!target) return null;

    var wrapper = document.createElement('div');
    wrapper.className = 'aihues-theme-selector';
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-label', '\u4E3B\u9898\u5207\u6362');

    var current = getCurrentTheme();

    THEMES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'aihues-theme-btn' + (t.id === current ? ' active' : '');
      btn.setAttribute('data-theme-btn', t.id);
      btn.setAttribute('aria-label', '\u5207\u6362\u5230' + t.name);
      btn.setAttribute('title', t.name);
      btn.type = 'button';

      // Color dot
      btn.style.background = t.color;

      // Tooltip span (for nicer animation than native title)
      var tip = document.createElement('span');
      tip.className = 'theme-tooltip';
      tip.textContent = t.name;
      btn.appendChild(tip);

      // Click handler
      btn.addEventListener('click', function () {
        if (getCurrentTheme() === t.id) return;
        setTheme(t.id);
        showThemeToast(t.id);
      });

      wrapper.appendChild(btn);
    });

    target.appendChild(wrapper);
    return wrapper;
  }

  /**
   * Auto-insert selector into known containers.
   * Looks for: #theme-selector, .theme-toggle, header nav
   */
  function _autoInsertSelector() {
    var el =
      document.getElementById('theme-selector') ||
      document.querySelector('.theme-toggle') ||
      document.querySelector('header nav') ||
      document.querySelector('.header-right') ||
      document.querySelector('.nav-actions');
    if (el) {
      // If the element already has our selector, don't re-create
      if (el.querySelector('.aihues-theme-selector')) return;
      createThemeSelector(el);
    }
  }

  /**
   * Update the active state on selector buttons.
   * @param {string} themeName
   */
  function _updateSelectorState(themeName) {
    var btns = document.querySelectorAll('.aihues-theme-btn');
    btns.forEach(function (btn) {
      if (btn.getAttribute('data-theme-btn') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /* ========================
   *  Backward Compatibility
   *  Keep old toggleTheme() working (cycles light <-> dark)
   * ======================== */

  /**
   * Legacy toggle: cycles between light and dark only.
   * Preserved for backward compatibility with existing code.
   */
  function toggleTheme() {
    var current = getCurrentTheme();
    // If currently on a non-light/dark theme, switch to light first
    var next = (current === 'dark') ? 'light' : 'dark';
    setTheme(next);
    showThemeToast(next);
    return next;
  }

  /**
   * Legacy init function wrapper.
   * Calls initThemeSystem for compatibility.
   */
  function initTheme() {
    return initThemeSystem();
  }

  /**
   * Legacy button updater (no-op, kept for API compatibility).
   */
  function updateThemeBtn(theme) {
    // Selector UI now auto-updates via _updateSelectorState
    // This function is kept so old code doesn't break
  }

  /* ========================
   *  System Preference Sync
   *  Listen for OS dark-mode changes when no saved preference exists
   * ======================== */
  if (window.matchMedia) {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var _handler = function (e) {
      // Only apply if user hasn't manually set a preference
      var saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) {}
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Modern API
    if (mql.addEventListener) {
      mql.addEventListener('change', _handler);
    } else if (mql.addListener) {
      // Older browsers
      mql.addListener(_handler);
    }
  }

  /* ========================
   *  Export to Global Scope
   * ======================== */
  var api = {
    setTheme: setTheme,
    getCurrentTheme: getCurrentTheme,
    initThemeSystem: initThemeSystem,
    createThemeSelector: createThemeSelector,
    showThemeToast: showThemeToast,
    // Legacy aliases
    toggleTheme: toggleTheme,
    initTheme: initTheme,
    updateThemeBtn: updateThemeBtn
  };

  // Expose globally as ThemeSystem namespace
  if (typeof window !== 'undefined') {
    window.ThemeSystem = api;
    // Also expose legacy functions directly on window for old code
    window.setTheme = setTheme;
    window.getCurrentTheme = getCurrentTheme;
    window.initThemeSystem = initThemeSystem;
    window.toggleTheme = toggleTheme;
    window.initTheme = initTheme;
  }

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSystem);
  } else {
    initThemeSystem();
  }

})();
