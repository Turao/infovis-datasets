// little workaround, as chrome doesn't support this
// very basic method yet...
Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
	function(err, d) {

		// binding data
		var chartData = d;


		// 1. How often appears which type of cancer (independent of age group)?
		var percentages = [];

    // % of distribution independent of age
    chartData.forEach(function(cancerType) {
    	var dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Percentage'] = (
    											parseFloat(cancerType['PChildren'])
									    	+ parseFloat(cancerType['PMid-Adults'])
									    	+ parseFloat(cancerType['POlder Adults'])
									    	)/300; // ((children + mid + older) / num. of groups) / 100
			percentages.push(dict);
    });
		console.log('percentages:', percentages);



		// ****************
		// MAKING THE CHART
		// ****************

		// chart's properties
		var margin = {top: 50, right: 20, bottom: 100, left: 100},
				height = 240,
				width = 420;

		// bars' properties
		var barWidth = 20;

		// adds the bars svg to the chart's div
		var chart = d3.select('#ch4').append("svg")
		  .attr('width', width + margin.left + margin.right)
		  .attr('height', height + margin.top + margin.bottom)
		  .append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .text("Distribution of cancer independent of age");



    // scales
		var y = d3.scale.linear()
				.domain([0, 1])
		    .range([height, 0]);

		var x = d3.scale.ordinal()
		    .domain(percentages.map(function (percentage) {
		    												return percentage['Site'];
		    											})
		    )
		    
		    .rangeRoundBands([0, width])
		var color = d3.scale.category10();



		// bars'
		chart.selectAll('rect').data(percentages)
			.enter().append('rect')
			.style({'stroke': 'black', 'stroke-width': '0.2'})
			.attr('fill', function (data, i) {
				return color(i);
			})
			.attr('width', barWidth)
			.attr('height', function (data) {
					return height - y(data['Percentage']);
			 	})
			.attr('x', function (data, i) {
			 		return x(data['Site'])
			 		// + offset to center the bar with the column name
			 		 + width/(Object.keys(percentages).length*2)
			 		 - barWidth/2;
			 	})
			.attr('y', function (data) {
			  	return y(data['Percentage']);
	 		});




			//x-axis
			var xAxis = d3.svg.axis()
			  .scale(x)
			  .orient("bottom");
			    
			chart.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			  
			//y-axis
			var yAxis = d3.svg.axis()
			  .scale(y)
			  .orient("left")
			  .tickFormat(d3.format("%"));
			  
			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis);

	});

 