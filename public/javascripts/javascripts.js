(function () {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form');

    // Loop over them and prevent submission
    Array.from(forms).forEach(function (form) {
        form.addEventListener(
            'submit',
            function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            },
            false
        );
    });
})();

//hide and show password
function myFunction() {
    var x = document.getElementById('password');
    if (x.type === 'password') {
        x.type = 'text';
    } else {
        x.type = 'password';
    }
    Eric;
}

// $('#ratinginput').rating();

const search = () => {
    //declare filter constructor
    const filter = document.getElementById('myInput').value.toLowerCase();
    //access tBody from reservation index
    const tBody = document.getElementsByTagName('tbody');
    //access tr table from reservation index
    const tr = tBody[0].getElementsByTagName('tr');

    //loop for the records
    for (var i = 0; i < tr.length; i++) {
        //access the column - name in reservation table
        //search first column
        let td = tr[i].getElementsByTagName('td')[0];
        //search second column
        let td1 = tr[i].getElementsByTagName('td')[1];
        //search third column

        let td2 = tr[i].getElementsByTagName('td')[2];
        //compare search value
        if (td) {
            //target specific data in <td> same function- different browser
            let textValue = td.textContent || td.innerHTML;
            let textValue1 = td1.textContent || td1.innerHTML;
            let textValue2 = td2.textContent || td2.innerHTML;
            //filter checks if search value equals to name column
            if (textValue.toLowerCase().indexOf(filter) > -1) {
                //show up records
                tr[i].style.display = '';
            } else if (textValue1.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else if (textValue2.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                //doesnt show record if doesnt exist
                tr[i].style.display = 'none';
            }
        }
    }
};

//https://www.chartjs.org/
let xlabels = [];
let ytemps = [];

let x1labels = [];
let y1temps = [];

let pieLabels = [];
let pieData = [];

let reviewLabels = [];
let reviewData = [];
let reviewAvg = [];

// let bgSources = [
//     'rgba(255, 99, 132, 0.2)',
//     'rgba(255, 159, 64, 0.2)',
//     'rgba(255, 205, 86, 0.2)',
//     'rgba(75, 192, 192, 0.2)',
// ];

let bgSources = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
];

let bdSources = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
];
let bgColor = [];
let bdColor = [];

chartIt();

