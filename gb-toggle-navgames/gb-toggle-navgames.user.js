// ==UserScript==
// @name GameBanana toggle NavGames
// @match https://gamebanana.com/*
// @description Makes NavGames menu expand on click rather than on hover.
// @version 1.0
// @icon https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-toggle-navgames/icon.png
// @icon64 https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-toggle-navgames/icon64.png
// @namespace s0nought/tampermonkey-userscripts
// @run-at document-idle
// @sandbox DOM
// @updateURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-toggle-navgames/gb-toggle-navgames.user.js
// @downloadURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-toggle-navgames/gb-toggle-navgames.user.js
// @supportURL https://raw.githubusercontent.com/s0nought/tampermonkey-userscripts/main/gb-toggle-navgames/gb-toggle-navgames.user.js
// @homepage https://github.com/s0nought/tampermonkey-userscripts/tree/main/gb-toggle-navgames
// @author s0nought, Amaruq
// @copyright CC0 1.0 Universal
// ==/UserScript==

(function() {

    /*
        Originally, GamesPane attaches to DOM when you mouseenter NavGames
        and de-attaches on mouseleave (GameBanana's UI is powered by Vue).

        Since I cannot easily remove event listeners from NavGames and still
        make GamesPane attach to DOM, I've decided to go the long way round:
            - wait for you to hover NavGames once and GamesPane to "spawn"
            - insert GamesPane before the first element in NavGames
            - get rid of NavGames's event listeners by cloning it
            - create a custom wrapper for GamesPane and style it
            - register "click" event listener on NavGamesMenuToggle
    */

    function toggleGamesPane() {
        const navGames = document.querySelector("div.NavGames");
        const gamesPane = document.getElementById("GamesPaneTippy");

        if (gamesPane.style.display == "none") {
            gamesPane.style.display = "block";
            navGames.setAttribute("aria-expanded", true);
        } else {
            gamesPane.style.display = "none";
            navGames.setAttribute("aria-expanded", false);
        }
    }

    const bodyMutationObserver = new MutationObserver((mutationsList) => {
        if (document.querySelector("div.NavGames")) {
            bodyMutationObserver.disconnect();

            const primaryNav = document.getElementById("PrimaryNav");
            const primaryNavCompStyles = window.getComputedStyle(primaryNav);
            const primaryNavHeight = primaryNavCompStyles.getPropertyValue("height");

            const navGames = document.querySelector("div.NavGames");

            const navGamesClone = navGames.cloneNode(true);
            navGamesClone.style.position = "relative";

            const navGamesMutationObserver = new MutationObserver((mutationsList) => {
                if (document.getElementById("GamesPane")) {
                    const gamesPane = document.getElementById("GamesPane");
                    gamesPane.style.display = "none"; // hide it till it's all set up

                    primaryNav.replaceChild(navGamesClone, navGames);

                    /*
                        GamesPane is wrapped in a few parent nodes which have
                        event listeners of their own. They need to go later.
                    */
                    const tippy = gamesPane.parentNode.parentNode.parentNode;

                    const tippyContent = document.createElement("div");
                    const tippyTmp = document.createElement("div"); // target for insertBefore()

                    tippyContent.appendChild(tippyTmp);
                    tippyContent.id = "GamesPaneTippy";
                    tippyContent.classList.add("tippy-content");
                    tippyContent.style.display = "none";
                    tippyContent.style.position = "absolute";
                    tippyContent.style.left = "0px";
                    tippyContent.style.top = primaryNavHeight || "60px";
                    tippyContent.insertBefore(gamesPane, tippyTmp);
                    tippyTmp.remove();

                    document.querySelector("div.NavGames").insertBefore(
                        tippyContent,
                        document.querySelector("div.NavGames > a")
                    );

                    // Cleanup and register "click" event listener

                    gamesPane.style.display = "block";
                    tippy.remove()
                    navGamesMutationObserver.disconnect();

                    const toggleButton = document.getElementById("NavGamesMenuToggle");
                    toggleButton.style.cursor = "pointer";

                    toggleButton.addEventListener("click", () => {toggleGamesPane()});
                }
            });

            // It is enough to observe attributes only
            // to fire event when 'aria-expanded' changes
            navGamesMutationObserver.observe(navGames, {
                subtree: false,
                childList: false,
                attributes: true
            });
        }
    });

    bodyMutationObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });

})();