"use strict";
const config = require('./config.js');
const logger = require('./js/log.js');
const util = require('./js/utility.js');

/*
 * Handles the loading of the individual components specified in config.js
 * 
 */
(function () {
    function loadComponents() {
        logger.log("Loading Components...");
        logger.logComponents(config.components);

        config.components.forEach((component) => {
            let jsPath = util.resolvePath(component, "javascript");
            let cssPath = util.resolvePath(component, "css");
            loadComponent(jsPath, cssPath);
        });
    }

    function loadComponent(jsPath, cssPath) {
        logger.log(`Component being loaded is: ${jsPath}...`);
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = jsPath;
        document.getElementsByTagName("body")[0].appendChild(script);
        loadCss(cssPath);
    }

    function loadCss(path) {
        if (path != null && path != undefined) {
            logger.log(`Path to CSS is being loaded: ${path}`)
            let cssLink = document.createElement("link");
            cssLink.type = "text/css";
            cssLink.rel = "stylesheet";
            cssLink.href = path;
            document.getElementsByTagName("head")[0].appendChild(cssLink);
        }
    }

    loadComponents();
})();