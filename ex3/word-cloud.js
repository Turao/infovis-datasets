d3.json("https://raw.githubusercontent.com/Turao/infovis-datasets/master/ex3/trending_topics.json", function(error, data) {

  data = data.map(function(topic) {
    if(topic.charAt(0) == '#') {
      topic = topic.slice(1, topic.length);
    }
    return topic;
  });


  var fill = d3.scale.category20();


  var height = 800,
    width = 800;

  d3.layout.cloud().size([height, width])
      .words(data.map(function (d, i) {
        // console.log(data.length-i);
        return {text: d, size: 1 + data.length-i};
      }))
      .rotate(function (d, i) { return ~~(data.length-i) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("#wc1").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + height/2 + "," + width/2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }

});