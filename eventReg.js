var _a, _b, _c;
var events = [
    { serialNo: 1, name: "Event 1", date: "2023-06-24", time: "10:00" },
    { serialNo: 2, name: "Event 2", date: "2023-06-25", time: "11:00" },
    // Add more initial events here
];
var currentPage = 1;
var eventsPerPage = 5;
var currentSortColumn = null;
var sortDirection = 1; // 1 for ascending, -1 for descending
(_a = document.getElementById('eventForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('eventName').value;
    var date = document.getElementById('eventDate').value;
    var time = document.getElementById('eventTime').value;
    var newEvent = {
        serialNo: events.length + 1,
        name: name,
        date: date,
        time: time
    };
    events.push(newEvent);
    displayEvents();
    checkUpcomingEvents();
    document.getElementById('eventForm').reset();
});
function displayEvents(filteredEvents) {
    var tableBody = document.getElementById('eventTableBody');
    tableBody.innerHTML = '';
    var eventsToDisplay = filteredEvents ? filteredEvents : events;
    var paginatedEvents = paginate(eventsToDisplay, currentPage, eventsPerPage);
    if (currentSortColumn) {
        paginatedEvents = sortEvents(paginatedEvents, currentSortColumn, sortDirection);
    }
    var _loop_1 = function (i) {
        var event_1 = paginatedEvents[i];
        var row = tableBody.insertRow();
        row.insertCell(0).innerText = event_1.serialNo.toString();
        row.insertCell(1).innerText = event_1.name;
        row.insertCell(2).innerText = event_1.date;
        row.insertCell(3).innerText = event_1.time;
        var editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm';
        editBtn.innerText = 'Edit';
        editBtn.onclick = function () { return editEvent(event_1.serialNo, row); };
        row.insertCell(4).appendChild(editBtn);
        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = function () { return deleteEvent(event_1.serialNo); };
        row.insertCell(5).appendChild(deleteBtn);
    };
    for (var i = 0; i < paginatedEvents.length; i++) {
        _loop_1(i);
    }
    setupPagination();
}
function editEvent(serialNo, row) {
    for (var i = 0; i < events.length; i++) {
        if (events[i].serialNo === serialNo) {
            var nameCell = row.cells[1];
            var dateCell = row.cells[2];
            var timeCell = row.cells[3];
            nameCell.innerHTML = "<input type=\"text\" value=\"".concat(events[i].name, "\" class=\"form-control\">");
            dateCell.innerHTML = "<input type=\"date\" value=\"".concat(events[i].date, "\" class=\"form-control\">");
            timeCell.innerHTML = "<input type=\"time\" value=\"".concat(events[i].time, "\" class=\"form-control\">");
            var saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-success btn-sm';
            saveBtn.innerText = 'Save';
            saveBtn.onclick = function () { return saveEdit(serialNo, row); };
            row.cells[4].innerHTML = '';
            row.cells[4].appendChild(saveBtn);
            break;
        }
    }
}
function saveEdit(serialNo, row) {
    var nameInput = row.cells[1].querySelector('input');
    var dateInput = row.cells[2].querySelector('input');
    var timeInput = row.cells[3].querySelector('input');
    for (var i = 0; i < events.length; i++) {
        if (events[i].serialNo === serialNo) {
            events[i].name = nameInput.value;
            events[i].date = dateInput.value;
            events[i].time = timeInput.value;
            displayEvents();
            break;
        }
    }
}
function deleteEvent(serialNo) {
    events = events.filter(function (e) { return e.serialNo !== serialNo; });
    displayEvents();
}
function paginate(array, page, perPage) {
    return array.slice((page - 1) * perPage, page * perPage);
}
function sortEvents(array, column, direction) {
    return array.sort(function (a, b) {
        if (column === 'serialNo') {
            return direction * (a.serialNo - b.serialNo);
        }
        else if (column === 'name') {
            return direction * compareStrings(a.name, b.name);
        }
        else if (column === 'date') {
            return direction * compareDates(a.date, b.date);
        }
        else if (column === 'time') {
            return direction * compareTimes(a.time, b.time);
        }
        return 0;
    });
}
function compareStrings(a, b) {
    return a.localeCompare(b);
}
function compareDates(a, b) {
    var dateA = new Date(a).getTime();
    var dateB = new Date(b).getTime();
    return dateA - dateB;
}
function compareTimes(timeA, timeB) {
    var _a = timeA.split(':').map(Number), hourA = _a[0], minuteA = _a[1];
    var _b = timeB.split(':').map(Number), hourB = _b[0], minuteB = _b[1];
    if (hourA === hourB) {
        return minuteA - minuteB;
    }
    return hourA - hourB;
}
function setupPagination() {
    var paginationUl = document.querySelector('.pagination');
    paginationUl.innerHTML = '';
    var pageCount = Math.ceil(events.length / eventsPerPage);
    var _loop_2 = function (i) {
        var li = document.createElement('li');
        li.className = 'page-item';
        var a = document.createElement('a');
        a.className = 'page-link';
        a.innerText = i.toString();
        a.href = '#';
        a.onclick = function () {
            currentPage = i;
            displayEvents();
        };
        li.appendChild(a);
        paginationUl.appendChild(li);
    };
    for (var i = 1; i <= pageCount; i++) {
        _loop_2(i);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    displayEvents();
    checkUpcomingEvents();
});
(_b = document.getElementById('filterInput')) === null || _b === void 0 ? void 0 : _b.addEventListener('input', function () {
    var filterValue = document.getElementById('filterInput').value.trim().toLowerCase();
    var filteredEvents = filterEventsByName(filterValue);
    displayEvents(filteredEvents);
});
function filterEventsByName(name) {
    if (!name) {
        return events;
    }
    return events.filter(function (event) { return containsName(event.name, name); });
}
function containsName(eventName, searchTerm) {
    eventName = eventName.toLowerCase();
    searchTerm = searchTerm.toLowerCase();
    return eventName.indexOf(searchTerm) !== -1;
}
document.querySelectorAll('.table-sortable th.sortable').forEach(function (headerCell) {
    headerCell.addEventListener('click', function () {
        var column = headerCell.getAttribute('data-column');
        if (column) {
            if (currentSortColumn === column) {
                sortDirection *= -1;
            }
            else {
                currentSortColumn = column;
                sortDirection = 1;
            }
            displayEvents();
        }
    });
});
function checkUpcomingEvents() {
    var now = new Date();
    var tenMinutesLater = new Date(now.getTime() + 10 * 60000); // 10 minutes later
    var upcomingEvents = events.filter(function (event) {
        var eventDateTime = new Date("".concat(event.date, "T").concat(event.time));
        return eventDateTime > now && eventDateTime <= tenMinutesLater;
    });
    if (upcomingEvents.length > 0) {
        var notificationBar = document.getElementById('notificationArea');
        var notificationList_1 = document.getElementById('notificationList');
        notificationList_1.innerHTML = ''; // Clear existing notifications
        upcomingEvents.forEach(function (event) {
            var listItem = document.createElement('li');
            listItem.innerText = "".concat(event.name, " at ").concat(event.time);
            notificationList_1.appendChild(listItem);
        });
        notificationBar.style.display = 'block'; // Show the notification bar
        // Play notification sound
        var notificationSound = document.getElementById('notificationSound');
        notificationSound.play();
        // Show alert
        alert("Upcoming Event: ".concat(upcomingEvents.map(function (event) { return "".concat(event.name, " at ").concat(event.time); }).join(', ')));
    }
    else {
        var notificationBar = document.getElementById('notificationArea');
        notificationBar.style.display = 'none'; // Hide the notification bar if no upcoming events
    }
}
// Clear notification button click event
(_c = document.getElementById('clearNotificationBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    var notificationList = document.getElementById('notificationList');
    notificationList.innerHTML = ''; // Clear notification list
    var notificationBar = document.getElementById('notificationArea');
    notificationBar.style.display = 'none'; // Hide the notification bar
});
document.addEventListener('DOMContentLoaded', function () {
    displayEvents();
    checkUpcomingEvents();
});
