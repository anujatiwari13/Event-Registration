interface EventDetail {
    serialNo: number;
    name: string;
    date: string;
    time: string;
}

let events: EventDetail[] = [
    { serialNo: 1, name: "Event 1", date: "2023-06-24", time: "10:00" },
    { serialNo: 2, name: "Event 2", date: "2023-06-25", time: "11:00" },
    // Add more initial events here
];

let currentPage = 1;
const eventsPerPage = 5;
let currentSortColumn: string | null = null;
let sortDirection: number = 1; // 1 for ascending, -1 for descending

document.getElementById('eventForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('eventName') as HTMLInputElement).value;
    const date = (document.getElementById('eventDate') as HTMLInputElement).value;
    const time = (document.getElementById('eventTime') as HTMLInputElement).value;
    const newEvent: EventDetail = {
        serialNo: events.length + 1,
        name: name,
        date: date,
        time: time
    };
    events.push(newEvent);
    displayEvents();
    checkUpcomingEvents();
    (document.getElementById('eventForm') as HTMLFormElement).reset();
});

function displayEvents(filteredEvents?: EventDetail[]) {
    const tableBody = document.getElementById('eventTableBody') as HTMLTableSectionElement;
    tableBody.innerHTML = '';
    let eventsToDisplay = filteredEvents ? filteredEvents : events;
    let paginatedEvents = paginate(eventsToDisplay, currentPage, eventsPerPage);

    if (currentSortColumn) {
        paginatedEvents = sortEvents(paginatedEvents, currentSortColumn, sortDirection);
    }

    for (let i = 0; i < paginatedEvents.length; i++) {
        const event = paginatedEvents[i];
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = event.serialNo.toString();
        row.insertCell(1).innerText = event.name;
        row.insertCell(2).innerText = event.date;
        row.insertCell(3).innerText = event.time;

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm';
        editBtn.innerText = 'Edit';
        editBtn.onclick = () => editEvent(event.serialNo, row);
        row.insertCell(4).appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteEvent(event.serialNo);
        row.insertCell(5).appendChild(deleteBtn);
    }

    setupPagination();
}

function editEvent(serialNo: number, row: HTMLTableRowElement) {
    for (let i = 0; i < events.length; i++) {
        if (events[i].serialNo === serialNo) {
            const nameCell = row.cells[1];
            const dateCell = row.cells[2];
            const timeCell = row.cells[3];

            nameCell.innerHTML = `<input type="text" value="${events[i].name}" class="form-control">`;
            dateCell.innerHTML = `<input type="date" value="${events[i].date}" class="form-control">`;
            timeCell.innerHTML = `<input type="time" value="${events[i].time}" class="form-control">`;

            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-success btn-sm';
            saveBtn.innerText = 'Save';
            saveBtn.onclick = () => saveEdit(serialNo, row);
            row.cells[4].innerHTML = '';
            row.cells[4].appendChild(saveBtn);

            break;
        }
    }
}

function saveEdit(serialNo: number, row: HTMLTableRowElement) {
    const nameInput = row.cells[1].querySelector('input') as HTMLInputElement;
    const dateInput = row.cells[2].querySelector('input') as HTMLInputElement;
    const timeInput = row.cells[3].querySelector('input') as HTMLInputElement;

    for (let i = 0; i < events.length; i++) {
        if (events[i].serialNo === serialNo) {
            events[i].name = nameInput.value;
            events[i].date = dateInput.value;
            events[i].time = timeInput.value;

            displayEvents();
            break;
        }
    }
}

function deleteEvent(serialNo: number) {
    events = events.filter(e => e.serialNo !== serialNo);
    displayEvents();
}

function paginate(array: EventDetail[], page: number, perPage: number) {
    return array.slice((page - 1) * perPage, page * perPage);
}

function sortEvents(array: EventDetail[], column: string, direction: number) {
    return array.sort((a, b) => {
        if (column === 'serialNo') {
            return direction * (a.serialNo - b.serialNo);
        } else if (column === 'name') {
            return direction * compareStrings(a.name, b.name);
        } else if (column === 'date') {
            return direction * compareDates(a.date, b.date);
        } else if (column === 'time') {
            return direction * compareTimes(a.time, b.time);
        }
        return 0;
    });
}

