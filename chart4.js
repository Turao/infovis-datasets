// little workaround, as chrome doesn't support this
// very basic method yet...
Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
	function(err, d) {

	// binding data
	var chartData = d;
	var percentages = [];

    // % of distribution independent of age
    chartData.forEach(function(cancerType) {
    	var dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Percentage'] = parseFloat(cancerType['PChildren'])/100;
    	percentages.push(dict);

    	var dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Percentage'] = parseFloat(cancerType['PMid-Adults']/100);
    	percentages.push(dict);
    	
    	var dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['Percentage'] = parseFloat(cancerType['POlder Adults'])/100;									    	    	    			
		percentages.push(dict);
    });
		

	// ****************
	// MAKING THE CHART
	// ****************

	// chart's properties
	var margin = {top: 50, right: 20, bottom: 100, left: 100},
			height = 240,
			width = 420;

	// bars' properties
	var barWidth = 10;

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
        .text("Distribution of cancer by group");


	var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
			return "<span style='color:white'>" + (d['Percentage'] * 100).toFixed(1) + "</span>";
			})

    var color_hash = {  
    					0 : ["Child", "#009292"],
					    1 : ["Mid-Adult", "#B66DFF"],
					    2 : ["Old Adult", "#DC6D00"]
					 }

	// scales
	var y = d3.scale.linear()
			.domain([0, 0.5])
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
		 		return color_hash[String(i % 3)][1];
		 	})
		.attr('width', barWidth)
		.attr('height', function (data) {				
				return height - y(data['Percentage']);
		 	})
		.attr('x', function (data, i) {
		 		return x(data['Site']) + (i % 3) * barWidth + (barWidth * 1.5);
		 	})
		.attr('y', function (data) {
		  	return y(data['Percentage']);
 		})
		.on('mouseover', tip.show)
  		.on('mouseout', tip.hide);

	chart.call(tip);

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

	// add legend   
	var legend = chart.append("g")
	  .attr("class", "legend")
	  .attr("x", width - 65)
	  .attr("y", 25)
	  .attr("height", 100)
	  .attr("width", 100);

	legend.selectAll('g').data(percentages)
      .enter()
      .append('g')
      .each(function(d, i) {
        var g = d3.select(this);
      
        g.append("rect")
          .attr("x", 50)
          .attr("y", (i % 3 ) * 25)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color_hash[String(i % 3)][1]);
        
        g.append("text")
          .attr("x", 65)
          .attr("y", (i % 3) * 25 + 10)
          .attr("height",30)
          .attr("width",100)
          .style("fill", color_hash[String(i % 3)][1])
          .text(color_hash[String(i % 3)][0]);
      });

});



 