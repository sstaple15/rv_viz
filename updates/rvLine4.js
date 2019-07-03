function rvLine4(data, axisName, title, plot) {

  // adapted from https://codepen.io/zakariachowdhury/pen/JEmjwq
  var lineOpacity = "0.5";
  var lineOpacityHover = ".75";
  var otherLinesOpacityHover = "0.25";
  var lineStroke = "3px";
  var lineStrokeHover = "4px";
  var circleOpacity = "0.75";
  var circleOpacityOnLineHover = ".5";
  var circleRadius = 3;
  var circleRadiusHover = 6;

  var svg = d3.select(plot),
  margin = {top: 50, right: 25, bottom: 50, left: 75},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseDate = d3.timeParse("%m-%Y");
  data.forEach(function (d) {
    d.values.forEach(function (d) {
      d.date = parseDate(d.date);
      d.count = +d.count;
    });
  });

  var x = d3.scaleTime()
    .domain([parseDate("01-2013"),parseDate("03-2019")])
    .rangeRound([0, width])

  var y = d3.scaleLinear()
    .domain([0, 33000])
    .rangeRound([height, 0]);

  var color = d3.scaleOrdinal()
    .domain(["Approvals", "Denials", "Pending"])
    .range(["#447d9c", "#f81128", "#f18721"]);

  g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

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

  g.append('rect')
    .attr('x', 520)
    .attr('y', 0)
    .attr('width', 280)
    .attr('height', 400)
    .attr('stroke', 'none')
    .attr('fill', "#606060")
    .attr('opacity', 0.05);

    g.append("text")
      .attr("x", width-2.5*margin.left)
      .attr("y", 15)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text('Trump Presidency')


  // add the X gridlines
  g.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(make_x_gridlines()
        .tickSize(-height)
        .tickFormat("")
    )

  // NOTENOTENOTE DELETE EVERYTHING BETWEEN THIS...
  g.append("line")
    .attr("x1", 0)
    .attr("y1", 279.5)
    .attr("x2", width)
    .attr("y2", 279.5)
    .attr("stroke-width", 2)
    .attr("stroke", "#447d9c")
    .attr("opacity", 0.30)

  g.append("text")
    .attr("x", width/2-70)
    .attr("y", height/2+margin.top+margin.bottom-5)
    .attr("text-anchor", "begin")
    .style("font-weight", "bold")
    .attr("dy", "0em")
    .text("Sponsor Median")
  // ...AND THIS NOTENOTENOTE


  var line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.count));

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
      return "Quarterly Total: " + d3.format(",")(d.count);
    });

  svg.call(tip);

  let lines = g.append("g")
    .attr("class", "lines")

  lines.selectAll(".line-group")
  .data(data)
  .enter().append("g")
  .attr("class", "line-group")
  .append("path")
  .attr("class", "line")
  .attr("d", d => line(d.values))
  .style("stroke", (d, i) => color(i))
  .style("opacity", lineOpacity)
  .on("mouseover", function (d) {
    d3.selectAll(".line")
      .style("opacity", otherLinesOpacityHover);
    d3.selectAll(".circle")
      .style("opacity", circleOpacityOnLineHover);
    d3.select(this)
      .style("opacity", lineOpacityHover)
      .style("stroke-width", lineStrokeHover);
  })
  .on("mouseout", function(d) {
      d3.selectAll(".line")
					.style('opacity', lineOpacity);
      d3.selectAll('.circle')
					.style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
    });

  lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", (d, i) => color(i))
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide)
  .append("circle")
  .attr("cx", d => x(d.date))
  .attr("cy", d => y(d.count))
  .attr("r", circleRadius)
  .style('opacity', circleOpacity)
  .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", circleRadiusHover);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", circleRadius);
      });

  // add a title, subtitle, and data source
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
    .on("click", function() { window.open("https://rapidvisa.com/k1-visa-report/");
    })
    .html("Source: US Citizenship and Immigration Services &copy; RapidVisa")


  g.selectAll("myLegend")
    .data(data)
    .enter()
    .append("g")
    .append("text")
      .attr("x", width-2*margin.right-50)
      .attr("y", function (d, i) { return 120 + i*30})
      .text(function(d) { return d.group; })
      .style("font-size", "14px")
      .attr("alignment-baseline", "middle");

  g.selectAll("myLegend")
    .data(data)
    .enter()
    .append("g")
    .append("circle")
      .attr("cx", width-2*margin.right-65)
      .attr("cy", function (d, i) { return 120 + i*30})
      .attr("r", 6)
      .style("fill", function(d) { return color(d.group) })
      .on("mouseover", function(d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 10);
            d3.selectAll(".line")
              .style("opacity", otherLinesOpacityHover);
            d3.selectAll(".circle")
              .style("opacity", circleOpacityOnLineHover)
        })
      .on("mouseout", function(d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 6);
            d3.selectAll(".line")
                .style('opacity', lineOpacity);
            d3.selectAll('.circle')
                .style('opacity', circleOpacity);
            d3.select(this)
              .style("stroke-width", lineStroke)
              .style("cursor", "none")
        });

};