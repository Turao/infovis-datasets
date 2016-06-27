d3.json("https://raw.githubusercontent.com/Turao/infovis-datasets/master/ex3/trending_topics.json", function(error, data) {

  // console.log(data[0]['trends']);

  data = data[0]['trends'].map(function(topic) {
    if(topic['name'].charAt(0) == '#') {
      topic['name'] = topic['name'].slice(1, topic['name'].length);
    }
    return topic;
  });

  // define biggest tweet_volume!!!
  // set biggest font size for this tweet
  // set other tweets font size according to this biggest one
  // ex: biggest: 5000, actual: 1000
  // 5000 -> set variable max_size = 50px; actual: tweet_volume_actual/biggest * max_size = 10px;

  var fill = d3.scale.category20();


  var height = 800,
      width  = 800;

  var biggest = 0;
  data.forEach( function(d) { if(d['tweet_volume'] > biggest) {biggest = d['tweet_volume'];}});
  console.log(biggest); 

  d3.layout.cloud().size([height, width])
      .words(data.map(function (d, i) {
        return {text: d['name'], size: (d['tweet_volume']/biggest * 100) < 15 ? 15 : (d['tweet_volume']/biggest * 100), url: d['url']};
      }))
      .rotate(function (d, i) { return ~~((i)%2) * 90; })
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