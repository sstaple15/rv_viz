function rvChart2(data, axisName, title, plot) {

  var svg = d3.select(plot),
  margin = {top: 50, right: 25, bottom: 50, left: 75},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.2);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(data.map(function (d) {
      return d.group;
    }));
  y.domain([0, d3.max(data, function (d) {
        return Number(d.count);
      })]);

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

  // gridlines in y axis function
  function make_y_gridlines() {
      return d3.axisLeft(y)
          .ticks(6)
  }

  // add the y gridlines
  g.append("g")
    .attr("class", "grid")
    .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
    )

  g.selectAll(".bar4")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar4")
  .attr("x", function (d) {
    return x(d.group);
  })
  .attr("y", function (d) {
    return y(Number(d.count));
  })
  .attr("width", x.bandwidth())
  .attr("height", function (d) {
    return height - y(Number(d.count));
  })
  .attr("fill", function(d) {
    if (d.group == "K-1") {
      return "#447d9c";
    }
    return "#606060";
  });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
      return "Annual: " + d3.format(",")(d.count);
    });

  svg.call(tip);

  d3.selectAll('.bar4')
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
    .on("click", function() { window.open("https://rapidvisa.com/k1-visa-report/");
    })
    .html("Source: US Citizenship and Immigration Services &copy; RapidVisa")
};
