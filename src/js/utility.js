"use strict";

const fs = require('fs');
const path = require('path');
const logger = require('./log.js');

function resolvePath(componentName, fileType) {
    logger.log(`Resolving path for Component=${componentName}...`);

    if (componentName === null || componentName === undefined) {
        logger.logError(`${componentName} null or undefined`);
        return;
    }

    try {
        if (fileType === "javascript") {
            let pathToComponent = path.join(config.componentsDir, componentName, `${componentName}.js`);
            logger.logDebug(`Path to JavaScript component=${componentName} is=${pathToComponent}`);

            if (fs.existsSync(pathToComponent)) {
                return pathToComponent;
            } else {
                logger.logError(`Path to --> ${pathToComponent} <-- does not exist`);
                return;
            }
        }

        if (fileType == "css") {
            let pathToComponent = path.join(config.componentsDir, componentName, `${componentName}.css`);
            logger.logDebug(`Path to CSS component=${componentName} is=${pathToComponent}`);

            if (fs.existsSync(pathToComponent)) {
                return pathToComponent;
            } else {
                logger.logDebug(`Path to --> ${pathToComponent} <-- does not exist`);
                return;
            }
        }
    } catch (err) {
        logger.logError(err);
    }
}

function convertDateToEst(unixTimestamp) {
    if (unixTimestamp === undefined || unixTimestamp === null) {
        logger.logError("Unix Timestamp is undefined or null");
        return;
    }

    //unixTimestamp is in seconds, convert so milliseconds for Date constructor
    let date = new Date(unixTimestamp * 1000);
    date = date.toLocaleTimeString(config.dateFormat, config.dateFormatOptions);

    return stripAmPm(date);
}

function convertDateToEstHours(unixTimestamp) {
    if (unixTimestamp === undefined || unixTimestamp === null) {
        logger.logError("Unix Timestamp is undefined or null");
        return;
    }

    //unixTimestamp is in seconds, convert so milliseconds for Date constructor
    let date = new Date(unixTimestamp * 1000);

    return date.getHours();
}

function formatHours(hours) {
    //12am == hour 0 so return 12
    if (hours == 0) {
        return 12;
    } else if (hours < 12) {
        return hours;
    } else {
        return hours - 12;
    }
}

function stripAmPm(date) {
    if (date.includes("AM")) {
        return date.replace("AM", "");
    } else {
        return date.replace("PM", "");
    }
}

/*
 * optional parameter nightTime boolean if true, then it is nighttime.
 * optional parameter desc 
*/
function getImageSrc(prop, nightTime, desc) {
    logger.logDebug(`Getting Image for property --> ${prop}`);
    let retImg;
    switch (prop) {
        case "Clear":
            if (nightTime) {
                retImg =  config.image.moon;
            } else {
                retImg = config.image.sun;
            }
            return retImg;
            break;
        case "Clouds":
            if (nightTime) {
                retImg = config.image.cloudyNight;
            } else if (desc == "broken clouds") {
                retImg = config.image.sunClouds;
            } else {
                retImg = config.image.clouds;
            }
            return retImg;
            break;
        case "Mist":
            return config.image.mist;
            break;
        case "Rain":
            return config.image.rain;
            break;
        case "Thunderstorm":
            return config.image.rain;
            break;
        default:
            logger.logInfo(`Couldn't find a weather image for this property: ${prop}`);
            break;
    }
}

module.exports = {
    resolvePath,
    convertDateToEst,
    convertDateToEstHours,
    getImageSrc,
    formatHours,
    stripAmPm
}