var timeout = null;

function secondsToHms(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}

function drawOptionsAccordion() {
	$('#optionsAccordion').easyAccordion({ 
			slideNum: false,
			autoStart: false	
	});
	
}

Chart = {
	chart : null,
	jsonData : null,
	startMonth : 12,
	endMonth : 0,
	options : null,
	seriesNumber : 0,
	path : null,
	seriesOptions : [],
	
	//default series options
	graphType : "column",
	metric : "distance",
	workoutType : "Run",
	groupBy : "month",	
	color : "#0776A0",
	
	
	SerieOptions : function() {
		this.graphType = Chart.graphType;
		this.metric = Chart.metric;
		this.workoutType = Chart.workoutType;
		this.groupBy = Chart.groupBy;
		this.color = Chart.color;
		this.data = null;
		
	},
	
	setType : function(newType) {		
		this.seriesOptions[this.seriesNumber].graphType = newType;				
		this.redrawChart();
	},
	
	setMetric : function(metric) {
		var o = this.seriesOptions[this.seriesNumber].metric = metric;
		this.setData();
		this.redrawChart();
	},
	
	redrawChart : function() {
		for(var i=0;i<this.chart.series.length;i++) {
			var o = this.seriesOptions[i];
			var serie = this.chart.series[0];
			
			this.chart.addSeries({
				name: o.metric,
				data: o.data,
				pointPadding: 0,
				type: o.graphType,
				yAxis: i,
				color: o.color
			}, false);
			
			serie.remove();
		}
		
		if (!timeout) timeout = setTimeout("drawOptionsAccordion()", 100);
	},
	
	setData : function() {
		var jsonData = this.jsonData;
		var data = [];
		var o = this.seriesOptions[this.seriesNumber];
		for (var i=0; i< jsonData.length; i++) {
			
			var value;

			if (o.metric == "vdotoverhr") {
				if (parseInt(jsonData[i]["avg_hr"]) > 30) {
					value = parseFloat(jsonData[i]["vdot"])/parseInt(jsonData[i]["avg_hr"]);
					value = parseFloat((value * 100).toFixed(2));
				} else {
					value = null;
				}
			} else if (o.metric == "duration" || o.metric == "pace") {
				value = parseFloat(parseFloat(jsonData[i][o.metric]).toFixed(0));
			} else {
				value = parseFloat(parseFloat(jsonData[i][o.metric]).toFixed(2));
			}
			
			if (isNaN(value)) value = null;
			
				
			var d = $.datepicker.parseDate('yy-mm-dd', jsonData[i].date).valueOf();
			data.push(
				//[$.datepicker.parseDate('yy-mm-dd', data[i].date), value]
				[d, value]
			);
				
			
			
		}
		
		o.data = data;
		
		//temporary hack for now to add the second series for the first time.
		if (this.seriesNumber == 1 && this.chart.series.length == 1) {
			this.chart.addSeries({

			}, false);
		}
	},
	
	getWorkouts : function() {
		
		var o = this.seriesOptions[this.seriesNumber];
		var that = this;
		$.ajax({
	        //url: 'workouts/by_date_range/' + pastMonths + '.json',
	        url: this.path + '/group_by/' +
	        o.groupBy + '/' + this.startMonth + '/' + 
	        this.endMonth + '/' + o.workoutType + '.json',
	        
	        dataType: 'json',
	        success: function(jsonData) {
				
				that.jsonData = jsonData;
				that.setData(jsonData);		
				that.redrawChart();		
	        },
	        cache: false
			
		});
	},
	
	setGroupBy : function(groupBy) {
		var o = this.seriesOptions[this.seriesNumber];
		o.groupBy = groupBy;
	},
	
	setWorkoutType : function(workoutType) {
		var o = this.seriesOptions[this.seriesNumber];
		o.workoutType = workoutType;
	},
	
	toolTipFormatter : function(tooltip) {
		var d = new Date(tooltip.x );
		var formattedString = d.toDateString() + '<br/>' + 
				tooltip.points[0].series.name + ': ' + 
				this.metricFormatter(tooltip.points[0].y, 0);
		if (tooltip.points[1]) {
			formattedString += '<br/>' + 
				tooltip.points[1].series.name + ': ' + 
				this.metricFormatter(tooltip.points[1].y, 1);
		}
		return formattedString;
	},
	
	labelFormatter : function(label, seriesNumber) {
		return this.metricFormatter(label.value, seriesNumber);
	},
	
	metricFormatter : function(value, seriesNumber) {
		var metric = this.seriesOptions[seriesNumber].metric;
		if (metric == "duration" || metric == "pace") {
			return secondsToHms(value);
		} else if (metric == "distance") {
			return value + " miles";
		} else if (metric == "speed") {
			return value + " mph";
		} else {
			return value;
		}
		
	},
	
	
	
	initialize : function() {
		
		var serieOptions = new Chart.SerieOptions();
		this.seriesOptions.push(serieOptions);
		
		var serieOptions2 = new Chart.SerieOptions();
		serieOptions2.graphType = "spline";
		serieOptions2.metric = "pace";
		serieOptions2.color ="#A61D00";
		this.seriesOptions.push(serieOptions2);
		
		this.chart = new Highcharts.Chart(this.options);
	},
	
	options : {

		chart: {
			renderTo: 'container',
			defaultSeriesType: 'spline',
			zoomType: 'x',
			height: Math.max($(window).height() - 400, 300),
			className: 'examplechart-container',
			marginRight: 100
		},
		
		colors: [
			'#0776A0', 
			'#A61D00'
		],

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
				text: "First Series"
			},
			labels: {	
            	formatter: function() {
            		var that = this;
                	return Chart.labelFormatter(that, 0);
	            }
	        }
		},
		{
			title: {
				text: "Second Series"
			},
			labels: {
            	formatter: function() {
                	var that = this;
                	return Chart.labelFormatter(that, 1);
	            }
	       },
			opposite: true
		}],

		legend: {
			align: 'left',
			verticalAlign: 'top',
			y: 20,
			floating: true,
			borderWidth: 0
		},

		tooltip: {
			shared: true,
			crosshairs: true,
			formatter: function() {
				var that = this;
				return Chart.toolTipFormatter(that);		
			}
		},

		series: [{
			id: 'distance',
			name: 'Distance',
			pointPadding: 0,
			connectNulls: true,
			yAxis: 1
		}],
		
		plotOptions: {
			series: {
				connectNulls: true
			}
		}
	}


	
}


$(document).ready(function() {
	
	Chart.path = window.location.pathname

	Chart.initialize();
	Chart.getWorkouts();
	
	
	
	$("#pastMonthsSlider").slider({
		values: [24,36],
		min: 0,
		max: 36,
		range: true,

		stop: function(event, ui) {
			Chart.startMonth = 36 - ui.values[0];
			Chart.endMonth = 36 - ui.values[1]
			$( "#pastMonthsText" ).html(Chart.startMonth + 
			" months ago to " + Chart.endMonth +" months ago");
			Chart.getWorkouts();
		}		
	});
	
	
	$(".graphType").click(
		function() {
			Chart.setType(this.id);			
		});
		
	$(".metric").click(
		function() {		
			Chart.setMetric(this.id);
		});
		
	$(".workoutType").click(
		function() {		
			Chart.setWorkoutType(this.id);
			Chart.getWorkouts();
		});
		
	$(".groupBy").click(
		function() {		
			Chart.setGroupBy(this.id);
			Chart.getWorkouts();
		});
		
	$(".multiselectable").bind("mousedown", function(e) {
		  e.metaKey = true;
		}).selectable();
		
	$(".selectable").selectable();
});