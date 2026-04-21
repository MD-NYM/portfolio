/**
 * Additional Utility Scripts
 * - Dynamic Copyright Year
 * - Image Error Handling
 */

(function () {
    'use strict';

    // Dynamic Copyright Year
    function initCopyrightYear() {
        const yearElement = document.getElementById('copyright-year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }

    // Image Error Handling - Fallback for all images
    function initImageErrorHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(function (img) {
            img.addEventListener('error', function () {
                if (!this.hasAttribute('data-error-handled')) {
                    this.setAttribute('data-error-handled', 'true');
                    // Create a placeholder SVG
                    const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="' + (this.width || 400) +
                        '" height="' + (this.height || 400) + '"><rect width="100%" height="100%" fill="#ddd"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial">Image not found</text></svg>'
                    );
                    this.src = placeholder;
                }
            });
        });
    }

    // Portfolio Filters — keyboard accessibility + aria-selected sync
    function initPortfolioFilterA11y() {
        const filters = document.querySelectorAll('.portfolio-filters li[role="tab"]');
        if (!filters.length) return;

        filters.forEach(function (filter) {
            // Keyboard activation: Enter or Space triggers click
            filter.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    filter.click();
                }
            });

            // Keep aria-selected in sync when user clicks
            filter.addEventListener('click', function () {
                filters.forEach(function (f) { f.setAttribute('aria-selected', 'false'); });
                filter.setAttribute('aria-selected', 'true');
            });
        });
    }

    // Initialize all functions when DOM is ready
    function runInits() {
        initCopyrightYear();
        initImageErrorHandling();
        initPortfolioFilterA11y();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInits);
    } else {
        runInits();
    }

})();
