d3.json("https://raw.githubusercontent.com/Turao/infovis-datasets/master/ex3/trending_topics.json", function(error, data) {

  // console.log(data[0]['trends']);

  data = data[0]['trends'].map(function(topic) {
    if(topic['name'].charAt(0) == '#') {
      topic['name'] = topic['name'].slice(1, topic['name'].length);
    }
    return topic;
  });


  var fill = d3.scale.category20();


  var height = 800,
    width = 800;

  d3.layout.cloud().size([height, width])
      .words(data.map(function (d, i) {
        return {text: d['name'], size: 1 + data.length-i, url: d['url']};
      }))
      .rotate(function (d, i) { return ~~((data.length-i)%2) * 90; })
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
        .on("click", function (d, i){
          window.open(d['url']);
        })
        .text(function(d) { return d.text; });
  }

});