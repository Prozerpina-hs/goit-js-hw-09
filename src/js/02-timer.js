import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const refs = {
  calendar: document.querySelector(`#datetime-picker`),
  startBtn: document.querySelector(`[data-start]`),
  timer: document.querySelector(`.timer`),
  fields: document.querySelectorAll(`.field`),
  days: document.querySelector(`[data-days]`),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector(`[data-seconds]`),
};

let timerInterval = null;
refs.startBtn.setAttribute(`disabled`, true);
refs.timer.style.display = "flex";
refs.fields.forEach(field => {
    field.style.display = "flex";
    field.style.flexDirection ="column";
    field.style.margin ="6px";
    field.style.textAlign ="center";
})
function updateTimerDisplay(days, hours, minutes, seconds) {
  refs.days.textContent = addZero(days);
  refs.hours.textContent = addZero(hours);
  refs.minutes.textContent = addZero(minutes);
  refs.seconds.textContent = addZero(seconds);
}
// Oбработкa события клика на кнопку "Start"
function timer() {
  const currentDate = new Date();
  const selectedDate = flatpickr.parseDate(refs.calendar.value);
  const timeDifference = convertTime(selectedDate.getTime() - currentDate.getTime());

// console.log(timeDifference);

  updateTimerDisplay(timeDifference);
  if ((timeDifference.days === 0 && timeDifference.hours === 0 && timeDifference.minutes === 0 && timeDifference.seconds ===0)) {
    clearInterval(timerInterval);
    updateTimerDisplay(0);
    Notiflix.Notify.success("Countdown finished");
  }else{
    const { days, hours, minutes, seconds } = timeDifference;
    updateTimerDisplay(days, hours, minutes, seconds);
  }
}

  // Преобр-ть time в объект со св-вами { days, hours, minutes, seconds }
  function convertTime(time) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(time / day);
    const hours = Math.floor((time % day) / hour);
    const minutes = Math.floor(((time % day) % hour) / minute);
    const seconds = Math.floor((((time % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
  // Добавлить 0 при ед.числе
  function addZero(value) {
    return String(value).padStart(2, "0");
  }
function startTimer () {
  clearInterval(timerInterval);
  timerInterval = setInterval(()=> timer(), 1000);
  refs.startBtn.setAttribute(`disabled`, true);
}
// Настройки для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosenDate = selectedDates[0];
    const currentDate = new Date();
    console.log(selectedDates[0]);
    if (chosenDate < currentDate) {
      Notiflix.Notify.failure("Please choose a date in the future");
      return;
    }else{
      refs.startBtn.removeAttribute("disabled", true);
      refs.startBtn.addEventListener("click", startTimer);
    }
  },
  
};
console.log(options);
flatpickr(refs.calendar, options);