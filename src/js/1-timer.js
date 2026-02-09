import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

flatpickr(inputEl, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      userSelectedDate = null;
      startBtn.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
});

startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  inputEl.disabled = true;

  if (timerId) clearInterval(timerId);

  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const diff = userSelectedDate.getTime() - Date.now();

  if (diff <= 0) {
    stopTimer();
    renderTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }

  const time = convertMs(diff);
  renderTime(time);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;

  inputEl.disabled = false;
  startBtn.disabled = true;
  userSelectedDate = null;
}

function renderTime({ days, hours, minutes, seconds }) {
  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
