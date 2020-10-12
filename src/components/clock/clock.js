(function () {
    function clockInit() {
        logger.log("Displaying clock component...");
        let clockContainer = document.createElement("div");
        clockContainer.id = "clockContainer";
        document.getElementById("topLeftContainer").appendChild(clockContainer);

        let clockTimeHeader = document.createElement("h1");
        clockTimeHeader.id = "clockTimeHeader";
        let clockSecondsHeader = document.createElement("h2");
        clockSecondsHeader.id = "clockSecondsHeader";
        let clockAmPmHeader = document.createElement("h2");
        clockAmPmHeader.id = "clockAmPmHeader";

        document.getElementById("clockContainer").appendChild(clockTimeHeader);
        document.getElementById("clockContainer").appendChild(clockSecondsHeader);
        document.getElementById("clockContainer").appendChild(clockAmPmHeader);

        setInterval(clockTimer, 1000);
    }

    function clockTimer() {
        let time = new Date();
        let hours = time.getHours();
        let seconds = time.getSeconds();
        seconds = seconds < 10 ? "0" + seconds : seconds
        let amPm = "AM";

        if (hours > 12) {
            amPm = "PM";
        }

        let currTime = util.stripAmPm(
            time.toLocaleTimeString(config.dateFormat, config.dateFormatOptions));

        clockTimeHeader.innerText = currTime;
        clockSecondsHeader.innerText = seconds;
        clockAmPmHeader.innerText = amPm;
    }

    clockInit();
})();