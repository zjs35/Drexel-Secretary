var evt;
var url;
var windowThatWasOpen;

$.get("url").then(function (response) {
    url = response;
});

function login() {
    windowThatWasOpen = window.open(url, "Please sign in with Google", "width=400, hight:500");
    window.addEventListener("message", receiveMessage);
}

function receiveMessage(e) {
    windowThatWasOpen.close();
    var code = e;
    console.log(code);

    $.get("createEvent", evt).then(function (response) {
        console.log(response);
        $('#form').html(response);
    });
}

//make Event and send it to server
function makeEvent() {
    //get selected table option
    var email = $('#proffEmail').val();
    // var studentName = $('input[name=studentName]').val();
    var title = $('input[name=title]').val();
    var duration = $('#duration option:selected').val();
    var description = $('input[name=description]').val();
    var startTime = parseDate($('input[name=startTime]').val()),
        endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + parseInt(duration));
    startTime = startTime.toISOString();
    endTime = endTime.toISOString();
    var event = {
        'title': title,
        'description': description,
        'startDatetime': startTime,
        'endDatetime': endTime,
        'professorEmail': email,
        //'location': 'My Office',
    };
    return event;
}


// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]); // months are 0-based
}


function sendEvent() {
    console.log($('input[name=description]').val());
    console.log($('input[name=title]').val());
    console.log($('input[name=startTime]').val());
    console.log($('#duration option:selected').val());
    evt = makeEvent();
    login();
}


function updateTeacherDropdown() {
    var option = {
        'position': $('#status').val(),
        'dept': $('#departments').val(),
    };
    $.get("teacherlist", option).then(function (response) {
        console.log(response);
        $('#name').html(response);
    });
}


function updateCalendar() {
    var option = {
        'id': $('#id').val(),
    };
    $.get("teacherlist", option).then(function (response) {
        console.log(response);
        $('#content').html(response);
    });
}