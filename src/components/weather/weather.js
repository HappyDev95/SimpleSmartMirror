(function () {
    var weather = {};

    function weatherInit() {
        logger.log("Displaying weather component");
        let reqUrl = getWeatherRequestParams();
        logger.logDebug(`Request url is ${reqUrl}`);

        try {
            let request = new XMLHttpRequest();
            request.open("GET", reqUrl, true);
            request.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        processResponse(JSON.parse(this.response));
                        renderWeatherHtml();
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
     * api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
     */
    function getWeatherRequestParams() {
        let requestUrl = `${config.weatherApiBase}${config.weatherApiVersion}/${config.weatherApiEndpoint}`;
        requestUrl += `?id=${config.weatherApiParams.cityId}&appid=${config.weatherApiKey}`;
        requestUrl += `&units=${config.weatherApiParams.units}&lang=${config.weatherApiParams.lang}`;
        return requestUrl;
    }

    function processResponse(data) {
        logger.logDebug("Processing response from weather api");

        if (data === undefined || data.main.temp === undefined) {
            logger.logDebug("The data returned from the http request was undefined or had no temperature attribute");
            return;
        }

        weather.temperature = data.main.temp;
        weather.tempMin = data.main.temp_max;
        weather.tempMax = data.main.temp_min;
        weather.feelsLike = data.main.feels_like;
        weather.humidity = parseFloat(data.main.humidity);
        weather.wind = data.wind.speed;
        weather.cloudPercentage = data.clouds.all;
        weather.sunrise = util.convertDateToEst(data.sys.sunrise);
        weather.sunset = util.convertDateToEst(data.sys.sunset);
        weather.weatherType = data.weather[0].main;
        weather.weatherDescription = data.weather[0].description;
    }

    function renderWeatherHtml() {
        logger.logDebug("Rendering the Weather Component HTML DOM");

        let weatherContainer = document.createElement("div");
        weatherContainer.id = "weatherContainer";
        document.getElementById("centerLeftContainer").appendChild(weatherContainer);

        let weatherHeaderContainer = document.createElement("div");
        weatherHeaderContainer.id = "weatherHeaderContainer";
        let weatherNowImg = document.createElement("img");
        weatherNowImg.id = "weatherMainLogo";

        let currTime = new Date()
            .toLocaleTimeString(config.dateFormat, config.dateFormatOptions);

        if (currTime < weather.sunset) {
            weatherNowImg.src = util.getImageSrc(weather.weatherType, false);
        } else {
            weatherNowImg.src = util.getImageSrc(weather.weatherType, true);
        }

        weatherHeaderContainer.appendChild(weatherNowImg);
        document.getElementById("centerLeftContainer").prepend(weatherHeaderContainer);

        let currentTempHeader = document.createElement("h1");
        currentTempHeader.id = "currentTempHeader";
        currentTempHeader.innerHTML = weather.temperature;
        currentTempHeader.innerHTML += "<span>&#176;</span>";
        document.getElementById("weatherHeaderContainer").append(currentTempHeader);

        for (const property in weather) {
            let newElement = document.createElement("p");
            newElement.id = "weatherProperty";

            switch (property) {
                case "humidity":
                    newElement.innerText += `Humidity: ${weather[property]}`;
                    break;
                case "feelsLike":
                    newElement.innerText += `Feels like temp: ${weather[property].toFixed(0)}`;
                    newElement.innerHTML += "<span>&#176;</span>";
                    break;
                case "tempMin":
                    newElement.innerText += `Min Temperature: ${weather[property]}`;
                    newElement.innerHTML += "<span>&#176;</span>";
                    break;
                case "tempMax":
                    newElement.innerText += `Max Temperature: ${weather[property]}`;
                    newElement.innerHTML += "<span>&#176;</span>";
                    break;
                case "wind":
                    newElement.innerText += `Wind: ${weather[property]}`;
                    break;
                case "cloudPercentage":
                    newElement.innerText += `Cloud Percentage: ${weather[property]}`;
                    newElement.innerHTML += "<span>&#37;</span>";
                    break;
                case "sunrise":
                    newElement.innerText += `Sunrise Time: ${weather[property]}`;
                    break;
                case "sunset":
                    newElement.innerText += `Sunset Time: ${weather[property]}`;
                    break;
                case "weatherDescription":
                    newElement.innerText += `Description: ${weather[property]}`;
                    break;
                default:
                    break;
            }

            //when property == 'weatherType' or property == "temperature" we dont need
            //to appendChild. If we omit this then an extra <p> will be added to the DOM
            if ((property != "weatherType") && (property != "temperature")) {
                document.getElementById("weatherContainer").appendChild(newElement);
            }
        }
    }

    weatherInit();
})();