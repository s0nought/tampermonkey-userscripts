// ==UserScript==
// @name GameBanana auto-'Load Replies'
// @match https://gamebanana.com/*
// @description Automatically 'Load Replies' after the thread is expanded
// @version 1.0
// @icon https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-load-replies/icon.png
// @icon64 https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-load-replies/icon64.png
// @namespace s0nought/tampermonkey-userscripts
// @run-at document-idle
// @sandbox DOM
// @updateURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-load-replies/gb-load-replies.user.js
// @downloadURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-load-replies/gb-load-replies.user.js
// @supportURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-load-replies/gb-load-replies.user.js
// @homepage https://github.com/s0nought/tampermonkey-userscripts/gb-load-replies
// @author s0nought, YellowJello
// @copyright CC0 1.0 Universal
// ==/UserScript==

(function() {

    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.click();
            }
        });
    }, {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
    });

    const mutationObserver = new MutationObserver((mutationsList) => {
        // Get all Level 1+ 'Load Replies' buttons and start observing them with intersectionObserver
        document.querySelectorAll("div.Replies div.Flow > button.ExtendedContentButton").forEach((el) => {
            intersectionObserver.observe(el);
        });
    });

    mutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });

})();