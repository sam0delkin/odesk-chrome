function update() {
    chrome.browserAction.setBadgeBackgroundColor({color: '#880000'});
    chrome.browserAction.setBadgeText({
        text: '?'
    });
    var d = new Date();
    var date = formatDate(d);
    $.get("https://www.odesk.com/api/team/v1/workdiaries/" + localStorage['id'] + "/" + localStorage['user'] + "/" + date + ".json?tz=gmt", {}, function (data) {
        time = 0;
        var count = 0;
        if (!data['snapshots']['snapshot'])
            count = 0;
        else
			{
				for(var i = 0; i < data['snapshots']['snapshot'].length; i++){
					if(data['snapshots']['snapshot'][i]['billing_status'] == 'billed.active') count++;
				}
			}
        time = count * 10;
        time = Math.floor((time / 60));
        var minutes = ((count * 10)) - (time * 60);
        if (minutes == 0)
            minutes = "0" + minutes.toString();
        if (typeof minutes != 'string')
            minutes = minutes.toString();
        chrome.browserAction.setBadgeBackgroundColor({color: '#008800'});
        if (time <= 5)
            chrome.browserAction.setBadgeBackgroundColor({color: '#888800'});
        if (time <= 3)
            chrome.browserAction.setBadgeBackgroundColor({color: '#880000'});

  		if(time >=8){
			if(localStorage['notified'] == "false"){
				createNotification("You worked 8 hours today!", "You worked 8 hors today. You can go home!:)");
				localStorage['notified'] = true;
			}
		} else {
			localStorage['notified'] = false;
		}

        time = time.toString() + ":" + minutes;


        chrome.browserAction.setBadgeText({
            text: time
        });
    }, 'json');
}

function getDateReport(date_form, date_to, callback) {

    $.get('https://www.odesk.com/gds/timereports/v1/companies/' + localStorage['id'] + '/teams/' + localStorage['id'] + '/hours?tq=SELECT%20sum(hours)%20WHERE%20worked_on%20%3E=%20\'' + date_form + '\'%20AND%20worked_on%20%3C=%20\'' + date_to + '\'%20AND%20provider_id=\'' + localStorage['user'] + '\'&tqx=out:json', {}, function (data) {
        var hours = data['table']['rows'][0]['c'][0]['v'];

        callback(parseFloat(hours).toFixed(1));

    }, 'json');
}

function getCurrentWeek(){
    var curr_date =new Date();

    var day = curr_date.getDay();

    var diff = curr_date.getDate() - day + (day == 0 ? -6:1); // 0 for sunday

    var week_start_tstmp = curr_date.setDate(diff);

    var week_start = new Date(week_start_tstmp);


    var week_end  = new Date(week_start_tstmp);  // first day of week

    week_end = new Date (week_end.setDate(week_end.getDate() + 6));


    return [week_start, week_end];
}

function getCurrentMonth(){
    var now = new Date();
    now.setDate(1);
    var month_start = new Date(now);
    var month_end = new Date(now);
    month_end = new Date(month_end.setDate(31));
    return [month_start, month_end];
}

function getPrevMonth(){
    var now = new Date();
    now.setDate(1);
    if(now.getMonth() == 0){
        now.setMonth(11);
        now.setFullYear(now.getFullYear() - 1);
    } else {

        now.setMonth(now.getMonth() - 1);
    }
    var month_start = new Date(now);
    var month_end = new Date(now);
    month_end = new Date(month_end.setDate(31));
    if(month_end.getDate() == 1){
	    month_end.setMonth(month_end.getMonth() - 1);
    	month_end = new Date(month_end.setDate(30));
    }
    return [month_start, month_end];
}

function getPrevPastMonth(){
    var now = new Date();
    now.setDate(1);
    if(now.getMonth() == 0){
        now.setMonth(9);
        now.setFullYear(now.getFullYear() - 1);
    } else {

        now.setMonth(now.getMonth() - 2);
    }
    var month_start = new Date(now);
    var month_end = new Date(now);
    month_end = new Date(month_end.setDate(31));
    if(month_end.getDate() == 1){
	    month_end.setMonth(month_end.getMonth() - 2);
    	month_end = new Date(month_end.setDate(30));
    }
    return [month_start, month_end];
}


function formatDate(d, tire){
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1)
        month = "0" + month;

    var day = d.getDate().toString();
    if (day.length == 1)
        day = "0" + day;

    var date = d.getFullYear().toString() + month + day;
    if(tire){
        date = d.getFullYear().toString() + tire + month + tire + day;
    }
    console.log(date);
    return date;
}

function createNotification(title, message){
	var opt = {
	  type: "basic",
	  title: title,
	  message: message,
	  iconUrl: "images/odesk.png"
	}
	chrome.notifications.create("id-1", opt, function(){});
}

function getCourse(dates, callback){
	var url = 'http://finance.rambler.ru/ajax/currency_average.html';
	var params = {
		currency: 2210,
		s_day: dates[0].getDate(),
		s_month: (dates[0].getMonth() + 1),
		s_year: dates[0].getFullYear(),
		e_day: dates[1].getDate(),
		e_month: (dates[1].getMonth() + 1),
		e_year: dates[1].getFullYear()
	};
	$.post(url, params, function(data){
		callback.apply(this, [parseFloat(data)]);
	}, 'html');
}

(function ($) {
    var time = "0";
    if ($('.container').length == 0)
        setInterval(update, 60000);
    update();
    chrome.browserAction.onClicked.addListener(update);

})(jQuery);