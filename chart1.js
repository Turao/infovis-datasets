// little workaround, as chrome doesn't support this
// very basic method yet...
Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
	function(err, d) {

		// binding data
		var chartData = d;

		var incidents = {
    	'Children': 0,
    	'Mid-Adults': 0,
    	'Older Adults': 0
    };
    // selecting columns by type of cancer (independent of age) and counting
    chartData.forEach(function(site) {
    	incidents['Children'] += parseInt(site['Children']);
    	incidents['Mid-Adults'] += parseInt(site['Mid-Adults']);
    	incidents['Older Adults'] += parseInt(site['Older Adults']);
    });
		console.log('incidents:', incidents);



		// ****************
		// MAKING THE CHART
		// ****************

		// chart's properties
		var margin = {top: 50, right: 20, bottom: 100, left: 100},
				height = 240,
				width = 420;

		// bars' properties
		var barWidth = 20;



		// creating the chart elements in the html
		var div = d3.select('#chart')
			.attr('width', width + margin.left + margin.right)
		  .attr('height', height + margin.top + margin.bottom);

		// adds the bars svg to the chart's div
		var chart = d3.select('#chart').append("svg")
		  .attr('width', width + margin.left + margin.right)
		  .attr('height', height + margin.top + margin.bottom)
		  .append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .text("Incidents per age group");



		// scales
		var y = d3.scale.linear()
				.domain([0, d3.max(Object.values(incidents))])
		    .range([height, 0]);

		var x = d3.scale.ordinal()
		    .domain(Object.keys(incidents))
		    .rangeRoundBands([0, width])
		var x_colors = d3.scale.category10()


		// bars'
		chart.selectAll('rect').data(Object.values(incidents))
			.enter().append('rect')
			.style({'stroke': 'black', 'stroke-width': '0.2'})
			.attr('fill', function (i) {
				return x_colors(i);
			})
			.attr('width', barWidth)
			.attr('height', function (data) {
					return height - y(data);
			 	})
			.attr('x', function (data, i) {
			 		return x(Object.keys(incidents)[i])
			 		// + offset to center the bar with the column name
			 		 + width/(Object.keys(incidents).length*2)
			 		 - barWidth/2;
			 	})
			.attr('y', function (data) {
			  	return y(data);
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
			  .orient("left");
			  
			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis);
	});

 