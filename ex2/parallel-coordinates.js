d3.csv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/ex2/flowers.csv", function(error, data) {

  var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      background,
      foreground;

  var svg = d3.select("#ch1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  console.log(data);

  // Extract the possible values for species
  var speciesSet = new Set();
  data.map(function (o){ speciesSet.add(o['species']); });

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    if(d == 'species') {
      y[d] = d3.scale.ordinal()
        .domain(Array.from(speciesSet))
        .rangeRoundPoints([height, 0]);
    }
    else {
      y[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
        .range([height, 0])
        .nice();
    }
    console.log(d, y[d].domain());
    console.log('species 0', y['species']);
    return y[d];
  }));


  // Add grey background lines for context.
  background = svg.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path);


  // Creates a color function
  var color = d3.scale.category10()
    .domain(Array.from(speciesSet));


  // Add blue foreground lines for focus.
  foreground = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path)

    // // DISABLE TO USE DIFFERENT COLORS FOR EACH SPECIES!    
    .attr("stroke", 'steelblue');

    // // ENABLE TO USE DIFFERENT COLORS FOR EACH SPECIES!
    // .attr("stroke", function(data) {
    //   console.log(color(data['species']));
    //   return color(data['species']);
    // });

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  // Add an axis and title.
  g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -10)
    .text(function(d) { return d; });


  // Add and store a brush for each axis.
  g.append("g")
    .attr("class", "brush")
    .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
    .selectAll("rect")
    .attr("x", -10)
    .attr("width", 16);




  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }




});


