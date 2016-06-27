d3.json("https://rawgit.com/Turao/infovis-datasets/master/ex3/trending_topics.json", function(error, data) {

  // console.log(data[0]['trends']);

  data = data[0]['trends'].map(function(topic) {
    if(topic['name'].charAt(0) == '#') {
      topic['name'] = topic['name'].slice(1, topic['name'].length);
    }
    return topic;
  });

  var fill = d3.scale.category20();

  var height = 600,
      width  = 600;

  var biggest = 0;
  data.forEach( function(d) { if(d['tweet_volume'] > biggest) {biggest = d['tweet_volume'];}});
  // console.log(biggest); 

  d3.layout.cloud().size([height, width])
      .words(data.map(function (d, i) {
        return {text: d['name'], size: (d['tweet_volume']/biggest * 100) < 15 ? 15 : (d['tweet_volume']/biggest * 100), url: d['url']};
      }))
      .rotate(function() { return 0; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", drawCloud)
      .start();

  d3.layout.cloud().size([height, width])
      .words(data.map(function (d, i) {
        return {text: d['name'], size: (d['tweet_volume']/biggest * 100) < 15 ? 15 : (d['tweet_volume']/biggest * 100), url: d['url']};
      }))
      .rotate(function(d, i) { return ~~(i) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", drawMosaic)
      .start();

  function drawCloud(words) {
   
    //Construct the word cloud's SVG element
    var svg = d3.select("#wc1").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + height/2 + "," + width/2 + ")");

    var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

    //Entering words
    cloud.enter()
        .append("text")
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr('font-size', 1000)
        .text(function(d) { return d.text; })
        .attr("transform", "translate(" + height/2 + "," + width/2 + ")")
        .on("click", function (d, i){
            window.open(d['url']);
        });

    //Entering and existing words
    cloud
        .transition()
            .duration(1000)
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

  }

  function drawMosaic(words) {
   
    //Construct the word mosaic's SVG element
    var svg1 = d3.select("#wc2").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + height/2 + "," + width/2 + ")");
        //.rotate(function (d, i) { return ~~((i)%2) * 90 })

    var cloud1 = svg1.selectAll("g text")
                        .data(words, function(d) { return d.text; })

    //Entering words
    cloud1.enter()
        .append("text")
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr('font-size', 500)
        .text(function(d) { return d.text; })
        .attr("transform", "translate(" + height/2 + "," + width/2 + ")")
        .on("click", function (d, i){
            window.open(d['url']);
        });

    //Entering and existing words
    cloud1
        .transition()
            .duration(2000)
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

  }

});