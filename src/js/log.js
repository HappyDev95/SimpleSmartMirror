"use strict";

//Since we are running Electron we want to be able to log stdout, stderr to our
//TERMINAL console. Requiring the 'console' module allows us to do that and
//intercept the log messages that would otherwise be going to the browser console
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

function log(msg) {
    if (msg === undefined || msg === null)
        return;

    myConsole.log('Logging: ' + msg);
}

function logError(msg) {
    if (msg === undefined || msg === null)
        return;

    myConsole.error('ERROR: ' + msg);
}
function logInfo(msg) {
    if (msg === undefined || msg === null)
        return;

    myConsole.error('Info: ' + msg);
}


function logDebug(msg) {
    if (msg === undefined || msg === null)
        return;

    myConsole.debug('\tDebug: ' + msg);
}

function logComponents(arr) {
    if (Array.isArray(arr)) {
        arr.forEach((item, idx) => {
            myConsole.debug(`\tComponent ${++idx} = ${item}`);
        });
    }
}

module.exports = {
    log,
    logComponents,
    logDebug,
    logError,
    logInfo
}
