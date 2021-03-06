var chart;
$(document).ready(function() {
	chart = new Highcharts.Chart({
		
		colors: [
			'#226078',
			'#BF7A30',
			'#024C68',
			'#A65600'
		],
		
		chart: {
			renderTo: 'container',
			type: 'column'
		},
		title: {
			text: 'Yearly Comparison of Monthly Miles'
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec'
			]
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Miles'
			}
		},
		legend: {
			layout: 'vertical',
			backgroundColor: '#FFFFFF',
			align: 'left',
			verticalAlign: 'top',
			x: 100,
			y: 70,
			floating: true,
			shadow: true
		},
		tooltip: {
			formatter: function() {
				return ''+
				this.x + ', ' + this.series.name + ': '+ this.y +' miles';
			}
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
			series: [{
			name: '2009',
			data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

		}, {
			name: '2010',
			data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

		}, {
			name: '2011',
			data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

		}, {
			name: '2012',
			data: [42.4, 33.2]

		}]
	});
	
	$(".multiselectable").bind("mousedown", function(e) {
		  e.metaKey = true;
		}).selectable();
		
	$(".selectable").selectable();
});