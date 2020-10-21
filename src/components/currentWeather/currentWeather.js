(function () {
    var hourlyArr = [];
    var sunriseSunset = {};

    function currentWeatherInit() {
        logger.log("Displaying Current Weather component");
        let reqUrl = getCurrentWeatherRequestParams();
        logger.logDebug(`Request url is ${reqUrl}`);

        try {
            let request = new XMLHttpRequest();
            request.open("GET", reqUrl, true);
            request.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        processCurrentWeather(JSON.parse(this.response));
                        renderCurrentWeatherHtml();
                    } else {
                        logger.logError(`Something went wrong with the HTTP request... try again`);
                    }
                } else {
                    logger.logError(`Error making HTTP request to ${reqUrl}`);
                }
            };
            request.send();
        } catch (error) {
            logger.logError(`Problem calling weather Api: ${error}`);
            return;
        }
    }

    /*
     * From Weather API docs. Example Request:
     * api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=hourly,daily
     * &appid={API key}
     */
    function getCurrentWeatherRequestParams() {
        let requestUrl = `${config.weatherApiBase}${config.weatherApiVersion}/${config.currentWeatherApiEndpoint}`;
        requestUrl += `?lat=${config.currentWeatherApiParams.latitude}&lon=${config.currentWeatherApiParams.longitude}`;
        requestUrl += `&exclude=${config.currentWeatherApiParams.exclude[0].optionOne}`;
        requestUrl += `&units=${config.currentWeatherApiParams.units}&lang=${config.currentWeatherApiParams.lang}`;
        requestUrl += `&appid=${config.weatherApiKey}`;
        return requestUrl;
    }

    function processCurrentWeather(data) {
        logger.logDebug("Processing response from Current Weather api");

        if (data === undefined || data.hourly === undefined || data.hourly.length < 1) {
            logger.logDebug("The data returned from the http request was undefined or had no temperature attribute");
            return;
        }

        //get sunrise and sunset from 'current' object returned
        sunriseSunset.sunrise = new Date(data.current.sunrise * 1000);
        sunriseSunset.sunset = new Date(data.current.sunset * 1000);

        //exclude the current hour and get the next 10 hours                                                                     1
        for (let i = 1; i < 12; i++) {
            let currentWeather = {};
            currentWeather.time = util.convertDateToEstHours(data.hourly[i].dt);
            currentWeather.temp = data.hourly[i].temp;
            currentWeather.feelsLike = data.hourly[i].feels_like;
            currentWeather.clouds = data.hourly[i].clouds;
            currentWeather.weatherType = data.hourly[i].weather[0].main;
            currentWeather.description = data.hourly[i].weather[0].description;
            hourlyArr.push(currentWeather);
        }
    }

    function renderCurrentWeatherHtml() {
        logger.logDebug("Rendering the Current Weather Component HTML DOM");

        let weatherTable = document.createElement("table");
        weatherTable.id = "weatherTable";
        document.getElementById("botLeftContainer").appendChild(weatherTable);

        hourlyArr.forEach((hourlyObj) => {
            let row = document.createElement("tr");
            row.id = "weatherContent";
            let timeCol = document.createElement("td");
            timeCol.id = "time";
            let imgCol = document.createElement("td");
            imgCol.id = "currentWeatherColumnImg";
            let img = document.createElement("img");
            let currTempHourly = document.createElement("td");
            currTempHourly.id = 'currentTempHourly';

            for (const property in hourlyObj) {

                let dataCol = document.createElement("td");
                dataCol.id = "currentWeatherColumnData";

                switch (property) {
                    case "time":
                        timeCol.innerText += util.formatHours(hourlyObj[property]) + ":00";
                        break;
                    case "temp":
                        currTempHourly.innerText += `${hourlyObj[property].toFixed(0)}`;
                        currTempHourly.innerHTML += "<span>&#176;</span>";
                        break;
                    case "feelsLike":
                        dataCol.innerText += `Feels Like: ${hourlyObj[property].toFixed(0)}`;
                        dataCol.innerHTML += "<span>&#176;</span>";
                        break;
                    case "clouds":
                        dataCol.innerText += `Cloudiness: ${hourlyObj[property]}%`;
                        break;
                    case "weatherType":
                        let hour = hourlyObj["time"];

                        if (((hour < 12) && (hour <= sunriseSunset.sunrise.getHours()))
                            || ((hour > 12) && (hour >= sunriseSunset.sunset.getHours()))) {
                            img.src = util.getImageSrc(hourlyObj[property], true);
                        } else {
                            img.src = util.getImageSrc(hourlyObj[property], false, hourlyObj["description"]);
                        }

                        imgCol.appendChild(img);
                        break;
                    case "description":
                        dataCol.innerText += hourlyObj[property];
                        break;
                    default:
                        break;
                }

                //when property == 'time' || "weatherType " || "temp" we dont need
                //to appendChild. If we omit this then an extra <td> will be added to the DOM
                if ((property != "time") && (property != "weatherType") && (property != "temp")) {
                    row.appendChild(dataCol);
                }
            }

            row.prepend(currTempHourly);
            row.prepend(imgCol);
            row.prepend(timeCol);
            document.getElementById("weatherTable").appendChild(row);
        });
    }

    currentWeatherInit();
})();