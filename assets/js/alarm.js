'use strict';

const timeClock = select('.time-clock');
const timeAlarm = select('.time-alarm');
const setAlarm = select('.set-alarm');
const hourObj = select('.hour');
const minuteObj = select('.minute');
const output = select('.output');
const alarmSound = new Audio('./assets/audio/alarm.mp3');
alarmSound.type = 'audio/mp3';

let intervalId = 0;

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

listen('load', window, () => {
    getTime();
});

listen('click', setAlarm, () => {
    let hour = hourObj.value;
    let minute = minuteObj.value;
    let invalidTime = false;

    // Invalid input.
    if (isNaN(hour) || isNaN(minute) || 
        hour.toString().trim() === "" || minute.toString().trim() === "" || 
        hour.toString().indexOf('.') > -1 || minute.toString().indexOf('.') > -1 ||
        hour > 23 || minute > 59) {
        output.style.color = "#f66060";
        output.innerText = "Invalid Time!";
        invalidTime = true;
    }

    // Invalid current time.
    const alarmTime = formatTime(hour, minute);
    let currentTime = getTime();

    hourObj.value = "";
    minuteObj.value = "";      

    if (invalidTime || alarmTime === currentTime) {
        hourObj.focus();
        return;
    }

    // Set alarm.
    timeAlarm.style.visibility = 'visible';
    timeAlarm.innerText = alarmTime;  
    
    if (intervalId != 0) {
        // Finish the previous alarm.
        clearInterval(intervalId);
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }

    intervalId = setInterval(() => {
        currentTime = getTime();

        if (alarmTime === currentTime) {
            alarmSound.play();
            output.innerText = "";
            timeClock.style.color = "#338749";

            setTimeout(() => {
                timeClock.style.color = "#fff";
            }, 800);
        }
    }, 1000);
});

listen('input', hourObj, () => {
    output.innerText = "";
});

listen('input', minuteObj, () => {
    output.innerText = "";
});

function getTime() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const time = formatTime(hour, minute);

    timeClock.innerText = time;

    return time;
}

function formatTime(hour, minute) {
    hour = hour.toString().padStart(2, '0');
    minute = minute.toString().padStart(2, '0')
    return `${hour}:${minute}`;
}