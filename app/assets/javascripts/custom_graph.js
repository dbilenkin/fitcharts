Graph = function(w, h) {

		this.distanceData = [];
		
		myChart = new Highcharts.Chart({
				
				chart: {
					defaultSeriesType: 'spline',
					renderTo: 'graph',
					defaultSeriesType: 'line',
					marginRight: 130,
					marginBottom: 40,
					height: h,
					width: w
				},
				title: {
					text: 'Runnin',
					x: -20 //center
				},
				subtitle: {
					text: 'crazzzyy graphs, baby!',
					x: -20
				},
				xAxis: {
					title: {
						text: 'Miles'
					}
				},
				yAxis: {
					title: {
						text: 'Date'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				tooltip: {
					formatter: function() {
			                return '<b>'+ this.series.name +'</b><br/>'+
							this.x +': '+ this.y;
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -10,
					y: 100,
					borderWidth: 0
				},
				series: [{
					id: 'distance',
					name: 'Distance'
				}]
			});
			
		this.update = function() {
			$.ajax({
		        url: 'workouts.json',
		        dataType: 'json',
		        data: data,
		        success: function(data) {
		            myChart.get('distance').setData(data, true);
		        },
		        cache: false
		    });
			

		};
		
};