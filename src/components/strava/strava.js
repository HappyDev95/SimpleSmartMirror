(function () {

    var shortLivedAccessToken = undefined;

    function refreshAccessToken() {
        console.log("refresshing access tokens for strava");
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
            //if you wish to change the permissions say 'activity:read_all'
            //to read all activities, you'll have to resend the req via this body
            //var body = {
            //    client_id: config.strava.client_id,
            //    client_secret: config.strava.client_secret,
            //    code: "",
            //    grant_type: "authorization_code"
            //}

            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE) {
                    if (this.status === 200) {
                        //maybe we should return a promise?
                        processRefreshTokenResponse(JSON.parse(this.response));
                        //get our strava data
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
                        console.log(JSON.parse(this.response));
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

    function processRefreshTokenResponse(data) {
        logger.logDebug("Processing response from Strava Refresh Token");

        console.log(data);

        if (data === undefined || data.access_token === undefined) {
            logger.logDebug("The data returned from the http request was undefined or there was no access_token");
            return;
        }

        shortLivedAccessToken = data.access_token;

        //TODO: Not sure if I like messing with a config file?
        //Maybe pull this into a separate config file... hmm
        //resetting refresh token in config file for next use
        config.strava.strava_refreshToken = data.refresh_token;
    }

    refreshAccessToken();
})();