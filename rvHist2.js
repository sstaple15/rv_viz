function rvHist2(data, axisName, title, plot, maxout) {

  var svg = d3.select(plot),
  margin = {top: 50, right: 25, bottom: 50, left: 75},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleLinear()
    .domain([1, maxout])
    .rangeRound([0, width]);

  var histogram = d3.histogram()
    .value(function (d) { return +d.income})
    .domain([1, maxout])
    .thresholds(x.ticks(50));

  var bins1 = histogram(data.filter( function (d) {
    return d.type === "sponsorAge"} ));
  var bins2 = histogram(data.filter( function (d) {
    return d.type === "alienAge"} ));

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);
  y.domain([0, d3.max(bins2, function (d) {
        return d.length; })
      ]);

  g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .append("text")
  .attr("fill", "#000")
  .attr("y", -15)
  .attr("x", 565)
  .attr("dy", "0.71em")
  .attr("text-anchor", "center")
  .text("Income ($USD)");

  g.append("g")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text(axisName);

  // gridlines in x axis function
  function make_x_gridlines() {
      return d3.axisBottom(x)
          .ticks(5)
  }

  // add the x gridlines
  g.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )


  // g.selectAll(".bar1")
  // .data(bins1)
  // .enter().append("rect")
  // .attr("class", "bar1")
  // .attr("x", 1)
  // .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
  // .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
  // .attr("height", function(d) { return height - y(d.length); })
  // .style("fill", "#38a25e")
  // .style("opacity", 0.7);

  g.selectAll(".bar2")
  .data(bins2)
  .enter().append("rect")
    .attr("class", "bar2")
    .attr("x", 1)
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    .attr("height", function(d) { return height - y(d.length); })
    .style("fill", "#447d9c")
    .style("opacity", 0.7)

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
      return "Frequency: " + d3.format(",")(d.length);
    });

  svg.call(tip);

  d3.selectAll('.bar2')
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);


  g.append("text")
    .attr("x", 0)
    .attr("y", 0-(margin.top/2))
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(title)

  g.append("text")
    .attr("x", width)
    .attr("y", height + margin.bottom/1.25)
    .attr("text-anchor", "end")
    .style("font-style", "italic")
    .text("Source: RapidVisa and USCIS")

};
