(function () {
    function calendarInit() {
        logger.log("Initializing Calendar Module");

        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        displayCalendar(today, currentMonth, currentYear);
    }

    function displayCalendar(today, month, year) {
        logger.log("Loading Calendar into DOM");

        setupCalendarHtml();

        let firstDay = (new Date(year, month)).getDay();
        
        let calendar = document.getElementById("calendar-body");
        calendarHeader.innerText = config.months[month] + " " + year;

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    let cell = document.createElement("td");
                    let cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > daysInMonth(month, year)) {
                    break;
                } else {
                    let cell = document.createElement("td");
                    let cellText = undefined;

                    if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                        cellText = document.createElement("span");
                        cellText.id = "calendarTodaysDate";
                        cellText.innerText = date;
                    } else {
                        cellText = document.createTextNode(date);
                    }

                    cell.appendChild(cellText);
                    row.appendChild(cell);
                    date++;
                }
            }
            row.id = "calendarRow";
            calendar.appendChild(row);
        }
    }

    function setupCalendarHtml() {
        let calendarHeader = document.createElement("h1");
        calendarHeader.id = "calendarHeader";
        document.getElementById("calendarContainer").prepend(calendarHeader);

        let calendarTable = document.createElement("table");
        calendarTable.id = "calendar";
        document.getElementById("calendarContainer").append(calendarTable);

        let calendarTableHeader = document.createElement("thead");
        calendarTable.appendChild(calendarTableHeader);

        let calendarTableHeaderRow = document.createElement("tr");
        calendarTableHeader.appendChild(calendarTableHeaderRow);

        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Sun";
        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Mon";
        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Tue";
        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Wed";
        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Thu";
        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Fri";
        calendarTableHeaderRow.appendChild(document.createElement("th")).innerText = "Sat";

        let tableBody = document.createElement("tbody");
        tableBody.id = "calendar-body";
        calendarTable.appendChild(tableBody);
    }

    function daysInMonth(month, year) {
        return 32 - new Date(year, month, 32).getDate();
    }

    calendarInit();
})();