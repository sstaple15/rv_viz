function rvBubble3(data, title, plot) {

  var svg = d3.select(plot),
  margin = {top: 50, right: 25, bottom: 50, left: 75},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add a title, subtitle, and data source
  g.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(title)

  g.append("text")
    .attr("x", width)
    .attr("y", height + margin.bottom/5)
    .attr("text-anchor", "end")
    .style("font-style", "italic")
    .text("Source: RapidVisa")

  var padding = 1.5, // separation between same-color nodes
      clusterPadding = 6; // separation between different-color nodes

  var myScale = d3.scaleLinear()
    .domain([0, 200])
    .range([3, 35]);

  var myScale2 = d3.scaleOrdinal()
    .domain(["Africa", "Americas", "Asia", "Europe", "Oceania"])
    .range([1, 2, 3, 4, 5]);

  var n = data[0].length, // total number of nodes
      m = 1; // number of distinct clusters

  var color = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5])
    .range(["#447d9c", "#38a25e", "#f81128", "#f18721", "#606060"]);

  for (var i = 0; i < data[0].length; i++) {
    data[0][i].radius = myScale(data[0][i].value);
    data[0][i].x = Math.cos(2*Math.PI)*200 + width/2 + Math.random();
    data[0][i].y = Math.sin(2*Math.PI)*200 + height/2 + Math.random();
    data[0][i].cluster = 1;
    // // data[0][i].index = i;
    // var d = {
    //   cluster: data[0][i].j,
    //   radius: data[0][i].radius,
    //   x: data[0][i].x,
    //   y: data[0][i].y
    // };
    // if (!clusters[data[0][i].j] || (data[0][i].radius > clusters[i].radius)) clusters[i] = d;
    // return d;
  };

  function create_nodes(data, node_counter) {

    var i = data[node_counter].cluster,
        r = myScale(data[node_counter].value),
        name = data[node_counter].id,
        value = data[node_counter].value,
        region = data[node_counter].id,
        d = {
          cluster: i,
          radius: r,
          name: name,
          region: region,
          value: value,
          x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        };
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        return d;
  };

  var clusters = new Array(m);
  var nodes = [];
  for (var i=0; i < n; i++) {
    nodes.push(create_nodes(data[0], i));
  };

  // var nodes = d3.range(n).map(function () {
  //     var i = Math.floor(Math.random() * m),
  //         r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
  //         d = {
  //           cluster: i,
  //           radius: r,
  //           x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
  //           y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
  //         };
  //     if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  //     return d;
  // });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
      return "Occupation: " + d.name + "<br/>Count: " + d3.format(",")(d.value);
    });

  svg.call(tip);

  var simulation = d3.forceSimulation()
    // keep entire simulation balanced around screen center
    .force('center', d3.forceCenter(width/2, height/2))

    // pull toward center
    .force('attract', d3.forceAttract()
      .target([width/2, height/2])
      .strength(0.01))

    // cluster by section
    .force('cluster', d3.forceCluster()
      .centers(function (d) { return clusters[d.cluster]; })
      .strength(0.5)
      .centerInertia(0.1))

    // apply collision with padding
    .force('collide', d3.forceCollide(function (d) { return d.radius + padding; })
      .strength(0))

    .on('tick', layoutTick)
    .nodes(nodes);

  var node = g.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .style('fill', function (d) { return color(d.cluster); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

  function dragstarted (d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged (d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended (d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // ramp up collision strength to provide smooth transition
  var transitionTime = 3000;
  var t = d3.timer(function (elapsed) {
    var dt = elapsed / transitionTime;
    simulation.force('collide').strength(Math.pow(dt, 2) * .75);
    if (dt >= 1.0) t.stop();
  });

  function layoutTick (e) {
    node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', function (d) { return d.radius; });
  }

}
