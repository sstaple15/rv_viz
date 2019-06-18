function testChor3(data, us, title) {

  var lowColor = '#FFFFF0';
  var highColor = "#447d9c";

  var svg = d3.select("#choro3"),
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
    .on("click", function() { window.open("https://rapidvisa.com/k1-visa-report/");
    })
    .html("Source: US Citizenship and Immigration Services &copy; RapidVisa")

  var featureCollection = topojson.feature(us, us.objects.countries);

  var projection = d3.geoMercator()
  .fitExtent([[0,0],[width, 635]], featureCollection)

  var path = d3.geoPath().projection(projection)

	var dataArray = [];
	for (var d = 0; d < data.length; d++) {
		dataArray.push(parseFloat(data[d].value))
	}
	var minVal = d3.min(dataArray)
	var maxVal = d3.max(dataArray)
	var ramp = d3.scaleLinear()
    .domain([minVal,2000])
    .range([lowColor,highColor])

  // Loop through each state data value in the .csv file
  for (var i = 0; i < data.length; i++) {

    // Grab State Name
    var dataState = data[i].id;
    var dataName = data[i].name;

    // Grab data value
    var dataValue = data[i].value;

    // Find the corresponding state inside the GeoJSON
    for (var j = 0; j < featureCollection.features.length; j++) {

      var jsonState = featureCollection.features[j].id;

      if (jsonState == -99) {
        featureCollection.features[j].value = 0;
      }

      else if (dataState == jsonState) {

        // Copy the data value into the JSON
        featureCollection.features[j].value = dataValue;
        featureCollection.features[j].name = dataName;

        // Stop looking through the JSON
        break;
      }
    }
  };

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-5, 0])
    .html(function(d) {
      return "Country: " + d.name + "<br/>Admits: " + d3.format(",")(d.value);
    });

  svg.call(tip);

  g.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(featureCollection.features)
    .enter().append("path")
    .attr("d", path)
    .style("stroke", "#fff")
    .style("stroke-width", "1")
    .style("fill", function(d) { return ramp(d.value) })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  var w = 140, h = 250;

  var key = d3.select("#choro3")
    .append("g")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate(" + margin.left/3 + ",0)")
    .attr("class", "legend");

  var legend = key.append("defs")
    .append("g:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  legend.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", highColor)
    .attr("stop-opacity", 1);

  legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", lowColor)
    .attr("stop-opacity", 1);

  key.append("rect")
    .attr("width", w - 110)
    .attr("height", h)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(20,100)");

  var y = d3.scaleLinear()
    .range([h, 0])
    .domain([minVal, 5500]);

  var yAxis = d3.axisRight(y)
    .ticks(6);

  key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(50,100)")
    .call(yAxis)
    .append("text")
      .attr("fill", "#606060")
      .attr("y", -15)
      .attr("x", -30)
      .attr("dy", "0.71em")
      .attr("text-anchor", "begin")
      .text("Total Admits");

}
