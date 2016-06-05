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
    	dict['PChildren'] = parseFloat(cancerType['PChildren']);
    	dict['PMid-Adults'] = parseFloat(cancerType['PMid-Adults']);
    	dict['POlder Adults'] = parseFloat(cancerType['POlder Adults']);
    	percentages.push(dict);
    });
	// console.log('percentages:', percentages);

	// ****************
	// MAKING THE CHART
	// ****************

	// chart's properties
	var margin = {top: 15, right: 20, bottom: 10, left: 100},
		height = 350,
		width = 450;

	// bars' properties
	var radius = Math.min(width, height) / 1.7;
	var thickness = 60;

	var color = d3.scale.category10()

	// adds the bars svg to the chart's div
	var chart = d3.select('#ch2').append("svg")
	   .attr('width', width + margin.left + margin.right)
	   .attr('height', height + margin.top + margin.bottom)
	   .append("g")
       .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")");

    chart.append("text")
       .attr("x", (width / 2))             
       .attr("y", margin.top)
       .attr("text-anchor", "middle")  
       .style("font-size", "14px") 
       .text(" Types of cancer distributed within one age group (Children)");

    var arc = d3.svg.arc()
	   .outerRadius(radius - thickness)
	   .innerRadius(radius - thickness*2);

    var pie = d3.layout.pie()
	   .sort(null)
	   .value(function (d) {return d['PChildren']});

    var g = chart.selectAll(".arc")
	   .data(pie(percentages))
	   .enter().append("g")
	   .attr("class", "arc")
	   .attr("transform", "translate(" + width/2 + "," + (height/2 + margin.top) + ")");

	g.append("path")
	   .attr("d", arc)
	   .style("fill", function (d, i) { return color(i); })
	   .attr("data-legend", function (d) { return d.name});

	g.append("text")
	   .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	   .text(function(d) { return d.value; });

	// to do
	// legend = chart.append("g")
	//   .attr("class", "legend")
	//   .attr("transform", "translate (50,30)")
	//   .style("font-size", "12px")
	//   .call(d3.legend);

});