// Functions
function dateObj(d) { // date parser ...
    var parts = d.split(/:|\s/),
        date = new Date();
    date.setHours(+parts.shift());
    date.setMinutes(+parts.shift());
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function isSlideDue(startTime, endTime) {
    var now = new Date();

    //Get date objects
    var startDate = dateObj(startTime);
    var endDate = dateObj(endTime);

    var show = now < endDate && now >= startDate ? true : false;
    return show;
}

function updateTimeTheme(isDarkened) {
    if (isDarkened) {
        /* Night Mode */
        document.getElementById("date").style.color = "rgba(255, 255, 255, 0.25)";
        document.getElementById("time").style.color = "rgba(255, 255, 255, 0.3)";
        document.getElementById("motd").style.color = "rgba(255, 255, 255, 0.25)";
        //document.getElementById("galaxy").opacity = 0.25;
    } else {
        /* Day Mode */
        document.getElementById("date").style.color = "rgba(255, 255, 255, 0.50)";
        document.getElementById("time").style.color = "rgba(255, 255, 255, 0.75)";
        document.getElementById("motd").style.color = "rgba(255, 255, 255, 0.50)";
        //document.getElementById("galaxy").opacity = 1;
    }
}

function tickTime() {
    /* Update clock time */
    document.getElementById("date").innerHTML = new Date().toLocaleString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById("time").innerHTML = new Date().toLocaleString('en-GB', {
        //hour12: true,
        hour24: true,
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit"
    });
}

function showMotd(motd) {
    var motdObj = document.getElementById("motd");
    motdObj.innerHTML = motd;
}

function showTimeWithMotd(motd, darken) {
    updateTimeTheme(darken);
    tickTime();
    showMotd(motd);
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var weather = "";

function getWeather() {

    fetch("https://api.mawersoft.co.uk/weatherman/now")
        .then(resp => resp.json())
        .then(resp => {
            weather = resp.body;
        });
}

// Main code
var slides = [
    ["Night", "00:00", "06:00", function () {
        showTimeWithMotd(weather, true);
    }],
    ["Morning", "06:00", "08:00", function () {
        //showTimeWithMotd("Today's gonna be another great day!", true);
        showTimeWithMotd(weather, true);
    }],
    ["Night", "22:00", "24:00", function () {
        //showTimeWithMotd("Goodnight!", true);
        showTimeWithMotd(weather, true);
    }],
    ["Default", "00:00", "23:30", function () {
        showTimeWithMotd(weather, false);
    }]
];

function slideshow() {
    console.debug("Checking for slides...");
    for (i = 0; i < slides.length; i++) {
        if (isSlideDue(slides[i][1], slides[i][2])) {
            console.debug("Current slide: " + slides[i][0]);
            slides[i][3]();
            break; /* 1 slide per time */
        }
    }
}

tickTime();
getWeather();
setInterval(slideshow, 1000);
setInterval(getWeather, 15000);