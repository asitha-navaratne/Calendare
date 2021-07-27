const date = new Date();

let clicked = null;

let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const eventModal = document.querySelector(".event-modal");
const eventText = document.querySelector(".event-text");
const newEventModal = document.querySelector(".new-event-modal");
const modalBackdrop = document.querySelector(".modal-backdrop");
const eventInput = document.querySelector(".event-input");

/* Open the modal window */
const openModal = (date) => {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    newEventModal.style.display = "none";
    eventModal.style.display = "block";
    eventText.innerText = eventForDay.title;
  } else {
    eventModal.style.display = "none";
    newEventModal.style.display = "block";
  }

  modalBackdrop.style.display = "block";
};

/* Close the modal window */
const closeModal = () => {
  eventInput.classList.remove("error");

  newEventModal.style.display = "none";
  eventModal.style.display = "none";
  modalBackdrop.style.display = "none";

  eventInput.value = "";

  clicked = null;

  renderCalendar();
};

/* Render the calendar */
const renderCalendar = () => {
  date.setDate(1);

  const monthDays = document.querySelector(".days");

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h2").innerHTML = date.getFullYear();

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  document.querySelector(".date p").innerHTML = new Date().toDateString();

  let days = "";

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    const eventForDay = events.find(
      (e) => e.date === `${i}/${date.getMonth() + 1}/${date.getFullYear()}`
    );

    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
    ) {
      if (eventForDay) {
        days += `<div class="day today" id="${i}">${i}<span class="dot-today"></span></div>`;
      } else {
        days += `<div class="day today" id="${i}">${i}</div>`;
      }
    } else {
      if (eventForDay) {
        days += `<div class="day" id="${i}">${i}<span class="dot"></span></div>`;
      } else {
        days += `<div class="day" id="${i}">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }

  monthDays.innerHTML = days;

  document
    .querySelectorAll(".day")
    .forEach((e) =>
      e.addEventListener("click", () =>
        openModal(`${e.id}/${date.getMonth() + 1}/${date.getFullYear()}`)
      )
    );
};

/* Save an event in local storage */
const saveEvent = () => {
  if (eventInput.value) {
    eventInput.classList.remove("error");

    events.push({
      date: clicked,
      title: eventInput.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventInput.classList.add("error");
  }
};

/* Delete an event from local storage */
const deleteEvent = () => {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});
document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

document.querySelector(".save").addEventListener("click", () => saveEvent());
document.querySelector(".cancel").addEventListener("click", () => closeModal());

document
  .querySelector(".delete")
  .addEventListener("click", () => deleteEvent());
document.querySelector(".close").addEventListener("click", () => closeModal());

renderCalendar();
