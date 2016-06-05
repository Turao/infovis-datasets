// little workaround, as chrome doesn't support this
// very basic method yet...
Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
function(err, d) {

	// binding data
	var chartData = d;

	var percentages = [];

    // extracting the frequency evolution of each cancer type
    chartData.forEach(function (cancerType, i) {
    	var type = [];
    	var dict = {};

    	dict['Site'] = cancerType['Site'];
    	dict['Group'] = 'Children';
    	dict['Percentage'] = parseFloat(cancerType['PChildren'])/100;
    	type.push(dict);

    	dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Group'] = 'Mid-Adults';
    	dict['Percentage'] = parseFloat(cancerType['PMid-Adults'])/100;
    	type.push(dict);

    	dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Group'] = 'Older Adults';
    	dict['Percentage'] = parseFloat(cancerType['POlder Adults'])/100;

    	type.push(dict);
    	percentages.push(type);
    });

	// ****************
	// MAKING THE CHART
	// ****************

	// chart's properties
	var margin = {top: 60, right: 10, bottom: 30, left: 75},
	height = 240,
	width = 420;

	// scales
	var y = d3.scale.linear()
		.domain([0, 0.5])
		.range([height, 0]);

	var keys = percentages[0].map( function(o) { return o['Group']; });
	var x = d3.scale.ordinal()
		.domain(keys)
		.rangeRoundBands([0, width])

	var color = d3.scale.category10()

	// select the chart div
	// and fill its properties values
	var chart = d3.select('#ch3').append("svg")
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	chart.append("text")
		.attr("x", (width / 2))             
		.attr("y", 0 - (margin.top / 2))
		.attr("text-anchor", "middle")  
		.style("font-size", "14px") 
		.text("How does the cancer frequency changes as you age...");

    // x-axis
    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

    chart.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

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
	
	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");

	// creates a line closure binding x and y scale functions
	var line = d3.svg.line()
		.x(function (d) {
		  	return x(d['Group']) + width/(percentages[0].length * 2); 
		})
		.y(function (d) {
		    return y(d['Percentage']); 
		});


	// plot the lines
	percentages.forEach( function (site, i) {
		chart.append("path")
	 	.datum(percentages[i])
		.attr('class', 'line')
		.attr('fill', 'none')
		.attr('stroke', color(i))
		.attr('stroke-width', '1px')
		.attr('d', line);		 
	});

});