"use strict";

const { app, BrowserWindow } = require('electron');
const config = require('./../config.js');
const logger = require('./log.js');

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow(config.electronBrowserOption);

    // and load the index.html of the app.
    logger.log(`Path to application is ${app.getAppPath()}${config.index}`);
    win.loadFile(app.getAppPath() + config.index);
}

app.on("ready", function () {
    logger.log("Launching application.");
    createWindow();
});