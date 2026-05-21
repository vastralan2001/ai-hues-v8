/**
 * AIHues Achievement System v1
 * Complete achievement tracking, unlocking, and display system.
 *
 * Features:
 * - 10 unlockable achievements with progress tracking
 * - localStorage persistence (keys prefixed with aihues_)
 * - Automatic visit & usage tracking on page load
 * - Toast notifications on unlock (slide-in + shimmer, auto-dismiss)
 * - Achievement panel rendering (profile page compatible)
 * - i18n support via data-zh attributes & window.i18n
 *
 * API:
 *   Achievements.trackToolUsage(toolUrl, category)
 *   Achievements.trackGameUsage(gameUrl)
 *   Achievements.trackVisit()
 *   Achievements.checkAchievements()
 *   Achievements.getAchievements()
 *   Achievements.getUnlockedCount()
 *   Achievements.resetAchievements()
 *   Achievements.renderAchievementsPanel(containerId)
 */
(function () {
  'use strict';

  /* ============================================================
     CONSTANTS
     ============================================================ */
  var LS_ACHIEVEMENTS = 'aihues_achievements';
  var LS_TOOL_USAGE   = 'aihues_tool_usage';
  var LS_VISITS       = 'aihues_visits';
  var LS_GAMES_PLAYED = 'aihues_games_played';
  var LS_WISHLIST     = 'aihues_wishlist';

  /* ---------- Achievement definitions ---------- */
  var ACHIEVEMENT_DEFS = [
    {
      id:    'first-visit',
      icon:  '\uD83C\uDF89',
      name:  'First Visit',
      zhName:'初次见面',
      desc:  'Visit AIHues for the first time',
      zhDesc:'首次访问 AIHues 网站',
      type:  'instant',
      check: function () { return true; }
    },
    {
      id:    'tool-master',
      icon:  '\uD83D\uDEE0\uFE0F',
      name:  'Tool Master',
      zhName:'工具达人',
      desc:  'Use 10 different tools',
      zhDesc:'累计使用 10 个不同工具',
      type:  'progress',
      target:10,
      check: function (state) {
        var keys = Object.keys(state.toolUsage || {});
        return keys.filter(function (k) { return !k.startsWith('games/'); }).length;
      }
    },
    {
      id:    'explorer',
      icon:  '\uD83D\uDD0D',
      name:  'Explorer',
      zhName:'探索者',
      desc:  'Use 25 different tools',
      zhDesc:'累计使用 25 个不同工具',
      type:  'progress',
      target:25,
      check: function (state) {
        var keys = Object.keys(state.toolUsage || {});
        return keys.filter(function (k) { return !k.startsWith('games/'); }).length;
      }
    },
    {
      id:    'all-rounder',
      icon:  '\uD83C\uDF1F',
      name:  'All-Rounder',
      zhName:'全能选手',
      desc:  'Use tools from 4 different categories',
      zhDesc:'使用过 4 个不同分类的工具',
      type:  'progress',
      target:4,
      check: function (state) {
        var keys = Object.keys(state.toolUsage || {});
        var cats = new Set();
        keys.forEach(function (url) {
          cats.add(inferCategory(url));
        });
        return cats.size;
      }
    },
    {
      id:    'night-owl',
      icon:  '\uD83E\uDD89',
      name:  'Night Owl',
      zhName:'夜猫子',
      desc:  'Use a tool between 22:00 and 06:00',
      zhDesc:'在 22:00-06:00 之间使用工具',
      type:  'instant',
      check: function (state) {
        return (state.toolUsage || {})['_nightOwl'] === true;
      }
    },
    {
      id:    'early-bird',
      icon:  '\uD83D\uDC26',
      name:  'Early Bird',
      zhName:'早鸟',
      desc:  'Use a tool between 06:00 and 09:00',
      zhDesc:'在 06:00-09:00 之间使用工具',
      type:  'instant',
      check: function (state) {
        return (state.toolUsage || {})['_earlyBird'] === true;
      }
    },
    {
      id:    'streak-7',
      icon:  '\uD83D\uDD25',
      name:  'Streak Master',
      zhName:'连胜王',
      desc:  'Visit for 7 consecutive days',
      zhDesc:'连续 7 天访问网站',
      type:  'progress',
      target:7,
      check: function (state) {
        return calculateStreak(state.visits || []);
      }
    },
    {
      id:    'collector',
      icon:  '\uD83D\uDCCC',
      name:  'Collector',
      zhName:'收藏家',
      desc:  'Save 3 tools to wishlist',
      zhDesc:'收藏/许愿 3 个工具',
      type:  'progress',
      target:3,
      check: function (state) {
        try {
          var w = JSON.parse(localStorage.getItem(LS_WISHLIST) || '[]');
          return Array.isArray(w) ? w.length : 0;
        } catch (e) { return 0; }
      }
    },
    {
      id:    'gamer',
      icon:  '\uD83C\uDFAE',
      name:  'Gamer',
      zhName:'游戏玩家',
      desc:  'Play any mini game',
      zhDesc:'玩过任意小游戏',
      type:  'instant',
      check: function (state) {
        var keys = Object.keys(state.gamesPlayed || {});
        return keys.length > 0;
      }
    },
    {
      id:    'power-user',
      icon:  '\u26A1',
      name:  'Power User',
      zhName:'深度用户',
      desc:  'Use 5+ tools in a single day',
      zhDesc:'单日使用 5 个以上工具',
      type:  'instant',
      check: function (state) {
        return (state.toolUsage || {})['_powerUser'] === true;
      }
    }
  ];

  /* ---------- Tool → category map (derived from index.html TOOLS array) ---------- */
  var TOOL_CATEGORIES = {
    /* Developer */
    'tools/json.html':'Developer','tools/jwt.html':'Developer','tools/regex.html':'Developer',
    'tools/uuid.html':'Developer','tools/timestamp.html':'Developer','tools/sha256.html':'Developer',
    'tools/base64.html':'Developer','tools/url-encode.html':'Developer','tools/base-convert.html':'Developer',
    'tools/password-gen.html':'Developer','tools/http-status.html':'Developer','tools/html-entity.html':'Developer',
    'tools/cron-parser.html':'Developer','tools/image-to-base64.html':'Developer','tools/css-gradient.html':'Developer',
    'tools/color-convert.html':'Developer','tools/csv-json.html':'Developer','tools/ip-lookup.html':'Developer',
    'tools/curl-gen.html':'Developer','tools/diff-pro.html':'Developer','tools/unit-convert.html':'Developer',
    'tools/code-explain.html':'Developer','tools/code-review.html':'Developer','tools/shell.html':'Developer',
    'tools/sql.html':'Developer','tools/git-commit.html':'Developer',
    /* Writing */
    'tools/markdown.html':'Writing','tools/fullwidth.html':'Writing','tools/word-count.html':'Writing',
    'tools/diff.html':'Writing','tools/title-case.html':'Writing','tools/lorem-ipsum.html':'Writing',
    'tools/readability.html':'Writing','tools/blog-outline.html':'Writing','tools/changelog.html':'Writing',
    'tools/docs.html':'Writing','tools/faq.html':'Writing','tools/newsletter.html':'Writing',
    'tools/tagline.html':'Writing','tools/tldr.html':'Writing','tools/yt-script.html':'Writing',
    'tools/pr-desc.html':'Writing','tools/linkedin.html':'Writing','tools/lp-hero.html':'Writing',
    'tools/meta.html':'Writing','tools/ad-copy.html':'Writing','tools/alt-text.html':'Writing',
    'tools/cold-email.html':'Writing','tools/push.html':'Writing','tools/video-title.html':'Writing',
    'tools/humanize.html':'Writing','tools/seo-title.html':'Writing','tools/x-post.html':'Writing',
    'tools/pseudo.html':'Writing',
    /* Growth */
    'tools/qrcode.html':'Growth','tools/chi-squared.html':'Growth',
    /* Productivity */
    'tools/pomodoro.html':'Productivity',
    /* Games */
    'games/basketball.html':'Game','games/daily-luck.html':'Game','games/slot-machine.html':'Game'
  };

  /* ============================================================
     UTILITY FUNCTIONS
     ============================================================ */
  function now() { return Date.now(); }

  function today(ts) {
    var d = new Date(ts || now());
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function getHour() {
    return new Date().getHours();
  }

  function getLocale() {
    if (typeof window !== 'undefined' && window.i18n && window.i18n.lang) {
      return window.i18n.lang;
    }
    return 'en';
  }

  function t(en, zh) {
    return getLocale() === 'zh' ? zh : en;
  }

  function inferCategory(toolUrl) {
    var clean = toolUrl.replace(/^\.\//, '').replace(/^\//, '');
    var cat = TOOL_CATEGORIES[clean];
    if (cat) return cat;
    // Heuristic fallback
    if (clean.indexOf('games/') === 0) return 'Game';
    if (clean.indexOf('tools/') === 0) return 'Developer';
    return 'Developer';
  }

  /* ============================================================
     STATE HELPERS
     ============================================================ */
  function loadAchievements() {
    try {
      var raw = localStorage.getItem(LS_ACHIEVEMENTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function saveAchievements(data) {
    try { localStorage.setItem(LS_ACHIEVEMENTS, JSON.stringify(data)); } catch (e) {}
  }

  function loadToolUsage() {
    try {
      var raw = localStorage.getItem(LS_TOOL_USAGE);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function saveToolUsage(data) {
    try { localStorage.setItem(LS_TOOL_USAGE, JSON.stringify(data)); } catch (e) {}
  }

  function loadVisits() {
    try {
      var raw = localStorage.getItem(LS_VISITS);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {}
    return [];
  }

  function saveVisits(arr) {
    try { localStorage.setItem(LS_VISITS, JSON.stringify(arr)); } catch (e) {}
  }

  function loadGamesPlayed() {
    try {
      var raw = localStorage.getItem(LS_GAMES_PLAYED);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function saveGamesPlayed(data) {
    try { localStorage.setItem(LS_GAMES_PLAYED, JSON.stringify(data)); } catch (e) {}
  }

  /* ============================================================
     STREAK CALCULATION
     ============================================================ */
  function calculateStreak(visits) {
    if (!visits || visits.length === 0) return 0;
    // Deduplicate by day and sort descending
    var days = [];
    var seen = {};
    visits.forEach(function (ts) {
      var d = today(ts);
      if (!seen[d]) { seen[d] = true; days.push(d); }
    });
    days.sort(function (a, b) { return b - a; });

    if (days.length === 0) return 0;
    var streak = 1;
    var ONE_DAY = 86400000;
    for (var i = 1; i < days.length; i++) {
      if (days[i - 1] - days[i] === ONE_DAY) {
        streak++;
      } else if (days[i - 1] === days[i]) {
        continue; // same day, skip
      } else {
        break;
      }
    }
    return streak;
  }

  /* ============================================================
     FLAG HELPERS (for night-owl, early-bird, power-user)
     ============================================================ */
  function setFlag(key, value) {
    try {
      var flags = JSON.parse(localStorage.getItem('aihues_ach_flags') || '{}');
      flags[key] = value;
      localStorage.setItem('aihues_ach_flags', JSON.stringify(flags));
    } catch (e) {}
  }

  function getFlag(key) {
    try {
      var flags = JSON.parse(localStorage.getItem('aihues_ach_flags') || '{}');
      return flags[key];
    } catch (e) { return undefined; }
  }

  /* ============================================================
     CORE API
     ============================================================ */

  /**
   * Record tool usage. Call once per page load on each tool page.
   * @param {string} toolUrl  - e.g. 'tools/json.html' or 'tools/markdown.html'
   * @param {string} category - optional category override
   */
  function trackToolUsage(toolUrl, category) {
    if (!toolUrl) return;
    var usage = loadToolUsage();
    if (!usage[toolUrl]) usage[toolUrl] = [];
    usage[toolUrl].push(now());

    // Detect time-based achievements
    var h = getHour();
    if (h >= 22 || h < 6) {
      usage['_nightOwl'] = true;
      setFlag('nightOwl', true);
    }
    if (h >= 6 && h < 9) {
      usage['_earlyBird'] = true;
      setFlag('earlyBird', true);
    }

    // Detect power-user (5+ tools today)
    var todayStart = today();
    var todayTools = Object.keys(usage).filter(function (k) {
      if (k.startsWith('_')) return false;
      return usage[k].some(function (ts) { return ts >= todayStart; });
    });
    if (todayTools.length >= 5) {
      usage['_powerUser'] = true;
      setFlag('powerUser', true);
    }

    saveToolUsage(usage);

    // Also record category for all-rounder tracking
    if (category) {
      var catKey = '_cat_' + category;
      if (!usage[catKey]) usage[catKey] = [];
      usage[catKey].push(now());
      saveToolUsage(usage);
    }

    checkAchievements();
  }

  /**
   * Record game play. Call once per page load on each game page.
   * @param {string} gameUrl - e.g. 'games/basketball.html'
   */
  function trackGameUsage(gameUrl) {
    if (!gameUrl) return;
    var games = loadGamesPlayed();
    if (!games[gameUrl]) games[gameUrl] = [];
    games[gameUrl].push(now());
    saveGamesPlayed(games);
    checkAchievements();
  }

  /**
   * Record a page visit. Deduplicates same-day visits automatically.
   */
  function trackVisit() {
    var visits = loadVisits();
    var currentTs = now();
    var currentDay = today(currentTs);

    // Prevent duplicate same-day visit entries
    var lastVisit = visits.length > 0 ? visits[visits.length - 1] : 0;
    if (today(lastVisit) !== currentDay) {
      visits.push(currentTs);
      saveVisits(visits);
    }
    checkAchievements();
  }

  /**
   * Check all achievements and unlock newly completed ones.
   * Returns array of newly unlocked achievement IDs.
   */
  function checkAchievements() {
    var achievements = loadAchievements();
    var state = {
      toolUsage:   loadToolUsage(),
      gamesPlayed: loadGamesPlayed(),
      visits:      loadVisits()
    };
    var newlyUnlocked = [];

    ACHIEVEMENT_DEFS.forEach(function (def) {
      var ach = achievements[def.id];
      if (ach && ach.unlocked) return; // already unlocked

      var currentProgress = def.check(state);

      if (def.type === 'progress') {
        // Update progress
        if (!ach) {
          achievements[def.id] = {
            unlocked: false,
            progress: currentProgress,
            target:   def.target
          };
        } else {
          achievements[def.id].progress = currentProgress;
        }
        // Check completion
        if (currentProgress >= def.target) {
          achievements[def.id].unlocked = true;
          achievements[def.id].unlockedAt = now();
          newlyUnlocked.push(def.id);
        }
      } else {
        // Instant type
        if (currentProgress === true || currentProgress > 0) {
          achievements[def.id] = {
            unlocked:  true,
            unlockedAt: now()
          };
          newlyUnlocked.push(def.id);
        } else {
          if (!ach) {
            achievements[def.id] = { unlocked: false };
          }
        }
      }
    });

    saveAchievements(achievements);

    // Show toast for newly unlocked achievements
    newlyUnlocked.forEach(function (id) {
      var def = getDefById(id);
      if (def) showAchievementToast(def);
    });

    // Dispatch custom event so profile page can re-render
    if (newlyUnlocked.length > 0 && typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('achievementsUpdated', {
          detail: { newlyUnlocked: newlyUnlocked }
        }));
      } catch (e) {}
    }

    return newlyUnlocked;
  }

  /**
   * Get full achievements state keyed by ID.
   */
  function getAchievements() {
    var achievements = loadAchievements();
    var state = {
      toolUsage:   loadToolUsage(),
      gamesPlayed: loadGamesPlayed(),
      visits:      loadVisits()
    };
    var result = {};

    ACHIEVEMENT_DEFS.forEach(function (def) {
      var ach = achievements[def.id] || { unlocked: false };
      var currentProgress = def.check(state);
      result[def.id] = {
        id:       def.id,
        name:     def.name,
        zhName:   def.zhName,
        desc:     def.desc,
        zhDesc:   def.zhDesc,
        icon:     def.icon,
        unlocked: !!ach.unlocked,
        unlockedAt: ach.unlockedAt || null,
        progress: def.type === 'progress' ? Math.min(currentProgress, def.target) : (ach.unlocked ? 1 : 0),
        target:   def.type === 'progress' ? def.target : 1,
        type:     def.type
      };
    });

    return result;
  }

  /**
   * Get count of unlocked achievements.
   */
  function getUnlockedCount() {
    var ach = loadAchievements();
    return Object.keys(ach).filter(function (k) { return ach[k] && ach[k].unlocked; }).length;
  }

  /**
   * Reset all achievement data. Does NOT reset tool usage / visits by default.
   * @param {boolean} resetAll - if true, also clears usage and visits
   */
  function resetAchievements(resetAll) {
    try {
      localStorage.removeItem(LS_ACHIEVEMENTS);
      localStorage.removeItem('aihues_ach_flags');
      if (resetAll) {
        localStorage.removeItem(LS_TOOL_USAGE);
        localStorage.removeItem(LS_VISITS);
        localStorage.removeItem(LS_GAMES_PLAYED);
      }
    } catch (e) {}
  }

  /* ============================================================
     INTERNAL HELPERS
     ============================================================ */
  function getDefById(id) {
    for (var i = 0; i < ACHIEVEMENT_DEFS.length; i++) {
      if (ACHIEVEMENT_DEFS[i].id === id) return ACHIEVEMENT_DEFS[i];
    }
    return null;
  }

  /* ============================================================
     TOAST NOTIFICATION
     ============================================================ */
  var toastContainer = null;

  function getToastContainer() {
    if (toastContainer) return toastContainer;
    var existing = document.getElementById('ach-toast-container');
    if (existing) { toastContainer = existing; return existing; }
    var div = document.createElement('div');
    div.id = 'ach-toast-container';
    div.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:10000',
      'display:flex',
      'flex-direction:column',
      'gap:10px',
      'pointer-events:none'
    ].join(';');
    document.body.appendChild(div);
    toastContainer = div;
    return div;
  }

  function showAchievementToast(def) {
    if (!document.body) return;
    var container = getToastContainer();
    var toast = document.createElement('div');
    var name = t(def.name, def.zhName);
    var desc = t(def.desc, def.zhDesc);

    toast.className = 'ach-toast';
    toast.style.cssText = [
      'background:#fff',
      'border:1px solid #e8ecf1',
      'border-left:4px solid #6d28d9',
      'border-radius:12px',
      'padding:14px 18px',
      'display:flex',
      'align-items:center',
      'gap:12px',
      'min-width:260px',
      'max-width:340px',
      'box-shadow:0 8px 32px rgba(109,40,217,0.15)',
      'font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif',
      'font-size:14px',
      'pointer-events:auto',
      'transform:translateX(120%)',
      'opacity:0',
      'transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.3s ease',
      'overflow:hidden',
      'position:relative'
    ].join(';');

    // Shimmer overlay
    var shimmer = document.createElement('div');
    shimmer.style.cssText = [
      'position:absolute',
      'inset:0',
      'background:linear-gradient(90deg,transparent 0%,rgba(109,40,217,0.08) 50%,transparent 100%)',
      'transform:translateX(-100%)',
      'pointer-events:none'
    ].join(';');
    toast.appendChild(shimmer);

    // Icon
    var iconEl = document.createElement('span');
    iconEl.textContent = def.icon;
    iconEl.style.cssText = 'font-size:28px;flex-shrink:0;';
    toast.appendChild(iconEl);

    // Text content
    var textEl = document.createElement('div');
    textEl.style.cssText = 'flex:1;min-width:0;';
    textEl.innerHTML = '<div style="font-weight:700;color:#0f172a;font-size:13px;margin-bottom:2px;">'
      + t('Achievement Unlocked!', '成就解锁！') + '</div>'
      + '<div style="font-weight:600;color:#6d28d9;font-size:14px;">' + escapeHtml(name) + '</div>'
      + '<div style="font-size:12px;color:#475569;margin-top:2px;">' + escapeHtml(desc) + '</div>';
    toast.appendChild(textEl);

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
        // Shimmer animation
        shimmer.style.transition = 'transform 0.8s ease';
        shimmer.style.transform = 'translateX(100%)';
      });
    });

    // Auto-dismiss
    setTimeout(function () {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 3500);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ============================================================
     ACHIEVEMENT PANEL RENDERER
     ============================================================ */

  /**
   * Render all achievements into a container element.
   * @param {string|HTMLElement} container - element ID or DOM node
   */
  function renderAchievementsPanel(container) {
    var el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) { console.warn('[Achievements] container not found:', container); return; }
    el.innerHTML = '';

    var data = getAchievements();
    var ids = Object.keys(data);
    var unlockedCount = ids.filter(function (id) { return data[id].unlocked; }).length;
    var totalCount = ids.length;

    // Header count (if sibling element exists)
    var section = el.closest('[id*="achievement"]');
    if (section) {
      var countEl = section.querySelector('[id*="Count"]');
      if (countEl) countEl.textContent = unlockedCount + ' / ' + totalCount;
    }

    // Grid container
    var grid = document.createElement('div');
    grid.className = 'achievements-grid';
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;';

    ACHIEVEMENT_DEFS.forEach(function (def, i) {
      var ach = data[def.id];
      var card = document.createElement('div');
      var isUnlocked = ach && ach.unlocked;

      card.className = 'achievement-card ' + (isUnlocked ? 'unlocked' : 'locked');
      card.style.cssText = [
        'background:#fff',
        'border:1px solid #e8ecf1',
        'border-radius:14px',
        'padding:18px',
        'display:flex',
        'align-items:center',
        'gap:14px',
        'transition:all 0.25s cubic-bezier(0.4,0,0.2,1)',
        'position:relative',
        'overflow:hidden',
        'cursor:default'
      ].join(';');
      if (!isUnlocked) {
        card.style.opacity = '0.55';
        card.style.filter = 'grayscale(0.6)';
      } else {
        card.style.borderColor = 'rgba(109,40,217,0.25)';
      }
      // Hover effect via JS to avoid external CSS dependency
      card.addEventListener('mouseenter', function () {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)';
        if (!isUnlocked) card.style.opacity = '0.75';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
        if (!isUnlocked) card.style.opacity = '0.55';
      });

      // Stagger animation
      card.style.animation = 'fadeInUp 0.4s ease ' + (i * 0.05) + 's both';

      var progressPct = def.type === 'progress' && def.target > 0
        ? Math.min(100, Math.round((ach.progress / ach.target) * 100))
        : (isUnlocked ? 100 : 0);

      var name = t(def.name, def.zhName);
      var desc = t(def.desc, def.zhDesc);
      var statusIcon = isUnlocked ? '\u2714' : '\uD83D\uDD12';
      var statusColor = isUnlocked ? '#10b981' : '#94a3b8';

      card.innerHTML = [
        '<div class="ach-badge" style="width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;background:' + (isUnlocked ? 'linear-gradient(135deg,#f3e8ff,#ede9fe)' : '#f8f9fb') + ';">' + def.icon + '</div>',
        '<div class="ach-info" style="flex:1;min-width:0;">',
          '<div style="font-size:14px;font-weight:700;margin-bottom:3px;">' + escapeHtml(name) + '</div>',
          '<div style="font-size:12px;color:#475569;line-height:1.4;">' + escapeHtml(desc) + '</div>',
          def.type === 'progress' ? '<div style="margin-top:6px;">' +
            '<div style="height:4px;background:#e8ecf1;border-radius:2px;overflow:hidden;">' +
              '<div style="height:100%;width:' + progressPct + '%;background:linear-gradient(90deg,#6d28d9,#8b5cf6);border-radius:2px;transition:width 0.6s ease;"></div>' +
            '</div>' +
            '<div style="font-size:11px;color:#94a3b8;margin-top:2px;">' + ach.progress + ' / ' + ach.target + '</div>' +
          '</div>' : '',
          isUnlocked && ach.unlockedAt ? '<div style="font-size:11px;color:#10b981;margin-top:3px;">' + t('Unlocked', '解锁于') + ' ' + formatDate(ach.unlockedAt) + '</div>' : '',
        '</div>',
        '<div style="font-size:20px;flex-shrink:0;color:' + statusColor + ';">' + statusIcon + '</div>'
      ].join('');

      grid.appendChild(card);
    });

    el.appendChild(grid);

    // Inject keyframe if not already present
    injectKeyframes();
  }

  function formatDate(ts) {
    var d = new Date(ts);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function injectKeyframes() {
    if (document.getElementById('ach-animations')) return;
    var style = document.createElement('style');
    style.id = 'ach-animations';
    style.textContent = [
      '@keyframes fadeInUp {',
        'from { opacity:0; transform:translateY(12px); }',
        'to   { opacity:1; transform:translateY(0); }',
      '}',
      '@keyframes achShimmer {',
        '0%   { transform:translateX(-100%); }',
        '100% { transform:translateX(100%); }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ============================================================
     AUTO-INIT
     ============================================================ */
  function autoInit() {
    // Only auto-init on tool and game pages (not on index/profile etc.)
    var path = window.location.pathname;
    var href = window.location.href;

    // Record visit on every page
    trackVisit();

    // Detect if this is a tool page
    var toolMatch = path.match(/\/tools\/([^\/]+\.html)$/);
    if (toolMatch || href.indexOf('/tools/') > -1) {
      var toolFile = path.split('/tools/')[1];
      if (toolFile) {
        var cleanUrl = 'tools/' + toolFile.split('?')[0].split('#')[0];
        var cat = inferCategory(cleanUrl);
        trackToolUsage(cleanUrl, cat);
        return;
      }
    }

    // Detect if this is a game page
    var gameMatch = path.match(/\/games\/([^\/]+\.html)$/);
    if (gameMatch || href.indexOf('/games/') > -1) {
      var gameFile = path.split('/games/')[1];
      if (gameFile) {
        var cleanGameUrl = 'games/' + gameFile.split('?')[0].split('#')[0];
        trackGameUsage(cleanGameUrl);
        // Also track as tool usage for all-rounder / tool-master counts
        trackToolUsage(cleanGameUrl, 'Game');
        return;
      }
    }

    // If running from file:// protocol
    if (href.indexOf('file://') === 0) {
      if (href.indexOf('/tools/') > -1) {
        var parts = href.split('/tools/');
        if (parts[1]) {
          var fileUrl = 'tools/' + parts[1].split('?')[0].split('#')[0];
          trackToolUsage(fileUrl, inferCategory(fileUrl));
        }
      } else if (href.indexOf('/games/') > -1) {
        var gparts = href.split('/games/');
        if (gparts[1]) {
          var gfileUrl = 'games/' + gparts[1].split('?')[0].split('#')[0];
          trackGameUsage(gfileUrl);
          trackToolUsage(gfileUrl, 'Game');
        }
      }
    }
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  var API = {
    trackToolUsage:       trackToolUsage,
    trackGameUsage:       trackGameUsage,
    trackVisit:           trackVisit,
    checkAchievements:    checkAchievements,
    getAchievements:      getAchievements,
    getUnlockedCount:     getUnlockedCount,
    resetAchievements:    resetAchievements,
    renderAchievementsPanel: renderAchievementsPanel,

    // Expose definitions for external use (e.g. profile.html integration)
    _defs: ACHIEVEMENT_DEFS,
    _inferCategory: inferCategory
  };

  // Expose globally
  if (typeof window !== 'undefined') {
    window.Achievements = API;
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
