const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Событие 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Событие 2 Съешь еще этих мягких французских булок да выпейт же чаю",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
//функция для добавления дней в дни с днем занятий и предыдущей датой, следующей датой в предыдущий месяц и днями следующего месяца и активными сегодня
function initCalendar() {
  const firstDay = new Date(year, month, 1); // первый день месяца
  const lastDay = new Date(year, month + 1, 0); // последний день месяца
  const prevLastDay = new Date(year, month, 0); // последний день предыдущего месяца
  const prevDays = firstDay.getDay(); // день недели первого дня предыдущего месяца
  const lastDate = lastDay.getDate(); // последний день месяца 
  const nextDays = lastDay.getDay(); // день недели последнего дня следующего месяца (0 - воскресенье, 1 - понедельник и т.д.)

  date.innerHTML = `${Intl.DateTimeFormat('ru-RU', {month: 'long'}).format(new Date(year, month))} ${year}`; // название месяца и год в шапке

  let days = ""; // переменная для хранения дней

  /** Алгоритм для добавления дней в месяц
   * 1. Добавляем предыдущие дни предыдущего месяца (отсчитывая числа до ближайшего понедельника)
   * 2. Добавляем дни текущего месяца
   * 3. Добавляем следующие дни следующего месяца до первого воскресенья следующего месяца
  */
  for (let x = prevDays; x > 1; x--) {
      days += `<div class="day prev-date">${prevLastDay.getDate() - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
      //check if event is present on that day
      //проверяем, есть ли событие в этот день
      let event = false;
      eventsArr.forEach((eventObj) => {
          if (
              eventObj.day === i &&
              eventObj.month === month + 1 &&
              eventObj.year === year
          ) {
              event = true;
          }
      });
      if (
          i === new Date().getDate() &&
          year === new Date().getFullYear() &&
          month === new Date().getMonth()
      ) {
          activeDay = i;
          getActiveDay(i);
          updateEvents(i);
          if (event) {
              days += `<div class="day today active event">${i}</div>`;
          } else {
              days += `<div class="day today active">${i}</div>`;
          }
      } else {
          if (event) {
              days += `<div class="day event">${i}</div>`;
          } else {
              days += `<div class="day">${i}</div>`;
          }
      }
  }

  if (nextDays > 0) {
      for (let j = 1; j <= (7 - nextDays); j++) {
          days += `<div class="day next-date">${j}</div>`;
      }
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
//функция для добавления месяца и года к кнопкам «Предыдущая» и «Следующая»
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
//функция для добавления активности в день
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      //при нажатии на предыдущую или следующую дату переключение на этот месяц
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        //добавляем активный выбранный день после смены месяца
        setTimeout(() => {
          //add active where no prev-date or next-date
          //добавляем активный, если нет предыдущей или следующей даты
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        //добавляем активный день после изменения месяца
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

/*todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}*/

//function get active day day name and date and update eventday eventdate
//функция получает название и дату активного дня и обновляет eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
//функция обновляет события, когда день активен
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <!--<i class="fas fa-circle"></i>-->
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>Отдыхаем</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
  const group = getUrlParameter('group'); // Чтение значения параметра "group" из URL
  fetchSchedule(group, year + "-" + (month + 1) + "-" + date);
}

// Функция для извлечения значения параметра из URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

//function to add event
/*addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});*/

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML =
    "По вопросам и предложениям: <a href='//vk.com/maxa0h' target=_blank>vk.com/maxa0h</a>";
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

//allow only time in eventtime from and to
//разрешить только время во времени события от и до
/*addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr
//функция для добавления события в eventArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Пожалуйста, заполните все поля");
    return;
  }

  //check correct time format 24 hour
  //проверяем правильный формат времени 24 часа
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Неверный формат времени");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  //check if event is already added
  //проверяем, добавлено ли уже событие
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Событие уже добавлено");
    return;
  }
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };
  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  //выбираем активный день и добавляем класс события, если он не добавлен
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});*/

//function to delete event when clicked on event
//функция для удаления события при нажатии на событие
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Удалить событие?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          //если за день не осталось событий, то удаляем этот день из eventArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            //удаляем класс события из дня
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
//функция для сохранения событий в локальном хранилище
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
//функция для получения событий из локального хранилища
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  //проверяем, сохранены ли события в локальном хранилище, затем возвращаем событие, иначе ничего
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

// Функция для отправки запроса к серверу и обработки ответа
function fetchSchedule(group, date) {
  // Разбиваем дату на год, месяц и день
  const [year, month, day] = date.split('-').map(Number);
  // Увеличиваем месяц на 1, так как в JS месяцы начинаются с 0
  const formattedMonth = (month).toString().padStart(2, '0'); // Форматируем месяц как двузначное число
  const formattedDay = day.toString().padStart(2, '0'); // Форматируем день как двузначное число
  date = `${year}-${formattedMonth}-${formattedDay}`

  // Формируем URL с новым форматированным значением даты
  const url = `//kgeu.2d.su/api/schedule.php?group=${group}&date=${date}`;
  //alert(url);

  fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              const schedule = data.schedule[date];

              // Проверяем, есть ли занятия на указанную дату
              if (schedule && schedule.length > 0) {
                  displaySchedule(schedule);
              } else {
                  // Если расписание пустое, выводим сообщение об отсутствии занятий
                  const eventsContainer = document.querySelector('.events');
                  eventsContainer.innerHTML = `<div class="no-event"><h3>Занятий нет</h3></div>`;
              }
          } /*else {
              console.error('Ошибка получения расписания:', data.message);
          }*/
      })
      .catch(error => console.error('Ошибка при выполнении запроса:', error));
}


// Функция для отображения расписания на странице
function displaySchedule(schedule) {
  const eventsContainer = document.querySelector('.events');

  // Создаем HTML-разметку для каждого занятия и добавляем в контейнер
  const scheduleHTML = schedule.map(event => `
      <div class="event">
          <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.type} ${event.subject}<br>(${event.teacher}) ${event.auditory}</h3>
          </div>
          <div class="event-time">
              <span class="event-time">${event.start_time} - ${event.end_time}</span>
          </div>
      </div>
  `).join('');

  eventsContainer.innerHTML = scheduleHTML;
}