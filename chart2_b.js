// little workaround, as chrome doesn't support this
// very basic method yet...
// Object.values = function(o){return Object.keys(o).map(function(k){return o[k]})};

d3.tsv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/cancerData.tsv",
function(err, d) {

	// binding data
	var chartData = d;

	// 1. How often appears which type of cancer (independent of age group)?
	var percentages = [];

    // counting by type of cancer (independent of age)
    chartData.forEach(function(cancerType) {
    	var dict = {};
    	dict['Site'] = cancerType['Site'];
    	dict['PMid-Adults'] = parseFloat(cancerType['PMid-Adults']);
    	percentages.push(dict);
    });
	

	// ****************
	// MAKING THE CHART
	// ****************

	// chart's properties
	var margin = {top: 10, right: 20, bottom: 10, left: 100},
		height = 350,
		width = 460;

	// bars' properties
	var radius = Math.min(width, height) / 2.0;
	var thickness = 50;

	var color = d3.scale.category10()

	// adds the bars svg to the chart's div
	var chart = d3.select('#ch2_b').append("svg")
	   .attr('width', width + margin.left + margin.right)
	   .attr('height', height + margin.top + margin.bottom)
	   .append("g")
       .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")");

    chart.append("text")
       .attr("x", (width / 2))             
       .attr("y", margin.top)
       .attr("text-anchor", "middle")  
       .style("font-size", "14px")
       .style("font-weight","bold") 
       .text(" Types of cancer distributed within one age group (Mid-Adults)");

    var arc = d3.svg.arc()
	   .outerRadius(radius - thickness)
	   .innerRadius(radius - thickness*2);

    var arcOver = d3.svg.arc()
       .innerRadius(radius - thickness*2)
       .outerRadius(radius - thickness + 20);

    var pie = d3.layout.pie()
	   .sort(null)
	   .value(function (d) {return d['PMid-Adults']});

     var g = chart.selectAll(".arc")
	   .data(pie(percentages))
	   .enter().append("g")
	   .attr("class", "arc")
	   .attr("transform", "translate(" + width/2 + "," + (height/2 + margin.top) + ")");

	g.append("path")
	   .attr("d", arc)
	   .style("fill", function (d, i) { return color(i); })
       .on("mouseover", function(d) {
            d3.select(this).transition()
            .duration(1000)
            .attr("d", arcOver);
        })
       .on("mouseout", function(d) {
              d3.select(this).transition()
             .duration(1000)
             .attr("d", arc);
        })
	   .attr("data-legend", function (d) { return d.name});

	var values = chart.append("g")
	  .attr("class", "legend")
	  .attr("x", width - 65)
	  .attr("y", 25)
	  .attr("height", 100)
	  .attr("width", 100);

	values.selectAll('g').data(percentages)
      .enter()
      .append('g')
      .each(function(d, i) {
        var g = d3.select(this);
      
        g.append("rect")
          .attr("x", width/2 - 15)
          .attr("y", ((i+1) * 15 + 6 + height/3))
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color(i));
        
        g.append("text")
          .attr("x", width/2)
          .attr("y", ((i+1) * 15 + 15 + height/3))
          .attr("height",30)
          .attr("width",100)
          .attr("font-size", "10px")
          .style("fill", color(i))
          .text(d["PMid-Adults"] + "%");
      });


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
        .attr("x", -20)
        .attr("y", (i+1) * 15 + 40)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color(i));
   
      g.append("text")
        .attr("x", -5)
        .attr("y", (i+1) * 15 + 49)
        .attr("height",30)
        .attr("width",100)
        .attr("font-size", "10px")
        .style("fill", color(i))
        .text(d.Site);
    });

});