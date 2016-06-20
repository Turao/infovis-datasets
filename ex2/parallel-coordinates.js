d3.csv("https://raw.githubusercontent.com/Turao/infovis-datasets/master/ex2/flowers.csv", function(error, data) {

  var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {};
      dragging = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      background,
      foreground;

  var svg = d3.select("#ch1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Extract the possible values for species
  var speciesSet = new Set();
  data.map(function (o){ speciesSet.add(o['species']); });

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    if(d == 'species') {
      y[d] = d3.scale.ordinal()
        .domain(Array.from(speciesSet))
        .rangeRoundPoints([height, 0])
    }
    else {
      y[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return +p[d]; }))
        .range([height, 0])
        .nice();
    }

    return y[d];
  }));


   // Creates a color function
  var color = d3.scale.ordinal()
    .domain(Array.from(speciesSet))
    // .range(["#a7d6ee", "#eee3a7" , "#eea7b2"]);
    .range(["#92ccea", "#eadc92" , "#ea929f"]);



  // Add grey background lines for context.
  background = svg.append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path);

  // highlighted lines
  var highlighted = new Set();




  function addRow(path) {
    var table = document.getElementById('table-contents');
    var newRow = table.insertRow();
    newRow.className = 'highlighted-line-values';
    newRow.id = 'highlighted' + path[0][0]['outerHTML'];

    var species = newRow.insertCell();
    species.innerHTML = path[0][0]['__data__']['species'];

    var sepal_length = newRow.insertCell();
    sepal_length.innerHTML = path[0][0]['__data__']['sepal length'];

    var sepal_width = newRow.insertCell();
    sepal_width.innerHTML = path[0][0]['__data__']['sepal width'];

    var petal_length = newRow.insertCell();
    petal_length.innerHTML = path[0][0]['__data__']['petal length'];

    var petal_width = newRow.insertCell();
    petal_width.innerHTML = path[0][0]['__data__']['petal width'];
  }

  function deleteRow(path) {
    var rowToBeDeleted = document.getElementById('highlighted' + path[0][0]['outerHTML']);
        rowToBeDeleted.parentNode.removeChild(rowToBeDeleted);
  }


  function highlightRow(path) {
    var rowToBeHighlighted = document.getElementById('highlighted' + path[0][0]['outerHTML']);
    rowToBeHighlighted.className = 'highlighted-row';
  }

  function unhighlightRow(path) {
    var rowToBeUnhighlighted = document.getElementById('highlighted' + path[0][0]['outerHTML']);
    rowToBeUnhighlighted.className = 'highlighted-line-values';
  }


 


  function highlightPath (path) {
    highlighted.add(path[0][0]);

    path.attr("stroke", '#a8db44')
      .attr("stroke-width", "5px");

    addRow(path);
  };

  function unhighlightPath (path) {
    if(highlighted.has(path[0][0])) {
      highlighted.delete(path[0][0]);

      var rowToBeDeleted = document.getElementById('highlighted' + path[0][0]['outerHTML']);
      rowToBeDeleted.parentNode.removeChild(rowToBeDeleted);
    }
    
    path.attr("stroke", function(data) {
        return color(data['species']);
      })
      .attr("stroke-width", "1px");
  };





  // Add blue foreground lines for focus.
  foreground = svg.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .on("mouseover", function() {
      var path = d3.select(this);
      if(!highlighted.has(path[0][0])) {
        path.attr("stroke", '#f06060')
          .attr("stroke-width", "4px");

      // COMMENT TO DISABLE FORM VALUES UPDATE
      document.getElementById("species").innerHTML      = path[0][0]['__data__']['species'];
      document.getElementById("sepal-length").innerHTML = path[0][0]['__data__']['sepal length'];
      document.getElementById("sepal-width").innerHTML  = path[0][0]['__data__']['sepal width'];
      document.getElementById("petal-length").innerHTML = path[0][0]['__data__']['petal length'];
      document.getElementById("petal-width").innerHTML  = path[0][0]['__data__']['petal width'];

      }
      else {
        highlightRow(path);
      }
    })
    .on("mouseout", function() {
      var path = d3.select(this);

      if(!highlighted.has(path[0][0])) {
        unhighlightPath(path);
      }
      else {
        unhighlightRow(path);
      }

      // COMMENT TO DISABLE FORM VALUES UPDATE
      document.getElementById("species").innerHTML      = "&nbsp;";
      document.getElementById("sepal-length").innerHTML = "&nbsp;";
      document.getElementById("sepal-width").innerHTML  = "&nbsp;";
      document.getElementById("petal-length").innerHTML = "&nbsp;";
      document.getElementById("petal-width").innerHTML  = "&nbsp;";

    })
    .on("click", function() {
      var path = d3.select(this);

      if(!highlighted.has(path[0][0])) {
        highlightPath(path);
      }
      else {
        unhighlightPath(path);
      }
    })

    // // DISABLE TO USE DIFFERENT COLORS FOR EACH SPECIES!    
    //.attr("stroke", 'steelblue');

    // // ENABLE TO USE DIFFERENT COLORS FOR EACH SPECIES!
    .attr("stroke", function(data) {
      return color(data['species']);
    });

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
    .attr("class", "axis")
    .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -10)
    .text(function(d) { return d; });

  // // Add and store a brush for each axis.
  g.append("g")
    .attr("class", "brush")
    .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
    .selectAll("rect")
    .attr("x", -10)
    .attr("width", 16);

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  //function path(d) {
  //  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  //}

  function path(d) {
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        if(p == 'species') {
            return extents[i][0] <= y[p](d[p])  && y[p](d[p]) <= extents[i][1];
        } else {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];     
        }
      }) ? null : "none";
    });
  }

});
