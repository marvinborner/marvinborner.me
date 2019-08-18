let obj = {};
const request = new XMLHttpRequest();
request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
        obj = JSON.parse(request.responseText);
        renderWeekChart();
        renderLangChart();
    }
};
request.open("GET", "https://codestats.net/api/users/marvinborner", true);
request.send();

function renderWeekChart() {
    const dates = obj.dates;
    const weekData = [];
    const dayNames = [];
    Object.keys(dates).sort().forEach(key => {
        if ((new Date() - new Date(key)) / (1000 * 60 * 60 * 24) <= 10 + 1) {
            weekData.push(dates[key]);
            dayNames.push(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date(key).getDay()]);
        }
    });

    const ctx = document.getElementById("codingWeek").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: dayNames,
            datasets: [{
                label: "Keystrokes",
                data: weekData,
                backgroundColor: seedRandomColor(Object.keys(dayNames).length, 0.2),
                borderColor: seedRandomColor(Object.keys(dayNames).length, 0.8),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: false,
            maintainAspectRatio: false,
            legend: {
                display: false
            }
        }
    });
}

function renderLangChart() {
    const languages = [];
    const languagesXP = [];
    Object.keys(obj.languages)
        .sort((a, b) => obj.languages[b]["xps"] - obj.languages[a]["xps"])
        .forEach(key => {
            if (obj.languages[key]["xps"] > 100) {
                languages.push(key);
                languagesXP.push(obj.languages[key]["xps"])
            }
        });

    const ctx = document.getElementById("codingLanguages").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: languages,
            datasets: [{
                data: languagesXP,
                backgroundColor: seedRandomColor(Object.keys(languages).length, 0.5),
                borderColor: seedRandomColor(Object.keys(languages).length, 0.8),
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            legend: {
                display: false
            }
        }
    })
}

function seedRandomColor(rounds, a) {
    const arr = [];
    let seed = rounds;

    for (let i = 0; i < rounds; i++) {
        const r = parseInt(random() * 255);
        const g = parseInt(random() * 255);
        const b = parseInt(random() * 255);

        function random() {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        }

        arr.push(`rgba(${r},${g},${b},${a})`)
    }

    return arr
}
