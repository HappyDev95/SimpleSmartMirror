"use strict";

const { app, BrowserWindow } = require('electron');
const config = require('./../config.js');
const logger = require('./log.js');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow(config.electronBrowserOption);
    let splash = new BrowserWindow(config.electronBrowserOption);
    let debug = false;

    //get the cmd line args
    var args = process.argv.slice(2);
    logger.log(`Command line args -> ${args}`);
    logger.log("args[0] = " + args[0]);

    if (args[0] === "debug") {
        debug = true;
        app.commandLine.appendSwitch('debug', 'true');
    }

    //load the index.html of the app
    logger.log(`Path to application is ${app.getAppPath()}${config.index}`);
    mainWindow.loadFile(app.getAppPath() + config.index);

    //and load the splash screen if not in debug mode. Note this will temporarily cover index.html.
    if (!debug) {
        logger.log(`Path to splash screen is ${app.getAppPath()}${config.splashScreen}`);
        splash.loadFile(app.getAppPath() + config.splashScreen);
    }

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