// Scriptlets for uBlock Origin

/// flip-video.js
(function () {
    'use strict';

    // Nur auf rule34video.com (+ Subdomains)
    if (!/(^|\.)rule34video\.com$/.test(location.hostname)) {
        return;
    }

    const SEL = 'video';
    const MARK_ATTR = 'data-ublock-flip-video';

    function flip(el) {
        if (!el || el.nodeType !== 1) return;
        if (el.getAttribute(MARK_ATTR) === '1') return;
        el.setAttribute(MARK_ATTR, '1');

        const cs = getComputedStyle(el);
        const base = cs.transform && cs.transform !== 'none'
            ? cs.transform + ' '
            : '';

        const t = base + 'scaleX(-1)';

        el.style.transform = t;
        el.style.transformOrigin = 'center center';

        // für ältere Engines
        el.style.webkitTransform = t;
        el.style.webkitTransformOrigin = 'center center';
    }

    function scanAll() {
        document.querySelectorAll(SEL).forEach(flip);
    }

    function handleAdded(node) {
        if (!node || node.nodeType !== 1) return;

        if (node.matches && node.matches(SEL)) {
            flip(node);
        }
        if (node.querySelectorAll) {
            node.querySelectorAll(SEL).forEach(flip);
        }
    }

    function setupObserver() {
        const obs = new MutationObserver(muts => {
            for (const m of muts) {
                for (const n of m.addedNodes) {
                    handleAdded(n);
                }
            }
        });

        obs.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    function init() {
        scanAll();
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