function compareStrings(a: string, b: string) {
    return a.localeCompare(b);
}

function compareDates(a: string, b: string) {
    const dateA = new Date(a).getTime();
    const dateB = new Date(b).getTime();
    return dateA - dateB;
}

function compareTimes(timeA: string, timeB: string) {
    const [hourA, minuteA] = timeA.split(':').map(Number);
    const [hourB, minuteB] = timeB.split(':').map(Number);

    if (hourA === hourB) {
        return minuteA - minuteB;
    }
    return hourA - hourB;
}

function setupPagination() {
    const paginationUl = document.querySelector('.pagination') as HTMLUListElement;
    paginationUl.innerHTML = '';
    const pageCount = Math.ceil(events.length / eventsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.className = 'page-item';
        const a = document.createElement('a');
        a.className = 'page-link';
        a.innerText = i.toString();
        a.href = '#';
        a.onclick = () => {
            currentPage = i;
            displayEvents();
        };
        li.appendChild(a);
        paginationUl.appendChild(li);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayEvents();
    checkUpcomingEvents();
});

document.getElementById('filterInput')?.addEventListener('input', () => {
    const filterValue = (document.getElementById('filterInput') as HTMLInputElement).value.trim().toLowerCase();
    const filteredEvents: EventDetail[] = filterEventsByName(filterValue);
    displayEvents(filteredEvents);
});

function filterEventsByName(name: string): EventDetail[] {
    if (!name) {
        return events;
    }
    return events.filter(event => containsName(event.name, name));
}

function containsName(eventName: string, searchTerm: string): boolean {
    eventName = eventName.toLowerCase();
    searchTerm = searchTerm.toLowerCase();

    return eventName.indexOf(searchTerm) !== -1;
}

document.querySelectorAll('.table-sortable th.sortable').forEach(headerCell => {
    headerCell.addEventListener('click', () => {
        const column = headerCell.getAttribute('data-column');
        if (column) {
            if (currentSortColumn === column) {
                sortDirection *= -1;
            } else {
                currentSortColumn = column;
                sortDirection = 1;
            }
            displayEvents();
        }
    });
});

function checkUpcomingEvents() {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000); // 10 minutes later

    const upcomingEvents = events.filter(event => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        return eventDateTime > now && eventDateTime <= tenMinutesLater;
    });

    if (upcomingEvents.length > 0) {
        const notificationBar = document.getElementById('notificationArea') as HTMLDivElement;
        const notificationList = document.getElementById('notificationList') as HTMLUListElement;

        notificationList.innerHTML = ''; // Clear existing notifications

        upcomingEvents.forEach(event => {
            const listItem = document.createElement('li');
            listItem.innerText = `${event.name} at ${event.time}`;
            notificationList.appendChild(listItem);
        });

        notificationBar.style.display = 'block'; // Show the notification bar

        // Play notification sound
        const notificationSound = document.getElementById('notificationSound') as HTMLAudioElement;
        notificationSound.play();

        // Show alert
        alert(`Upcoming Event: ${upcomingEvents.map(event => `${event.name} at ${event.time}`).join(', ')}`);
    } else {
        const notificationBar = document.getElementById('notificationArea') as HTMLDivElement;
        notificationBar.style.display = 'none'; // Hide the notification bar if no upcoming events
    }
}

// Clear notification button click event
document.getElementById('clearNotificationBtn')?.addEventListener('click', () => {
    const notificationList = document.getElementById('notificationList') as HTMLUListElement;
    notificationList.innerHTML = ''; // Clear notification list

    const notificationBar = document.getElementById('notificationArea') as HTMLDivElement;
    notificationBar.style.display = 'none'; // Hide the notification bar
});

document.addEventListener('DOMContentLoaded', () => {
    displayEvents();
    checkUpcomingEvents();
});
