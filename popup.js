/**
 * Created with JetBrains PhpStorm.
 * User: Sam0delkin
 * Date: 28.08.13
 * Time: 14:04
 * To change this template use File | Settings | File Templates.
 */
function updateReports(){
    var week = getCurrentWeek();
    var this_month = getCurrentMonth();
    var past_month = getPrevMonth();
    var past_past_month = getPrevPastMonth();


    var stavka = localStorage['bill'] ? localStorage['bill'] : 9;

    getDateReport(formatDate(week[0], '-'), formatDate(week[1], '-'), function(hours){
        $('#this-week').html(hours.toString() + ' hours');
        $('#this-week-usd').html('$' + (hours*stavka).toFixed(2));
		getCourse(week, function(course){
			$('#this-week-rub').html((hours*stavka*course).toFixed(2));	
			$('#this-week-course').html((course).toFixed(2));
		});
    });
    getDateReport(formatDate(this_month[0], '-'), formatDate(this_month[1], '-'), function(hours){
        $('#this-month').html(hours.toString() + ' hours');
        $('#this-month-usd').html('$' + (hours*stavka).toFixed(2));
        getCourse(this_month, function(course){
			$('#this-month-rub').html((hours*stavka*course).toFixed(2));	
			$('#this-month-course').html((course).toFixed(2));
		});
    });
    getDateReport(formatDate(past_month[0], '-'), formatDate(past_month[1], '-'), function(hours){
        $('#past-month').html(hours.toString() + ' hours');
        $('#past-month-usd').html('$' + (hours*stavka).toFixed(2));
        getCourse(past_month, function(course){
			$('#past-month-rub').html((hours*stavka*course).toFixed(2));	
			$('#past-month-course').html((course).toFixed(2));
		});

    });
    getDateReport(formatDate(past_past_month[0], '-'), formatDate(past_past_month[1], '-'), function(hours){
        $('#past-past-month').html(hours.toString() + ' hours');
        $('#past-past-month-usd').html('$' + (hours*stavka).toFixed(2));
        getCourse(past_past_month, function(course){
			$('#past-past-month-rub').html((hours*stavka*course).toFixed(2));	
			$('#past-past-month-course').html((course).toFixed(2));
		});

    });

}

(function($){
    $(document).ready(function(){
        updateReports();
    });
})(jQuery);