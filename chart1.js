// little workaround, as chrome doesn't support this
// very basic method yet...
Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
function(err, d) {

	// binding data
	var chartData = d;

	// 1. How often appears which type of cancer (independent of age group)?
	var incidents = [];

    // counting by type of cancer (independent of age)
    chartData.forEach(function(cancerType) {
    	var dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Total'] = parseInt(cancerType['Children']) 
    				  + parseInt(cancerType['Mid-Adults']) 
    				  + parseInt(cancerType['Older Adults']);
    	incidents.push(dict);
    });
		
	// console.log('incidents:', incidents);

	// ****************
	// MAKING THE CHART
	// ****************

	// chart's properties
	var margin = {top: 60, right: 10, bottom: 30, left: 75},
		height = 240,
		width = 420;

	// bars' properties
	var barWidth = 40;

	// adds the bars svg to the chart's div
	var chart = d3.select('#ch1').append("svg")
	   .attr('width', width + margin.left + margin.right)
	   .attr('height', height + margin.top + margin.bottom)
	   .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.append("text")
       .attr("x", (width / 2))             
       .attr("y", 0 - (margin.top / 2))
       .attr("text-anchor", "middle")  
       .style("font-size", "14px")
       .text("Incidents per type of cancer (independent of age)");

	// scales
	var y = d3.scale.linear()
	   .domain([0, d3.max(incidents.map(function (incident) {
				return incident['Total'];
			}))
		])
	   .range([height, 0]);

	var x = d3.scale.ordinal()
	   .domain(incidents.map(function (incident) {
	   			return incident['Site'];
	   		})
	    )
	    
	   .rangeRoundBands([0, width])

	var color = d3.scale.category10()


	var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
			return "<span style='color:white'>" + d['Total'] + "</span>";
			})

	// bars'
	chart.selectAll('rect').data(incidents)
		.enter().append('rect')
		.style({'stroke': 'white', 'stroke-width': '0.2'})
		.attr('fill', function (data, i) {
			return color(i);
		})
		.attr('width', barWidth)
		.attr('height', function (data) {
			return height - y(data['Total']);
		})
		.attr('x', function (data, i) {
		 	return x(data['Site'])
		 	// + offset to center the bar with the column name
		 	+ width/(Object.keys(incidents).length*2)
		 	- barWidth/2;
		})
		.attr('y', function (data) {
		  	return y(data['Total']);
		})		
		.on('mouseover', tip.show)
  		.on('mouseout', tip.hide);

	chart.call(tip);;

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