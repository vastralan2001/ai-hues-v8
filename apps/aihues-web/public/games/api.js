/**
 * AIHues Game API Client
 * Shared across all mini-games for leaderboard + credit sync.
 *
 * Endpoints (production):
 *   GET  /api/games/leaderboard?game={slug}&limit=10
 *   POST /api/games/score       { game, playerName, score, metadata }
 *   GET  /api/user/credits
 *   POST /api/user/checkin
 *
 * Falls back to localStorage when API is unavailable (offline mode).
 */

(function (global) {
  'use strict';

  const API_BASE =
    typeof location !== 'undefined' && location.hostname === 'localhost'
      ? ''
      : 'https://aihues-test.mse.msh.work';

  const DEFAULT_TIMEOUT = 5000;

  async function apiFetch(path, opts) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...opts,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(opts?.headers || {}),
        },
      });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  /**
   * Get leaderboard for a game.
   * @param {string} gameSlug - e.g. 'daily-luck', 'basketball', 'slot-machine'
   * @param {number} [limit=10]
   * @returns {Promise<Array<{name:string,score:number,date:string}>>}
   */
  async function getLeaderboard(gameSlug, limit) {
    limit = limit || 10;
    try {
      const data = await apiFetch(
        `/api/games/leaderboard?game=${encodeURIComponent(gameSlug)}&limit=${limit}`
      );
      return Array.isArray(data) ? data : data.leaderboard || [];
    } catch {
      // Fallback to localStorage
      const raw = localStorage.getItem('aihues_lb_' + gameSlug);
      return raw ? JSON.parse(raw) : [];
    }
  }

  /**
   * Submit a score to the leaderboard.
   * @param {string} gameSlug
   * @param {string} playerName
   * @param {number} score
   * @param {object} [metadata]
   */
  async function submitScore(gameSlug, playerName, score, metadata) {
    if (typeof gtag === 'function') {
      gtag('event', 'game_score', { game: gameSlug, score: score });
    }

    const entry = {
      name: playerName || 'Anonymous',
      score: score,
      date: new Date().toISOString().split('T')[0],
      ...(metadata || {}),
    };

    try {
      await apiFetch('/api/games/score', {
        method: 'POST',
        body: JSON.stringify({
          game: gameSlug,
          playerName: entry.name,
          score: entry.score,
          metadata: metadata || {},
        }),
      });
    } catch {
      // Fallback: save to localStorage
      const key = 'aihues_lb_' + gameSlug;
      const board = JSON.parse(localStorage.getItem(key) || '[]');
      board.push(entry);
      board.sort((a, b) => b.score - a.score);
      localStorage.setItem(key, JSON.stringify(board.slice(0, 20)));
    }

    return entry;
  }

  /**
   * Get current user credits.
   * @returns {Promise<number>}
   */
  async function getCredits() {
    try {
      const data = await apiFetch('/api/user/credits');
      return typeof data.credits === 'number' ? data.credits : 0;
    } catch {
      const raw = localStorage.getItem('aihues-credits');
      if (raw) return parseInt(raw, 10);
      localStorage.setItem('aihues-credits', '100');
      return 100;
    }
  }

  /**
   * Add credits to user account.
   * @param {number} amount
   * @param {string} [reason]
   */
  async function addCredits(amount, reason) {
    const current = await getCredits();
    const next = current + amount;

    try {
      await apiFetch('/api/user/credits/add', {
        method: 'POST',
        body: JSON.stringify({ amount, reason: reason || 'game' }),
      });
    } catch {
      // Fallback
      localStorage.setItem('aihues-credits', String(next));
    }

    return next;
  }

  /**
   * Daily check-in.
   * @returns {Promise<{success:boolean,credits:number,streak:number}>}
   */
  async function dailyCheckin() {
    try {
      const data = await apiFetch('/api/user/checkin', { method: 'POST' });
      return data;
    } catch {
      // Offline fallback
      const today = new Date().toISOString().split('T')[0];
      const last = localStorage.getItem('aihues-checkin-date');
      let streak = parseInt(
        localStorage.getItem('aihues-checkin-streak') || '0',
        10
      );
      let credits = parseInt(
        localStorage.getItem('aihues-credits') || '100',
        10
      );

      if (last !== today) {
        credits += 10;
        streak = last === getYesterday() ? streak + 1 : 1;
        localStorage.setItem('aihues-credits', String(credits));
        localStorage.setItem('aihues-checkin-date', today);
        localStorage.setItem('aihues-checkin-streak', String(streak));
        if (typeof gtag === 'function') {
          gtag('event', 'game_checkin', { streak: streak });
        }
      }

      return { success: last !== today, credits, streak };
    }
  }

  function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  // Expose global API
  global.AIHUES_GAME_API = {
    getLeaderboard,
    submitScore,
    getCredits,
    addCredits,
    dailyCheckin,
  };
})(typeof window !== 'undefined' ? window : globalThis);
