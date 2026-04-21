/**
 * Page Preloader Controller
 * -------------------------
 *  - Eases a progress bar up to 90% while the page is loading.
 *  - Fills to 100% and fades the overlay out once `window.load` fires.
 *  - Honors a minimum display time so fast loads don't flash the overlay.
 *  - Removes the element from the DOM after the fade so it never traps
 *    focus or gets announced by screen readers.
 *  - Safety timeout guarantees the overlay always hides, even if a stuck
 *    asset prevents `load` from firing.
 *
 *  This file is loaded with `defer` in <head>, so it runs after the HTML
 *  is parsed but before DOMContentLoaded — the preloader element is
 *  always available when this code executes.
 */
(function () {
    'use strict';

    var MIN_DISPLAY_MS = 500;  // shortest time the overlay stays visible
    var FADE_MS        = 450;  // must match the CSS .preloader transition
    var SAFETY_MS      = 8000; // hard cap, just in case `load` never fires

    var html      = document.documentElement;
    var preloader = document.getElementById('preloader');
    if (!preloader) { html.classList.remove('is-loading'); return; }

    var barEl     = preloader.querySelector('.preloader__bar-fill');
    var startTime = Date.now();
    var progress  = 0;
    var timer     = null;
    var hidden    = false;

    function setProgress(value) {
        if (barEl) barEl.style.width = value + '%';
    }

    // Ease progress toward 90% — feels responsive without lying about completion.
    timer = setInterval(function () {
        progress += (90 - progress) * 0.08;
        setProgress(progress);
        if (progress >= 89.5) { clearInterval(timer); timer = null; }
    }, 80);

    function hide() {
        if (hidden) return;
        hidden = true;

        if (timer) { clearInterval(timer); timer = null; }
        setProgress(100);

        var elapsed = Date.now() - startTime;
        var wait    = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(function () {
            preloader.classList.add('is-hidden');
            html.classList.remove('is-loading');

            // Drop the element after the fade completes so it's fully gone.
            setTimeout(function () {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, FADE_MS + 50);
        }, wait);
    }

    if (document.readyState === 'complete') {
        hide();
    } else {
        window.addEventListener('load', hide, { once: true });
    }

    // Safety net: never leave the user staring at a stuck loader.
    setTimeout(hide, SAFETY_MS);
})();
