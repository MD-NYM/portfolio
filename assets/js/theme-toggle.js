/**
 * Theme Toggle
 * ------------
 * - Persists user choice in localStorage under "theme" ("light" | "dark").
 * - Falls back to the OS preference (`prefers-color-scheme`) when the user
 *   has never clicked the toggle.
 * - Adds a short `.theme-transition` class on <html> during the switch so
 *   colours cross-fade without paying a permanent `* { transition }` cost.
 *
 * The initial attribute is set inline in <head> (see index.html) to avoid
 * a flash of the wrong theme before this script runs.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';
    var root = document.documentElement;
    var mql = window.matchMedia('(prefers-color-scheme: dark)');

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function storeTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            /* storage may be blocked (private mode, quota) — ignore */
        }
    }

    function currentTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function applyTheme(theme, animated) {
        if (animated) {
            root.classList.add('theme-transition');
            window.setTimeout(function () {
                root.classList.remove('theme-transition');
            }, 400);
        }
        root.setAttribute('data-theme', theme);
        syncButton(theme);
        syncMetaThemeColor(theme);
    }

    function syncButton(theme) {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        var isDark = theme === 'dark';
        // Button action describes what clicking will DO, not the current state.
        var nextLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';
        btn.setAttribute('aria-label', nextLabel);
        btn.setAttribute('title', nextLabel);
        btn.setAttribute('aria-pressed', String(isDark));
    }

    // Keep the mobile browser chrome colour in sync with the active theme.
    function syncMetaThemeColor(theme) {
        var color = theme === 'dark' ? '#111827' : '#ffffff';
        var meta = document.querySelector('meta[name="theme-color"]:not([media])');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', color);
    }

    function handleToggleClick() {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        storeTheme(next);
        applyTheme(next, true);
    }

    // React to OS-level changes only if the user has not made an explicit choice.
    function handleSystemChange(event) {
        if (getStoredTheme()) return;
        applyTheme(event.matches ? 'dark' : 'light', true);
    }

    function init() {
        var btn = document.getElementById('theme-toggle');
        if (btn) btn.addEventListener('click', handleToggleClick);

        // Sync UI with whatever the inline head-script already applied.
        syncButton(currentTheme());
        syncMetaThemeColor(currentTheme());

        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', handleSystemChange);
        } else if (typeof mql.addListener === 'function') {
            mql.addListener(handleSystemChange); // legacy Safari
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
