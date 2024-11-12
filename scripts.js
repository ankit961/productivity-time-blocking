const calendarContainer = document.getElementById("calendar-container");
const schedulerContainer = document.getElementById("scheduler-container");
const schedulerGrid = document.getElementById("scheduler-grid");
const taskModal = document.getElementById("task-modal");
const taskInput = document.getElementById("task-input");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const selectedDateDisplay = document.getElementById("selected-date-display");
let selectedDate = null;
let selectedSlotId = null;
let currentYear, currentMonth;

// Initialize Calendar
function initCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
    checkForUpcomingTasks();
}

// Render Calendar for Current Month
function renderCalendar() {
    document.getElementById("calendar-month").textContent = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" });
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        calendarGrid.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.textContent = day;
        const dateKey = new Date(currentYear, currentMonth, day).toDateString();
        
        if (hasTasksForDate(dateKey)) {
            const indicator = document.createElement("div");
            indicator.className = "task-indicator";
            dayElement.appendChild(indicator);
        }

        // Add check to prevent past date selection
        const selectedDate = new Date(currentYear, currentMonth, day);
        if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
            dayElement.classList.add("past-date");
        } else {
            dayElement.onclick = () => selectDate(selectedDate);
        }

        calendarGrid.appendChild(dayElement);
    }
}

// Check if there are tasks for a specific date
function hasTasksForDate(date) {
    const savedSchedule = JSON.parse(localStorage.getItem("timeBlockingSchedule")) || {};
    return savedSchedule[date] && Object.keys(savedSchedule[date]).some(slot => savedSchedule[date][slot].task !== "");
}

// Select a Date and Show Scheduler
function selectDate(date) {
    selectedDate = date;
    selectedDateDisplay.textContent = date.toDateString();
    showScheduler();
    loadScheduler();
}

// Show Calendar
function showCalendar() {
    calendarContainer.style.display = "flex";
    schedulerContainer.style.display = "none";
}

// Show Scheduler View
function showScheduler() {
    calendarContainer.style.display = "none";
    schedulerContainer.style.display = "block";
}

// Navigate to Previous Month
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

// Navigate to Next Month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Load Scheduler for Selected Date
function loadScheduler() {
    schedulerGrid.innerHTML = "";
    const startTime = 6;
    const endTime = 22;

    for (let hour = startTime; hour <= endTime; hour++) {
        const timeSlot = document.createElement("div");
        timeSlot.className = "time-slot";
        timeSlot.id = `slot-${hour}`;
        timeSlot.draggable = true;
        timeSlot.ondragstart = drag;
        timeSlot.ondragover = allowDrop;
        timeSlot.ondrop = drop;

        const timeLabel = document.createElement("span");
        timeLabel.textContent = formatHour(hour);

        const taskLabel = document.createElement("span");
        taskLabel.className = "task-label";

        timeSlot.appendChild(timeLabel);
        timeSlot.appendChild(taskLabel);
        timeSlot.onclick = () => openModal(`slot-${hour}`);

        schedulerGrid.appendChild(timeSlot);
    }

    loadSchedule();
}

// Format Hours
function formatHour(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const hourFormatted = hour % 12 || 12;
    return `${hourFormatted} ${period}`;
}

// Open Modal to Add/Edit Task
function openModal(slotId) {
    selectedSlotId = slotId;

    // If the selected date is today, check if the time is in the future
    if (selectedDate && selectedDate.toDateString() === new Date().toDateString()) {
        const currentHour = new Date().getHours();
        const slotHour = parseInt(slotId.split("-")[1], 10);
        
        if (slotHour < currentHour) {
            alert("You cannot add tasks for past times.");
            return;
        }
    }

    taskModal.style.display = "flex";
    const taskData = loadTaskData(slotId);

    taskInput.value = taskData.task || "";
    startTimeInput.value = taskData.startTime || "";
    endTimeInput.value = taskData.endTime || "";
}

// Load task data for a specific slot
function loadTaskData(slotId) {
    if (!selectedDate) return {};
    const savedSchedule = JSON.parse(localStorage.getItem("timeBlockingSchedule")) || {};
    return savedSchedule[selectedDate.toDateString()]?.[slotId] || {};
}

