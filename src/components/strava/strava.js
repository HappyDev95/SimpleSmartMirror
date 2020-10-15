(function () {

    var shortLivedAccessToken = undefined;
    var weeklyStats = {
        weeklyRunsTotal: null,
        weeklyMilage: null,
        weeklyTotalMinutes: null
    };

    function refreshAccessToken() {
        logger.logDebug("refresshing access tokens for strava");
        try {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", config.stravaTokenRefreshEndpoint, true);

            //Send the proper header information along with the request
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");

            //set body of request
            var body = {
                client_id: config.strava.client_id,
                client_secret: config.strava.client_secret,
                grant_type: config.strava.grant_type,
                refresh_token: config.strava.strava_refreshToken
            }

            //leaving this here for reference for now. 
            //this was for setup to authenticate a change in the permissions
            //this app has to a Strava athlete's viewable data
            //if you wish to change the permissions to say 'activity:read_all'
            //to read all activities, you'll have to resend the req via this body
            //var body = {
            //    client_id: config.strava.client_id,
            //    client_secret: config.strava.client_secret,
            //    code: "", //this code is generated by strava when you change your permissions
            //    grant_type: "authorization_code"
            //}

            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        //maybe we should return a promise?
                        //refresh our token
                        processRefreshTokenResponse(JSON.parse(this.response));
                        //use getStravaData() to send another HTTP req
                        getStravaData();
                    } else {
                        logger.logError("Error sending Strava Refresh Token HTTP request");
                    }                  
                }
            };
            xhr.send(JSON.stringify(body));
        } catch (err) {
            logger.logError(err);
        }
    }

    /*
     * For more information on the topic see https://developers.strava.com/docs/reference/#api-models-ActivityStats
     * There's a TON of categories
     */
    function getStravaData() {
        try {
            let request = new XMLHttpRequest();
            request.open(
                "GET",
                `${config.stravaAtheleteEndpoint}${config.strava.activities_per_week}`,
                true);

            console.log("shortLivedAcces = " + shortLivedAccessToken);

            request.setRequestHeader("Authorization", `Bearer ${shortLivedAccessToken}`);
            request.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status == 200) {
                        processStravaDataResponse(JSON.parse(this.response));
                    } else {
                        logger.logError(`Error making HTTP request to ${config.stravaAtheleteEndpoint}`);
                    }
                }
            };
            request.send();
        } catch (error) {
            logger.logError(`Problem calling Strava Api : ${error}`);
            return;
        }
    }

    function processStravaDataResponse(data) {
        logger.log("Processing response from Strava Athlete Api");

        if (data === undefined || !Array.isArray(data)) {
            logger.logDebug("The data returned from the http request was undefined or the data returned was not an array");
            return;
        }

        //each element in the array is an activty that was recorded
        data.forEach(function parseActivityObj(activity) {
            if (activity.type.toLowerCase() === "run") {

                weeklyStats.weeklyRunsTotal += 1;

                if (activity.distance != undefined) {
                    //convert meters to miles
                    weeklyStats.weeklyMilage += (activity.distance * 0.000621371);
                }

                if (activity.elapsed_time != undefined) {
                    //convert sec to minutes
                    weeklyStats.weeklyTotalMinutes += (activity.elapsed_time / 60);
                }
            }            
        });

        console.log("weeklyStats");
        console.log(weeklyStats);
        renderStravaHtml();
    }

    function processRefreshTokenResponse(data) {
        logger.log("Processing response from Strava Refresh Token");

        console.log(data);

        if (data === undefined || data.access_token === undefined) {
            logger.logDebug("The data returned from the http request was undefined or there was no access_token");
            return;
        }

        shortLivedAccessToken = data.access_token;
        config.strava.strava_refreshToken = data.refresh_token;
    }

    function renderStravaHtml() {
        logger.logDebug("Rendering the Strava Component HTML DOM");


        let weeklyActivitiesContainer = document.createElement("div");
        let weeklyMilageContainer = document.createElement("div");
        let weeklyTotalMinutesContainer = document.createElement("div");

        let weeklyActivitesHeader = document.createElement("h1");
        let weeklyMilageHeader = document.createElement("h1");
        let weeklyTotalMinutesHeader = document.createElement("h1");

        weeklyActivitesHeader.innerText = "Total Runs";
        weeklyMilageHeader.innerText = "Total Milage";
        weeklyTotalMinutesHeader.innerText = "Total Minutes";

        document.getElementById("topRightContainer").appendChild(weeklyActivitiesContainer);
        document.getElementById("topRightContainer").appendChild(weeklyMilageContainer);
        document.getElementById("topRightContainer").appendChild(weeklyTotalMinutesContainer);

        weeklyActivitiesContainer.appendChild(weeklyActivitesHeader);
        weeklyMilageContainer.appendChild(weeklyMilageHeader);
        weeklyTotalMinutesContainer.appendChild(weeklyTotalMinutesHeader);

        weeklyActivitiesContainer.appendChild(document.createTextNode(weeklyStats.weeklyRunsTotal));
        weeklyMilageContainer.appendChild(document.createTextNode(weeklyStats.weeklyMilage.toFixed(2)));
        weeklyTotalMinutesContainer.appendChild(document.createTextNode(weeklyStats.weeklyTotalMinutes));
    }

    refreshAccessToken();
    //TODO:     renderStravaHtml(); once you make other functions into promises... theres no reason
    //we cant render the HTML after thats done... think about this

})();