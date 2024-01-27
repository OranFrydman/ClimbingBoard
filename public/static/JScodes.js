// Greetings Home Page

var time;
var d = new Date();
time = d.getHours();
console.log(time);
var greetings = "";
if (time < 12.0) {
  greetings = "Good Morning!";
} else if (time < 18) {
  greetings = "Good Afternoon!";
} else {
  greetings = "Good Evening!";
}
document.getElementById("time").innerHTML = greetings;
console.log(ActivePage);

const activeNav = document.querySelectorAll('nav a').forEach((MyLinks) => {
  if (MyLinks.href.includes(`${ActivePage}`)) {
    MyLinks.classList.add('Active');
  }
});

function ShowDiv(name) {
  document.getElementById(name).style.visibility = "visible";
}

function HideDiv(name) {
  document.getElementById(name).style.visibility = "hidden";
}

const createChart = async () => {
    const workoutData = await fetchWorkoutData();
    const formattedData = formatChartData(workoutData);
  
    // Retrieve myclimbs data from the rendered page
    const myclimbs = JSON.parse(document.getElementById('myclimbs').textContent);
    console.log(myclimbs)
    // Add myclimbs data to formattedData
    myclimbs.forEach((climb) => {
      formattedData.labels.push(climb.date);
      formattedData.datasets[0].data.push(climb.duration);
    });
  
    const ctx = document.getElementById('workoutChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: formattedData,
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM DD',
              },
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Duration',
            },
          },
        },
      },
    });
  };
  
  createChart();