async function chartIt() {
    await getData();
    //charts data  here
    const bar = document.getElementById('barChart').getContext('2d');
    const line = document.getElementById('lineChart').getContext('2d');
    const pie = document.getElementById('pieChart').getContext('2d');
    const review = document.getElementById('reviewChart').getContext('2d');

    const barChart = new Chart(bar, {
        type: 'bar',
        data: {
            labels: xlabels,
            datasets: [
                {
                    label: 'Rooms are used the most',
                    data: ytemps,
                    backgroundColor: bgColor,
                    // borderColor: bdColor,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            scales: {
                y: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: true,
                    },
                },
                x: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        // maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: true,
                    },
                },
            },
        },
    });

    const lineChart = new Chart(line, {
        type: 'line',
        data: {
            labels: x1labels,
            datasets: [
                {
                    label: 'The highest volume of reservation',
                    data: y1temps,
                    backgroundColor: 'transparent',
                    borderColor: ['rgba(255, 99, 132)'],
                    tension: 0.1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            scales: {
                y: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: true,
                    },
                },
                x: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        // maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 10,
                        },
                        beginAtZero: true,
                    },
                },
            },
        },
    });

    const pieChart = new Chart(pie, {
        type: 'doughnut',
        data: {
            labels: pieLabels,
            datasets: [
                {
                    label: 'The counts of each type of dining',
                    data: pieData,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
        }
    });

    const reviewChart = new Chart(review, {
        type: 'line',
        data: {
            labels: reviewLabels,
            datasets: [
                {
                    label: 'Average Rating by days',
                    backgroundColor: 'transparent',
                    borderColor: ['rgba(255, 99, 132)'],
                    data: reviewData,
                    tension: 0.1,
                },
                {
                    label: 'Overall Average Rating',
                    backgroundColor: 'transparent',
                    borderColor: ['rgb(54, 162, 235)'],
                    data: reviewAvg,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            scales: {
                y: {
                    // beginAtZero: false,
                    ticks: {
                        // stepSize: 1
                        maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: false,
                    },
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 10,
                        },
                        beginAtZero: true,
                    },
                },
            },
        },
    });
}

async function getData() {
    const response = await fetch('http://localhost:3000/reservation/get_data');
    const data = await response.json();

    const bar = data.values.bar;
    const line = data.values.line;
    const pie = data.values.pie;
    const review = data.values.review;

    bar.forEach((element, index) => {
        xlabels.push(element.roomName);
        ytemps.push(element.count);
        bgColor.push(bgSources[index]);
        // bdColor.push(bdSources[index]);
    });

    line.forEach((element) => {
        x1labels.push(element.Date);
        y1temps.push(element.count);
    });

    pie.forEach((element) => {
        pieLabels.push(element.Type);
        pieData.push(element.count);
    });

    review.forEach((element) => {
        reviewLabels.push(element.Date);
        reviewData.push(element.Rate);
        reviewAvg.push(element.Average);
    });
}

async function filter() {
    document
        .querySelector('.chart1-container')
        .querySelector('#barChart')
        .remove();
    let canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'barChart');
    canvas.setAttribute('width', '100');
    canvas.setAttribute('height', '100');
    document.querySelector('.chart1-container').appendChild(canvas);

    document
        .querySelector('.chart2-container')
        .querySelector('#lineChart')
        .remove();
    let canvasLine = document.createElement('canvas');
    canvasLine.setAttribute('id', 'lineChart');
    canvasLine.setAttribute('width', '100');
    canvasLine.setAttribute('height', '100');
    document.querySelector('.chart2-container').appendChild(canvasLine);

    document
        .querySelector('.chart3-container')
        .querySelector('#pieChart')
        .remove();
    let canvasPie = document.createElement('canvas');
    canvasPie.setAttribute('id', 'pieChart');
    canvasPie.setAttribute('width', '100');
    canvasPie.setAttribute('height', '100');
    document.querySelector('.chart3-container').appendChild(canvasPie);

    document
        .querySelector('.chart4-container')
        .querySelector('#reviewChart')
        .remove();
    let canvasReview = document.createElement('canvas');
    canvasReview.setAttribute('id', 'reviewChart');
    canvasReview.setAttribute('width', '100');
    canvasReview.setAttribute('height', '100');
    document.querySelector('.chart4-container').appendChild(canvasReview);

    const bChart = document.getElementById('barChart').getContext('2d');
    const lChart = document.getElementById('lineChart').getContext('2d');
    const pChart = document.getElementById('pieChart').getContext('2d');
    const rChart = document.getElementById('reviewChart').getContext('2d');

    const date = await document.getElementById('filter').value;
    const response = await fetch(
        `http://localhost:3000/reservation/filter?search_query=${date}`
    );
    const data = await response.json();

    const bar = data.values.bar;
    const line = data.values.line;
    const pie = data.values.pie;
    const review = data.values.review;

    xlabels.splice(0, xlabels.length);
    ytemps.splice(0, ytemps.length);
    bgColor.splice(0, bgColor.length);
    bdColor.splice(0, bdColor.length);

    x1labels.splice(0, x1labels.length);
    y1temps.splice(0, y1temps.length);

    pieLabels.splice(0, pieLabels.length);
    pieData.splice(0, pieData.length);

    reviewLabels.splice(0, reviewLabels.length);
    reviewData.splice(0, reviewData.length);
    reviewAvg.splice(0, reviewAvg.length);

    bar.forEach((element, index) => {
        xlabels.push(element.roomName);
        ytemps.push(element.count);
        bgColor.push(bgSources[index]);
        // bdColor.push(bdSources[index]);
    });

    line.forEach((element) => {
        x1labels.push(element.Date);
        y1temps.push(element.count);
    });

    pie.forEach((element) => {
        pieLabels.push(element.Type);
        pieData.push(element.count);
    });

    review.forEach((element) => {
        reviewLabels.push(element.Date);
        reviewData.push(element.Rate);
        reviewAvg.push(element.Average);
    });

    const barChart = new Chart(bChart, {
        type: 'bar',
        data: {
            labels: xlabels,
            datasets: [
                {
                    label: 'Rooms are used the most',
                    data: ytemps,
                    backgroundColor: bgColor,
                    // borderColor: bdColor,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            scales: {
                y: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: true,
                    },
                },
                x: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        // maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: true,
                    },
                },
            },
        },
    });

    const lineChart = new Chart(lChart, {
        type: 'line',
        data: {
            labels: x1labels,
            datasets: [
                {
                    label: 'The highest volume of reservation',
                    data: y1temps,
                    borderColor: ['rgba(255, 99, 132)'],
                    tension: 0.1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            scales: {
                y: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: true,
                    },
                },
                x: {
                    // beginAtZero: true,
                    ticks: {
                        // stepSize: 1,
                        // maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 10,
                        },
                        beginAtZero: true,
                    },
                },
            },
        },
    });

    const pieChart = new Chart(pChart, {
        type: 'doughnut',
        data: {
            labels: pieLabels,
            datasets: [
                {
                    label: 'The counts of each type of dining',
                    data: pieData,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
        }
    });

    const reviewChart = new Chart(rChart, {
        type: 'line',
        data: {
            labels: reviewLabels,
            datasets: [
                {
                    label: 'Average Rating by days',
                    backgroundColor: 'transparent',
                    borderColor: ['rgba(255, 99, 132)'],
                    data: reviewData,
                    tension: 0.1,
                },
                {
                    label: 'Overall Average Rating',
                    backgroundColor: 'transparent',
                    borderColor: ['rgb(54, 162, 235)'],
                    data: reviewAvg,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 18,
                        },
                    },
                },
            },
            scales: {
                y: {
                    // beginAtZero: false,
                    ticks: {
                        // stepSize: 1
                        maxTicksLimit: 8,
                        color: 'white',
                        font: {
                            size: 18,
                        },
                        beginAtZero: false,
                    },
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 10,
                        },
                        beginAtZero: true,
                    },
                },
            },
        },
    });
}

