"use strict";

const { app, BrowserWindow } = require('electron');
const config = require('./../config.js');
const logger = require('./log.js');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow(config.electronBrowserOption);
    
    let splash = new BrowserWindow(config.electronBrowserOption);
    splash.loadFile(app.getAppPath() + config.splashScreen);
    logger.log(`Path to splash screen is ${app.getAppPath()}${config.splashScreen}`);

        setTimeout(function loadMainWin() {
        // and load the index.html of the app and splash screen
        logger.log(`Path to application is ${app.getAppPath()}${config.index}`);
        mainWindow.loadFile(app.getAppPath() + config.index);
        logger.logDebug("Destroying splash screen");
        splash.destroy();
    }, 6000);
}

app.on("ready", function launchApp() {
    logger.log("Launching application.");
    createWindow();
});