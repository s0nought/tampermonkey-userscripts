// ==UserScript==
// @name GameBanana mark external links
// @match https://gamebanana.com/*
// @description Marks external links with a special red icon next to them
// @grant GM_addStyle
// @version 1.0
// @icon https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-mark-external-links/icon.png
// @icon64 https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-mark-external-links/icon64.png
// @namespace s0nought/tampermonkey-userscripts
// @run-at document-idle
// @sandbox DOM
// @updateURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-mark-external-links/gb-mark-external-links.user.js
// @downloadURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-mark-external-links/gb-mark-external-links.user.js
// @supportURL https://github.com/s0nought/tampermonkey-userscripts/issues
// @homepage https://github.com/s0nought/tampermonkey-userscripts/tree/main/gb-mark-external-links
// @author s0nought
// @copyright CC0 1.0 Universal
// ==/UserScript==

GM_addStyle(`a.js-external-link {
    background-image: url(https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-mark-external-links/icon.svg);
    background-repeat: no-repeat;
    background-position: center right;
    background-size: 0.875em;
    padding-right: 1em;
}`);

function handleExternalLink(node) {
    if (! node.href.startsWith("https://gamebanana.com")
        && ! node.href.startsWith("https://files.gamebanana.com")
        && ! node.href.startsWith("https://screenshots.gamebanana.com")
        && ! node.href.startsWith("https://images.gamebanana.com")
        && ! node.href.startsWith("https://api.gamebanana.com")) {
        node.classList.add("js-external-link");
    }
}

(function() {

    // SSR
    document.body.querySelectorAll("a").forEach((node) => {
        handleExternalLink(node);
    });

    const bodyMutationObserver = new MutationObserver((mutationsList) => {
        document.body.querySelectorAll("a:not(a.js-external-link)").forEach((node) => {
            handleExternalLink(node);
        });
    });

    bodyMutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });

})();