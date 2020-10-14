const IMG_DIR = "C:/My-Projects/SmartMirror/src/images";

const config = {
    components: [
        "calendar",
        "clock",
        "currentWeather",
        "weather",
        "strava"
    ],
    //PLEASE FIX THIS PATHING
    componentsDir: "C:/My-Projects/SmartMirror/src/components/",
    cssDir: "C:/My-Projects/SmartMirror/src/css",
    currentWeatherApiEndpoint: "onecall",
    currentWeatherApiParams: {
        latitude: "40.44062",
        longitude: "-79.995888",
        exclude: [
            { optionOne: "minutely,daily,alerts" }
        ],
        units: "imperial",
        lang: "en"
    },
    dateFormat: 'en-us',
    dateFormatOptions: {
        hour: '2-digit',
        minute: '2-digit'
    },
    electronBrowserOption: {
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        fullscreen: true,
        backgroundColor: "#000000",
        autoHideMenuBar: true,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    },
    index: "/src/index.html",
    image: {
        clouds: `${IMG_DIR}/clouds.svg`,
        cloudyNight: `${IMG_DIR}/cloudyNight.svg`,
        moon: `${IMG_DIR}/moon.svg`,
        rain: `${IMG_DIR}/rain.svg`,
        startup: `${IMG_DIR}/startup.svg`,
        sun: `${IMG_DIR}/sun.svg`,
        sunClouds: `${IMG_DIR}/sunClouds.svg`
    },
    months: [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ],
    splashScreen: "/src/splash.html",
    strava: {
        //REPLACE ALL CLIENT ID, SECRET, AND REFRESH WITH YOUR OWN
        activities_per_week: "?before=1602590399&after=1602460800",
        client_id: "",
        client_secret: "",
        grant_type: "refresh_token",
        strava_refreshToken: ""
    },
    stravaAtheleteEndpoint: "https://www.strava.com/api/v3/athlete/activities",
    stravaTokenRefreshEndpoint: "https://www.strava.com/oauth/token",
    weatherApiBase: "https://api.openweathermap.org/data/",
    weatherApiEndpoint: "weather",
    //PASTE API KEY HERE
    weatherApiKey: "",
    weatherApiParams: {
        cityName: "Pittsburgh",
        cityId: "5206379",                         //found in API docs
        units: "imperial",
        lang: "en",
    },
    weatherApiUpdateInterval: 10 * 60 * 1000,      //every 10 min per api docs
    weatherApiVersion: "2.5",
}

module.exports = config;