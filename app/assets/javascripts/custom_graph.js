var chart;
var jsonData;
var startMonth = 12;
var endMonth = 0;
var options;
var graphType = "spline";
var metric = "distance";
var workoutType = "Run";
var groupBy = "month";
var path;

function changeType(series, newType) {
        
    for(var i=0;i<series.length;i++)
    {
        serie = series[0];
        serie.chart.addSeries({
            type: newType,
            name: serie.name,
            color: serie.color,
            data: serie.options.data
        }, false);
        
        serie.remove();
        
        options.chart.defaultSeriesType = newType;
    }
    
}

function displayMetric(metric) {
	var data = [];
	for (var i=0; i< jsonData.length; i++) {
		
		var value;
		

		if (metric == "vdotoverhr") {
			if (parseInt(jsonData[i]["avg_hr"]) > 30) {
				value = parseFloat(jsonData[i]["vdot"])/parseInt(jsonData[i]["avg_hr"]);
				value = parseFloat((value * 100).toFixed(2));
			} else {
				value = null;
			}
		} else if (metric == "duration" || metric == "pace") {
			value = parseFloat(parseFloat(jsonData[i][metric]/60).toFixed(2));
		} else {
			value = parseFloat(parseFloat(jsonData[i][metric]).toFixed(2));
		}
		
		if (isNaN(value)) value = null;
		
			
		var d = $.datepicker.parseDate('yy-mm-dd', jsonData[i].date).valueOf();
		data.push(
			//[$.datepicker.parseDate('yy-mm-dd', data[i].date), value]
			[d, value]
		);
			

		
	}
	
	if (!chart) chart = new Highcharts.Chart(options);
	
	chart.series[0].remove();
	
	chart.addSeries({
		name: this.value,
		data: data,
		pointPadding: 0,
		type: graphType
	})
}

function getWorkouts() {
	$.ajax({
        //url: 'workouts/by_date_range/' + pastMonths + '.json',
        url: path + '/group_by/' +
        groupBy + '/' + startMonth + '/' + 
        endMonth + '/' + workoutType + '.json',
        
        dataType: 'json',
        success: function(data) {
			
			var series = [{
				id: 'distance',
				name: 'Distance'
			}]
			jsonData = data;
			//options.series.push(data);
			if (!chart) {
				options.series = series;
				options.series[0].data = [];
	
				for (var i=0; i< data.length; i++) {
					var d = $.datepicker.parseDate('yy-mm-dd', data[i].date).valueOf();
					var d2 = Date.parse(data[i].date);
					options.series[0].data.push(
						[d, parseFloat(parseFloat(data[i].distance).toFixed(2))]
						//[data[i].month, parseFloat(parseFloat(data[i].distance).toFixed(2))]
					);
				}
	
	
				if (!chart) chart = new Highcharts.Chart(options);
			} else {
				displayMetric(metric);
			}
			//chart.get('distance').setData(data, true);
        },
        cache: false
		
	});
}

$(document).ready(function() {
	
	path = window.location.pathname
	// define the options
	options = {

		chart: {
			renderTo: 'container',
			defaultSeriesType: 'spline',
			zoomType: 'x',
			height: Math.max($(window).height() - 400, 300),
			className: 'examplechart-container',
			marginRight: 50
		},

		title: {
			text: 'Dynamic Title Based on Chart'
		},

		subtitle: {
			text: 'Some super sweet subtitle action here'
		},

		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
            	month: '%b \'%y'   
        	}
			
		},

		yAxis: [{ // left y axis
			title: {
				text: "Miles"
			}
		}],

		legend: {
			align: 'left',
			verticalAlign: 'top',
			y: 20,
			floating: true,
			borderWidth: 0
		},

		tooltip: {
			/*shared: true,
			crosshairs: true,
			formatter: function() {
				var d = new Date(this.x );
				return d.toDateString() + '<br/>' + this.points[0].series.name + ': ' + 
				this.points[0].y + '<br/>Comments: ' + jsonData[5].comments;
			}*/
		},

		series: [{
			id: 'distance',
			name: 'Distance',
			pointPadding: 0,
			connectNulls: true
		}],
		
		plotOptions: {
			series: {
				connectNulls: true
			}
		}
	};


	getWorkouts(12,0);
	
	$("#pastMonthsSlider").slider({
		values: [24,36],
		min: 0,
		max: 36,
		range: true,

		stop: function(event, ui) {
			startMonth = 36 - ui.values[0];
			endMonth = 36 - ui.values[1]
			$( "#pastMonthsText" ).html(startMonth + 
			" months ago to " + endMonth +" months ago");
			getWorkouts();
		}		
	});
	
	
	$(".graphType").click(
		function() {
			changeType(chart.series, this.id);
			graphType = this.id;
		});
		
	$(".metric").click(
		function() {		
			displayMetric(this.id);
			metric = this.id;
		});
		
	$(".workoutType").click(
		function() {		
			workoutType = this.id;
			getWorkouts();
		});
		
	$(".groupBy").click(
		function() {		
			groupBy = this.id;
			getWorkouts();
		});
		
	$(".multiselectable").bind("mousedown", function(e) {
		  e.metaKey = true;
		}).selectable();
		
	$(".selectable").selectable();
});