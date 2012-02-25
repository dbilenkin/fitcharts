var chart;
var jsonData;
var pastMonths = 1;
var options;
var graphType = "line";
var metric = "distance";

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
				value = parseFloat(jsonData[i]["avg_vdot"])/parseInt(jsonData[i]["avg_hr"]);
				value = parseFloat((value * 100).toFixed(2));
			} else {
				value = null;
			}
		} else if (metric == "duration" || metric == "pace") {
			value = parseFloat(parseFloat(jsonData[i][metric]/60).toFixed(2));
		} else {
			value = parseFloat(parseFloat(jsonData[i][metric]).toFixed(2));
		}

		if (!isNaN(value)) {
			data.push(
				[Date.parse(jsonData[i].date), value]
			);
			
		}
		
	}
	
	if (!chart) chart = new Highcharts.Chart(options);
	
	chart.series[0].remove();
	
	chart.addSeries({
		name: this.value,
		data: data,
		column: { pointPadding: 0.1 },
		type: graphType
	})
}

function getWorkouts(startMonth, endMonth) {
	$.ajax({
        //url: 'workouts/by_date_range/' + pastMonths + '.json',
        url: 'workouts/group_by/' + startMonth + '/' + endMonth + '.json',
        
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
	
					options.series[0].data.push(
						[Date.parse(data[i].date), parseFloat(parseFloat(data[i].distance).toFixed(2))]
						//[data[i].month, parseFloat(parseFloat(data[i].distance).toFixed(2))]
					);
				}
	
	
				chart = new Highcharts.Chart(options);
			} else {
				displayMetric(metric);
			}
			//chart.get('distance').setData(data, true);
        },
        cache: false
		
	});
}

$(document).ready(function() {

	// define the options
	options = {

		chart: {
			renderTo: 'container',
			defaultSeriesType: 'line',
			zoomType: 'x',
			height: Math.max($(window).height() - 400, 300)
		},

		title: {
			text: 'Dynamic Title Based on Chart'
		},

		subtitle: {
			text: 'Some super sweet subtitle action here'
		},

		xAxis: {
			type: 'datetime'
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
			pointPadding: 0.1
		}]
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
			getWorkouts(startMonth,endMonth)
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
		
	$(".groupby").click(
		function() {		
			displayMetric(this.id);
			metric = this.id;
		});
		
	$(".multiselectable").bind("mousedown", function(e) {
		  e.metaKey = true;
		}).selectable();
		
	$(".selectable").selectable();
});