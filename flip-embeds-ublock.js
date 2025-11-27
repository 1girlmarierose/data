flip-player.js text/javascript
    (function () {
        'use strict';

        // *** Domain einschränken – hier deine Seite eintragen ***
        // Falls du nur über den uBO-Filter einschränken willst, kannst du
        // diesen Block entfernen.
        if (!/(^|\.)rule34video\.com$/.test(document.location.hostname)) {
            return;
        }

        const VIDEO_SELECTOR = 'video';
        const MARK_ATTR = 'data-ublock-flip-player';
        const MAX_PARENT_LEVELS = 6;

        function getPlayerContainer(el) {
            let baseRect;
            try {
                baseRect = el.getBoundingClientRect();
            } catch (e) {
                return el;
            }

            let current = el;
            let best = el;

            for (let i = 0; i < MAX_PARENT_LEVELS; i++) {
                const parent = current.parentElement;
                if (!parent || parent === document.body || parent === document.documentElement) {
                    break;
                }

                let pr;
                try {
                    pr = parent.getBoundingClientRect();
                } catch (e) {
                    break;
                }

                // Eltern, die ungefähr dieselbe Größe wie das Video haben,
                // werten wir als "Player-Container".
                const widthOk  = pr.width  >= baseRect.width  && pr.width  <= baseRect.width  * 1.8;
                const heightOk = pr.height >= baseRect.height && pr.height <= baseRect.height * 1.8;

                if (widthOk && heightOk) {
                    best = parent;
                }

                current = parent;
            }

            return best;
        }

        function flipContainer(container) {
            if (!container || container.nodeType !== 1) return;
            if (container.getAttribute(MARK_ATTR) === '1') return;
            container.setAttribute(MARK_ATTR, '1');

            const cs = getComputedStyle(container);
            const base = cs.transform && cs.transform !== 'none'
                ? cs.transform + ' '
                : '';

            const newTransform = base + 'scaleX(-1)';

            container.style.transform = newTransform;
            container.style.transformOrigin = 'center center';

            container.style.webkitTransform = newTransform;
            container.style.webkitTransformOrigin = 'center center';
        }

        function handleVideo(el) {
            if (!el || el.nodeType !== 1) return;
            const container = getPlayerContainer(el);
            flipContainer(container);
        }

        function scanAll() {
            document.querySelectorAll(VIDEO_SELECTOR).forEach(handleVideo);
        }

        function onAddedNode(node) {
            if (!node || node.nodeType !== 1) return;

            if (node.matches && node.matches(VIDEO_SELECTOR)) {
                handleVideo(node);
            }

            if (node.querySelectorAll) {
                node.querySelectorAll(VIDEO_SELECTOR).forEach(handleVideo);
            }
        }

        function setupObserver() {
            const obs = new MutationObserver(mutations => {
                for (const m of mutations) {
                    for (const n of m.addedNodes) {
                        onAddedNode(n);
                    }
                }
            });

            obs.observe(document.documentElement, {
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