$(function() {

    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#filter span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('#filter').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

});

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

// Not let users to select past days, but allow users to select future days (30days)
$(function(){
    var dtToday = new Date();
    
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    
    var add30 = dtToday.addDays(30);
    var addMonth = add30.getMonth() + 1;
    var addDay = add30.getDate();
    var addYear = add30.getFullYear();

    // Convert date format to mm/dd/yyyy
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    if(addMonth < 10)
        addMonth = '0' + addMonth.toString();
    if(addDay < 10)
        addDay = '0' + addDay.toString();
    
    var minDate = year + '-' + month + '-' + day;
    var maxDate = addYear + '-' + addMonth + '-' + addDay;

    document.querySelector('#reservationDate').setAttribute('min', minDate)
    document.querySelector('#reservationDate').setAttribute('max', maxDate)
});


function setInputFilter(textbox, inputFilter, errMsg) {
    [
        'input',
        'keydown',
        'keyup',
        'mousedown',
        'mouseup',
        'select',
        'contextmenu',
        'drop',
        'focusout',
    ].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            if (inputFilter(this.value)) {
                // Accepted value
                if (['keydown', 'mousedown', 'focusout'].indexOf(e.type) >= 0) {
                    this.classList.remove('input-error');
                    this.setCustomValidity('');
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty('oldValue')) {
                // Rejected value - restore the previous one
                this.classList.add('input-error');
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(
                    this.oldSelectionStart,
                    this.oldSelectionEnd
                );
            } else {
                // Rejected value - nothing to restore
                this.value = '';
            }
        });
    });
}

setInputFilter(
    document.getElementById('reviewInput'),
    function (value) {
        return /^-?\d*$/.test(value);
    },
    'Must be an integer'
);

const searchReview = () => {
    //declare filter constructor
    const filter = document.querySelector('#reviewInput').value.toLowerCase();

    //access tBody from reservation index
    const card = document.getElementsByClassName('card');
    
    for (var i = 0; i < card.length; i++) {

        let rate = card[i].getElementsByClassName('card-body')[0];

        if (rate) {
            let ratingValue = rate.getElementsByTagName('input').reviewRating.getAttribute('value');

            if (ratingValue.toLowerCase().indexOf(filter) > -1) {
                card[i].style.display = '';
            } else {
                card[i].style.display = 'none';
            }
        }
    }
};