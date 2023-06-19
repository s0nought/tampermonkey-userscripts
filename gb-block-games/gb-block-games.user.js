// ==UserScript==
// @name GameBanana block games
// @match https://gamebanana.com/
// @description Hide mods for the games you have blocked (see BLOCKED_GAMES) on the homepage.
// @version 1.2
// @icon https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-block-games/icon.png
// @icon64 https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-block-games/icon64.png
// @namespace s0nought/tampermonkey-userscripts
// @run-at document-idle
// @sandbox DOM
// @updateURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-block-games/gb-block-games.user.js
// @downloadURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-block-games/gb-block-games.user.js
// @supportURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-block-games/gb-block-games.user.js
// @homepage https://github.com/s0nought/tampermonkey-userscripts/tree/main/gb-block-games
// @author s0nought
// @copyright CC0 1.0 Universal
// ==/UserScript==

(function() {

    /*
        To block a game add its title below.
        Format: "<game title>",
        (do not forget the comma at the end)
    */
    const BLOCKED_GAMES = [
        "Friday Night Funkin'",
        // "Baldi's Basics",
        // etc.
    ];

    // Do not edit code below this line unless you know what you are doing

    let BLOCKED_GAMES_MAP = new Map();

    for (const item of BLOCKED_GAMES) {
        BLOCKED_GAMES_MAP.set(item, "");
    }

    function hideMod(node) {
        const gameTitle = node.querySelector("img.GameIcon");

        if (gameTitle === null) {
            return;
        }

        if (BLOCKED_GAMES_MAP.has(gameTitle.alt.replace(" icon", ""))) {
            node.style.display = "none";
        }
    }

    const bodyMutationObserver = new MutationObserver((mutationsList) => {
        if (document.getElementById("SubmissionsListModule")) {
            bodyMutationObserver.disconnect();

            document.querySelectorAll("#SubmissionsListModule div.Record.Flow").forEach((node) => {
                hideMod(node);
            });

            const mutationObserver = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    const an = mutation.addedNodes;

                    if (an.length < 1
                        || an[0].nodeType != 1
                        || an[0].children.length <= 1) {
                        return;
                    }

                    hideMod(an[0]);
                });
            });

            mutationObserver.observe(document.getElementById("SubmissionsListModule"), {
                subtree: true,
                childList: true,
                attributes: false
            });
        }
    });

    bodyMutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });

})();