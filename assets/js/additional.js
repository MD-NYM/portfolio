/**
 * Additional Utility Scripts
 * - Dynamic Copyright Year
 * - Image Error Handling
 * - Navigation Active State Enhancement
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

    // Navigation Active State Enhancement
    // Ensures aria-current is set correctly on initial page load with hash links
    function initNavigationActiveState() {
        // Wait for scrollspy to initialize, then set initial state
        setTimeout(function () {
            const currentHash = window.location.hash;
            const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
            const logoLink = document.querySelector('.navmenu .logo');

            if (currentHash) {
                // Find and set aria-current for hash link
                const activeLink = document.querySelector(`.navmenu a[href="${currentHash}"]`);
                if (activeLink) {
                    // Remove aria-current from logo if hash link exists
                    if (logoLink) {
                        logoLink.removeAttribute('aria-current');
                    }
                    // Set aria-current on the active section link
                    activeLink.setAttribute('aria-current', 'true');
                    activeLink.classList.add('active');
                }
            } else {
                // If no hash and at top of page, ensure logo has aria-current
                if (logoLink && window.scrollY < 200) {
                    logoLink.setAttribute('aria-current', 'page');
                    // Remove aria-current from any section links
                    navLinks.forEach(function (link) {
                        link.removeAttribute('aria-current');
                        link.classList.remove('active');
                    });
                }
            }
        }, 100);
    }

    // Initialize all functions when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initCopyrightYear();
            initImageErrorHandling();
            initNavigationActiveState();
        });
    } else {
        // DOM already loaded
        initCopyrightYear();
        initImageErrorHandling();
        initNavigationActiveState();
    }

})();
