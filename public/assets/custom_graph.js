function changeType(a,b){for(var c=0;c<a.length;c++)serie=a[0],serie.chart.addSeries({type:b,name:serie.name,color:serie.color,data:serie.options.data},!1),serie.remove(),options.chart.defaultSeriesType=b}function displayMetric(a){var b=[];for(var c=0;c<jsonData.length;c++){var d;a=="vdotoverhr"?parseInt(jsonData[c].avg_hr)>30?(d=parseFloat(jsonData[c].avg_vdot)/parseInt(jsonData[c].avg_hr),d=parseFloat((d*100).toFixed(2))):d=null:a=="duration"||a=="pace"?d=parseFloat(jsonData[c][a]/60):d=parseFloat(parseFloat(jsonData[c][a]).toFixed(2)),isNaN(d)||b.push([Date.parse(jsonData[c].date),d])}chart||(chart=new Highcharts.Chart(options)),chart.series[0].remove(),chart.addSeries({name:this.value,data:b,column:{pointPadding:.1},type:graphType})}function getWorkouts(a,b){$.ajax({url:"workouts/group_by/"+a+"/"+b+".json",dataType:"json",success:function(a){var b=[{id:"distance",name:"Distance"}];jsonData=a;if(!chart){options.series=b,options.series[0].data=[];for(var c=0;c<a.length;c++)options.series[0].data.push([Date.parse(a[c].date),parseFloat(parseFloat(a[c].distance).toFixed(2))]);chart=new Highcharts.Chart(options)}else displayMetric(metric)},cache:!1})}var chart,jsonData,pastMonths=1,options,graphType="line",metric="distance";$(document).ready(function(){options={chart:{renderTo:"container",defaultSeriesType:"line",zoomType:"x",height:$(window).height()-350},title:{text:"Daily Workouts"},subtitle:{text:"Last 30 Days; Zoom In"},xAxis:{type:"datetime"},yAxis:[{title:{text:"Miles"}}],legend:{align:"left",verticalAlign:"top",y:20,floating:!0,borderWidth:0},tooltip:{},series:[{id:"distance",name:"Distance",pointPadding:.1}]},getWorkouts(12,0),$("#pastMonthsSlider").slider({values:[24,36],min:0,max:36,range:!0,stop:function(a,b){startMonth=36-b.values[0],endMonth=36-b.values[1],$("#pastMonthsText").html(startMonth+" months ago to "+endMonth+" months ago"),getWorkouts(startMonth,endMonth)}}),$(".graphType").click(function(){changeType(chart.series,this.id),graphType=this.id}),$(".metric").click(function(){displayMetric(this.id),metric=this.id})});