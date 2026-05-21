// AIHues Auth Module
// Handles user authentication, login state, and session management
// Placeholder - original file not found in repository (404)

(function() {
  'use strict';

  const AUTH = {
    // Check if user is logged in
    isLoggedIn() {
      return !!localStorage.getItem('aihues_user');
    },

    // Get current user info
    getUser() {
      const user = localStorage.getItem('aihues_user');
      return user ? JSON.parse(user) : null;
    },

    // Save user session
    setUser(userData) {
      localStorage.setItem('aihues_user', JSON.stringify(userData));
      localStorage.setItem('aihues_token', userData.token || 'demo-token');
    },

    // Clear session (logout)
    logout() {
      localStorage.removeItem('aihues_user');
      localStorage.removeItem('aihues_token');
      localStorage.removeItem('aihues_collection');
      window.location.href = 'index.html';
    },

    // Get auth token
    getToken() {
      return localStorage.getItem('aihues_token') || '';
    },

    // Update nav based on auth state
    updateNav() {
      const user = this.getUser();
      const navLinks = document.querySelector('.nav-links');
      if (!navLinks) return;

      const profileLink = navLinks.querySelector('a[href="login.html"]');
      if (profileLink && user) {
        profileLink.textContent = user.name || 'Profile';
        profileLink.href = 'profile.html';
      }
    },

    // Init auth state
    init() {
      this.updateNav();
    }
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AUTH.init());
  } else {
    AUTH.init();
  }

  // Expose globally
  window.AUTH = AUTH;
})();
