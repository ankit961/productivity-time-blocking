

# Time Blocking Scheduler

A **Time Blocking Scheduler** web app to help users organize their day effectively by scheduling tasks with specific start and end times. This app allows users to select dates, view daily schedules, add tasks, and receive notifications for upcoming tasks. Built with HTML, CSS, and JavaScript, it provides an interactive calendar and scheduler with validations to prevent scheduling tasks in the past.

---

## Features

- **Calendar View**: View monthly calendar and select specific dates.
- **Daily Scheduler**: Add tasks with specific start and end times for each day.
- **Start and End Time for Tasks**: Set start and end times for each task.
- **Validation**: Prevent adding tasks for past dates and times.
- **Desktop Notifications**: Receive notifications for upcoming tasks (requires permission).
- **Persistent Storage**: Saves tasks using `localStorage` so they persist across sessions.
- **Drag-and-Drop**: Rearrange tasks by dragging and dropping between time slots.
- **Color-Coded Tasks**: Each task is assigned a random color for easy distinction.

---

## Screenshots

> _Add screenshots here if desired, such as images of the calendar view, scheduler view, and notification alerts._

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari) that supports `localStorage` and the `Notification` API.

### Installation

1. Clone or download this repository.
2. Open the `index.html` file in your web browser.

### Usage

1. **Open Calendar**: View the monthly calendar to see task indicators for dates with scheduled tasks.
2. **Select a Date**: Click on any date in the calendar to open the scheduler view for that day.
3. **Add Task**:
   - Click on a time slot to open the task modal.
   - Enter the task description and specify the start and end times.
   - Click **Save**. If the date and time are in the past, you will receive an alert.
4. **Receive Notifications**: Notifications appear for tasks scheduled within the current hour if permissions are granted.
5. **Drag and Drop**: Rearrange tasks in the daily schedule by dragging and dropping tasks between time slots.
6. **Return to Calendar**: Click **Back to Calendar** to return to the monthly calendar view.

---

## How It Works

- **Data Storage**: Tasks are saved in `localStorage` using the date and time slot as keys, making tasks persistent across browser sessions.
- **Time Validations**:
  - Past dates are marked as unclickable in the calendar.
  - For today's date, only future times are allowed for new tasks.
- **Notifications**: Uses the browser’s Notification API to alert users of tasks scheduled within the current hour. If notifications are blocked, the app will fall back to using browser alerts.

---

## Code Structure

- **HTML (`index.html`)**: Defines the structure of the calendar, scheduler, and modal for adding tasks.
- **CSS (`styles.css`)**: Provides the styling for the calendar, scheduler, modal, and task indicators.
- **JavaScript (`scripts.js`)**: Handles task management, time validations, notifications, drag-and-drop functionality, and local storage.

---

## Customization

1. **Change Colors**: Modify the random colors used for task labels by editing the `getRandomColor()` function in `scripts.js`.
2. **Notification Interval**: Adjust the notification interval by modifying the `setInterval` function inside `checkForUpcomingTasks()` in `scripts.js`.

---

## Known Issues

- Notifications require permission from the browser. If permission is denied, notifications will not be displayed.
- Notifications may not work on all mobile browsers.

---

## Future Enhancements

- **Recurring Tasks**: Option to create recurring daily or weekly tasks.
- **Enhanced Task Management**: Add priority levels or task categories.
- **Dark Mode**: Option to switch between light and dark themes.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Inspired by productivity tools like Google Calendar.
- Notification functionality relies on the browser’s Notification API.

---

Feel free to update this `README.md` as the project evolves! Let me know if you want additional sections added.