// Close Modal
function closeModal() {
    taskModal.style.display = "none";
    taskInput.value = "";
    startTimeInput.value = "";
    endTimeInput.value = "";
}

// Save Task
function saveTask() {
    if (selectedSlotId && taskInput.value.trim() !== "") {
        // Prevent saving task if the start time is in the past for today
        if (selectedDate && selectedDate.toDateString() === new Date().toDateString()) {
            const currentTime = new Date();
            const selectedStartTime = startTimeInput.value;

            // Ensure start time input is provided
            if (!selectedStartTime) {
                alert("Please specify a valid start time.");
                return;
            }

            // Parse the selected start time
            const [startHour, startMinute] = selectedStartTime.split(":").map(Number);
            const startTime = new Date();
            startTime.setHours(startHour, startMinute, 0, 0);

            // Check if the start time is in the past compared to the current time
            if (startTime < currentTime) {
                alert("Start time cannot be in the past.");
                return;
            }
        }

        const taskLabel = document.getElementById(selectedSlotId).querySelector(".task-label");
        taskLabel.textContent = `${taskInput.value} (${startTimeInput.value} - ${endTimeInput.value})`;
        taskLabel.style.backgroundColor = getRandomColor();

        saveSchedule();
        closeModal();
        renderCalendar();
    }
}

// Save Schedule to Local Storage
function saveSchedule() {
    if (!selectedDate) return;
    const schedule = JSON.parse(localStorage.getItem("timeBlockingSchedule")) || {};
    schedule[selectedDate.toDateString()] = schedule[selectedDate.toDateString()] || {};

    const taskData = {
        task: taskInput.value.trim(),
        startTime: startTimeInput.value,
        endTime: endTimeInput.value
    };
    schedule[selectedDate.toDateString()][selectedSlotId] = taskData;
    
    localStorage.setItem("timeBlockingSchedule", JSON.stringify(schedule));
}

// Load Schedule from Local Storage
function loadSchedule() {
    if (!selectedDate) return;
    const savedSchedule = JSON.parse(localStorage.getItem("timeBlockingSchedule"));
    if (savedSchedule && savedSchedule[selectedDate.toDateString()]) {
        Object.keys(savedSchedule[selectedDate.toDateString()]).forEach(slotId => {
            const taskData = savedSchedule[selectedDate.toDateString()][slotId];
            const taskLabel = document.getElementById(slotId)?.querySelector(".task-label");
            if (taskLabel && taskData.task) {
                taskLabel.textContent = `${taskData.task} (${taskData.startTime} - ${taskData.endTime})`;
                taskLabel.style.backgroundColor = getRandomColor();
            }
        });
    }
}

// Drag-and-Drop
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("text");
    const sourceTask = document.getElementById(sourceId).querySelector(".task-label");
    const targetTask = event.target.querySelector(".task-label");

    const tempText = sourceTask.textContent;
    sourceTask.textContent = targetTask.textContent;
    targetTask.textContent = tempText;
    saveSchedule();
}

// Get Random Color
function getRandomColor() {
    const colors = ["#f28b82", "#fbbc04", "#fff475", "#ccff90", "#a7ffeb", "#cbf0f8", "#aecbfa", "#d7aefb"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Check for Upcoming Tasks (Optional Notification)
function checkForUpcomingTasks() {
    setInterval(() => {
        const now = new Date();
        const dateKey = now.toDateString();
        const hour = now.getHours();
        const savedSchedule = JSON.parse(localStorage.getItem("timeBlockingSchedule")) || {};

        if (savedSchedule[dateKey] && savedSchedule[dateKey][`slot-${hour}`]) {
            const task = savedSchedule[dateKey][`slot-${hour}`].task;
            if (task) {
                showNotification(`Upcoming Task: ${task}`, "You have a task scheduled for this hour.");
            }
        }
    }, 60000); // Check every minute
}

// Show a Notification
function showNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    } else {
        alert(`${title}\n${message}`);
    }
}

// Initialize Calendar on Page Load
document.addEventListener("DOMContentLoaded", () => {
    initCalendar();

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});
