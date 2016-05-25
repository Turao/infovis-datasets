


d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
	function(err, d) {
		// binding data
		var chartData = d;

		// chart's properties
		var height = 500,
				width = 1000,
		    margin = 100;

		// bars' properties
		var barWidth = 50;

		var chart = d3.select('#chart')
		  .attr('width', width)
		  .attr('height', height);


		// grouping by type of cancer (independent of age)
		var incidents = [];
		var children = 0,
				mid = 0,
				older = 0;
		// so, for each type of cancer we count the incidents
		chartData.forEach(function(d) {
			children += parseInt(d['Children']);
			mid += parseInt(d['Mid-Adults']);
			older += parseInt(d['Older Adults']);
		});
		incidents.push(children);
		incidents.push(mid);
		incidents.push(older);

		console.log(incidents);

		// scales
		var yScale = d3.scale.linear()
				.domain([0,d3.max(incidents)])
		    .range([0, height]);
		        

		console.log(chartData.length);
		var xScale = d3.scale.ordinal()
		    .domain(d3.range(0, incidents.length))
		    .rangeBands([0, width]);

		// bars'
		chart.selectAll('rect').data(incidents)
			.enter().append('rect')
			.style({'fill': '#cccccc', 'stroke': 'black', 'stroke-width': '1'})
			.attr('width', barWidth)
			.attr('height', function (data) {
					return height - yScale(data);
			 	})
			.attr('x', function (data, i) {
			 		return xScale(i);
			 	})
			.attr('y', function (data) {
			  	return yScale(data);
	 		});


			//x-axis
			var xAxis = d3.svg.axis()
			  .scale(xScale)
			  .orient("bottom");
			    
			chart.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
				.call(xAxis);
			  
			//y-axis
			var yAxis = d3.svg.axis()
			  .scale(yScale)
			  .orient("left");
			  
			chart.append("g")
			  .attr("class", "y axis")
			  .call(yAxis);


	});

 