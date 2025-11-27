/// flip-player.js
    (function () {
        'use strict';

        // Optional: Sicherheitscheck auf bestimmte Domain
        // Wenn du willst, passe "example.com" auf deine Zielseite an
        if (!/(^|\.)example\.com$/.test(document.location.hostname)) {
            return;
        }

        const SELECTOR = 'video, iframe, embed, object';
        const MARK_ATTR = 'data-ublock-flip-embeds';

        function flipElement(el) {
            if (!el || el.nodeType !== 1) return;
            if (el.getAttribute(MARK_ATTR) === '1') return;
            el.setAttribute(MARK_ATTR, '1');

            // Vorhandenen transform mitbenutzen (falls schon einer gesetzt ist)
            const cs = getComputedStyle(el);
            const current = cs.transform && cs.transform !== 'none'
                ? cs.transform + ' '
                : '';

            const newTransform = current + 'scaleX(-1)';

            el.style.transform = newTransform;
            el.style.transformOrigin = 'center center';

            // Für ältere Browser-Engines
            el.style.webkitTransform = newTransform;
            el.style.webkitTransformOrigin = 'center center';
        }

        function scanAll() {
            document.querySelectorAll(SELECTOR).forEach(flipElement);
        }

        function handleAddedNode(node) {
            if (!node || node.nodeType !== 1) return;
            if (node.matches(SELECTOR)) flipElement(node);
            node.querySelectorAll(SELECTOR).forEach(flipElement);
        }

        function setupObserver() {
            const observer = new MutationObserver(mutations => {
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        handleAddedNode(n);
                    }
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
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
