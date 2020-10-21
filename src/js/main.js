"use strict";

const { app, BrowserWindow } = require('electron');
const config = require('./../config.js');
const logger = require('./log.js');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow(config.electronBrowserOption);
    
    let splash = new BrowserWindow(config.electronBrowserOption);


    //load the index.html of the app
    logger.log(`Path to application is ${app.getAppPath()}${config.index}`);
    mainWindow.loadFile(app.getAppPath() + config.index);

    //and load the splash screen. Note this will temporarily cover index.html
    logger.log(`Path to splash screen is ${app.getAppPath()}${config.splashScreen}`);
    splash.loadFile(app.getAppPath() + config.splashScreen);

    //after 6 seconds destroy splash. All components should be loaded into DOM
    setTimeout(function loadMainWin() {
        logger.logDebug("Destroying splash screen");
        splash.destroy();
    }, 6000);
}

app.on("ready", function launchApp() {
    logger.log("Launching application.");
    createWindow();
});