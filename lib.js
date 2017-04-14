var oldData = [];

function config(quadrant, size, type, data){
  var
    barHeight,
    barWidth,
    textY,
    xAxis,
    yAxis,
    xAxisTranslate,
    yAxisTranslate,
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    gTransform,
    gHidePositionEnter,
    gHidePositionExit,
    x,
    y,
    axisTextAngle,
    xAxisTextAnchor,
    yAxisTextDy,
    oldYScale;

  barWidth = ((size.width - size.padding *2)/(data.length)) - size.barPadding;

  if(type == "horizontal"){
    xScale.domain([d3.max(data, d => d.time), d3.min(data, d => d.time)]);
  }
  else{
    xScale.domain([d3.min(data, d => d.time), d3.max(data, d => d.time)]);
  }
  yScale.domain([0, d3.max(data, d => d.value)]);

  oldYScale = d3.scaleLinear().domain([0, d3.max(oldData, d => d.value)]);

  if(quadrant == 1){
    if(type == "horizontal"){
      axisTextAngle = -90;
      xAxisTextAnchor = "end";
      yAxis = d3.axisRight();
      yAxisTranslate = size.width - size.padding + 3 + barWidth/2;
      gHidePositionEnter = d => "translate("+ -size.padding + ", " + yScale(d.value) + ")";
      gHidePositionExit = d => "translate("+ -size.padding + ", " + oldYScale(d.value) + ")";
      yAxisTextDy = "1.5em";
    }
    else{
      axisTextAngle = 0;
      xAxisTextAnchor = "middle";
      yAxis = d3.axisLeft();
      yAxisTranslate = size.padding - 2  - barWidth/2;
      gHidePositionEnter = d => "translate("+ (size.width + size.padding) + ", " + yScale(d.value) + ")";
      gHidePositionExit = d => "translate("+ (size.width + size.padding) + ", " + oldYScale(d.value) + ")";
      yAxisTextDy = "0.4em";
    }
    barHeight = d => size.height - size.padding - yScale(d.value);
    textY = () => 13;
    xAxisTranslate = size.height - size.padding + 3;
    xAxis = d3.axisBottom();
    oldYScale.range([size.height - size.padding,  size.padding]);
    yScale.range([size.height - size.padding,  size.padding]);
    y = d => yScale(d.value);
    x = d => xScale(d.time) - barWidth/2;
    xScale.range([size.padding, size.width - size.padding]);
  }

  if(quadrant == 2){
    if(type == "horizontal"){
      axisTextAngle = 90;
      xAxisTextAnchor = "start";
      yAxis = d3.axisLeft();
      yAxisTranslate = size.padding - 3 - barWidth/2;
      gHidePositionExit = d => "translate("+ (size.width + size.padding) + ", " + oldYScale(d.value) + ")";
      gHidePositionEnter = d => "translate("+ (size.width + size.padding) + ", " + yScale(d.value) + ")";
      yAxisTextDy = "1.5em";
    }
    else{
      axisTextAngle = 0;
      xAxisTextAnchor = "middle";
      yAxis = d3.axisRight();
      yAxisTranslate = size.width - size.padding + 1 + barWidth/2;
      gHidePositionExit = d => "translate("+ -size.padding + ", " + oldYScale(d.value) + ")";
      gHidePositionEnter = d => "translate("+ -size.padding + ", " + yScale(d.value) + ")";
      yAxisTextDy = "0.4em";
    }
    barHeight = d => size.height - size.padding - yScale(d.value);
    textY = () => 13;
    xAxisTranslate = size.height - size.padding + 3;
    xAxis = d3.axisBottom();
    oldYScale.range([size.height - size.padding,  size.padding]);
    yScale.range([size.height - size.padding,  size.padding]);
    y = d => yScale(d.value);
    xScale.range([size.width - size.padding, size.padding]);
    x = d => xScale(d.time) - barWidth + barWidth/2;
  }

  if(quadrant == 3){
    if(type == "horizontal"){
      axisTextAngle = -90;
      xAxisTextAnchor = "start";
      yAxis = d3.axisLeft();
      yAxisTranslate = size.padding - barWidth/2 - 3;
      gHidePositionEnter = gHidePositionExit = d => "translate("+ (size.width + size.padding) + ", " + size.padding + ")";
      yAxisTextDy = "-1em";
    }
    else{
      axisTextAngle = 0;
      xAxisTextAnchor = "middle";
      yAxis = d3.axisRight();
      yAxisTranslate = size.width - size.padding + 1 + barWidth/2;
      gHidePositionEnter = gHidePositionExit = d => "translate("+ -size.padding + ", " + size.padding + ")";
      yAxisTextDy = "0.4em";
    }
    barHeight = d => yScale(d.value) - size.padding;
    textY = d => yScale(d.value) - size.padding - 13;
    xAxisTranslate = size.padding - 3;
    xAxis = d3.axisTop();
    oldYScale.range([size.padding, size.height - size.padding]);
    yScale.range([size.padding, size.height - size.padding]);
    y = d => size.padding;
    xScale.range([size.width - size.padding, size.padding]);
    x = d => xScale(d.time) - barWidth + barWidth/2;
  }

  if(quadrant == 4){
    if(type == "horizontal"){
      axisTextAngle = 90;
      yAxis = d3.axisRight();
      yAxisTranslate = size.width - size.padding + 3 + barWidth/2;
      xAxisTextAnchor = "end";
      gHidePositionEnter = gHidePositionExit = d => "translate("+ -size.padding + ", " + size.padding + ")";
      yAxisTextDy = "-1em";
    }
    else{
      axisTextAngle = 0;
      xAxisTextAnchor = "middle";
      yAxisTranslate = size.padding - 2  - barWidth/2;
      yAxis = d3.axisLeft();
      gHidePositionEnter = gHidePositionExit = d => "translate("+ (size.width + size.padding) + ", " + size.padding + ")";
      yAxisTextDy = "0.4em";
    }
    barHeight = d => yScale(d.value) - size.padding;
    textY = d => yScale(d.value) - size.padding - 13;
    xAxisTranslate = size.padding - 3;
    xAxis = d3.axisTop();
    oldYScale.range([size.padding, size.height - size.padding]);
    yScale.range([size.padding, size.height - size.padding]);
    y = d => size.padding;
    x = d => xScale(d.time) - barWidth/2;
    xScale.range([size.padding, size.width - size.padding]);
  }

  gTransform = d => "translate(" + x(d) + ", " + y(d) + ")";

  return {
    "barHeight": barHeight,
    "textY": textY,
    "xAxis": xAxis,
    "yAxis": yAxis,
    "xAxisTranslate": xAxisTranslate,
    "yAxisTranslate": yAxisTranslate,
    "xScale": xScale,
    "yScale": yScale,
    "gTransform": gTransform,
    "gHidePositionEnter": gHidePositionEnter,
    "gHidePositionExit": gHidePositionExit,
    "axisTextAngle": axisTextAngle,
    "xAxisTextAnchor": xAxisTextAnchor,
    "yAxisTextDy": yAxisTextDy,
    "barWidth": barWidth,
  }
}

function prepareData(data){
  var tempData = [];
  _.forEach(data, function (v, key) {
    if (v.value < 0 || v.value === undefined) {
      v.value = 0;
      tempData.push(v);
    }
    else {
      tempData.push(v);
    }
  });
  return tempData;
};

function chart(data, elem, size, color, quadrant, type="vertical") {

  data = prepareData(data);

  var chartConfig = config(quadrant, size, type, data);

  var container = d3.select('#' + elem);
  var svg = container.select("svg");
  var wrapper;

  if(svg.empty()){
    svg = container
      .append("svg");

    if(type == "horizontal"){
      svg.attr("width", size.height)
        .attr("height", size.width);
    }
    else{
      svg.attr("width", size.width)
        .attr("height", size.height);
    }

    wrapper = svg.append("g")
      .attr("class", "wrapper");
  }
  else{
    wrapper = svg.select(".wrapper");
  }

  container.attr("class", "block" +" "+ type);

  //rotate wrapper
  if(type == "horizontal"){
    if(quadrant == 1 || quadrant == 3){
      wrapper.attr("transform", "translate(" + size.height + ", 0) rotate(90)");
    }
    else{
      wrapper.attr("transform", "translate(0, " + size.width + ") rotate(-90)");
    }
  }

  chartConfig.xAxis.scale(chartConfig.xScale).ticks(10);
  chartConfig.yAxis.scale(chartConfig.yScale).ticks(3);

  if(wrapper.select("g.x.axis").empty()){
    wrapper.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + chartConfig.xAxisTranslate +")")
      .call(chartConfig.xAxis)
        .selectAll("text")
        .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
        .style("text-anchor", chartConfig.xAxisTextAnchor);
  }
  else{
    wrapper.select(".x.axis")
      .transition()
      .duration(1000)
      .call(chartConfig.xAxis)
        .selectAll("text")
        .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
        .style("text-anchor", chartConfig.xAxisTextAnchor);

  }

  if(wrapper.select("g.y.axis").empty()){
    wrapper.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ chartConfig.yAxisTranslate +", 0)")
      .call(chartConfig.yAxis)
        .selectAll("text")
        .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
        .attr("dy", chartConfig.yAxisTextDy)
        .style("text-anchor", "middle")

  }
  else{
    wrapper.select(".y.axis")
      .transition()
      .duration(1000)
      .call(chartConfig.yAxis)
      .attr("transform", "translate("+ chartConfig.yAxisTranslate +", 0)")
        .selectAll("text")
        .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
        .style("text-anchor", "middle")
        .attr("dy", chartConfig.yAxisTextDy);
  }

  var bar = wrapper.selectAll("g.bar")
    .data(data);

//Enter
  if(wrapper.select("rect").empty()){
    var g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", chartConfig.gTransform);

    g.append("rect")
      .attr("width", chartConfig.barWidth)
      .attr("height", chartConfig.barHeight)
      .attr("fill", color);

    g.append("text")
      .text(d => d.value)
      .attr("x", chartConfig.barWidth/2)
      .attr("y", chartConfig.textY)
      .attr("text-anchor", "middle");
  }
  else{

    var g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", chartConfig.gHidePositionEnter);

    g.append("rect")
      .attr("width", chartConfig.barWidth)
      .attr("height", chartConfig.barHeight)
      .attr("fill", color);

    g.append("text")
      .text(d => d.value)
      .attr("x", chartConfig.barWidth/2)
      .attr("y", chartConfig.textY)
      .attr("text-anchor", "middle");

    g.transition()
      .delay( (d, i) => i / dataset.length * 1000 )
      .duration(1000)
      .attr("transform", chartConfig.gTransform);
  }

  //Update
  bar.transition()
    .delay( (d, i) => i / dataset.length * 1000 )
    .duration(1000)
    .attr("transform", chartConfig.gTransform);

  bar.select("rect")
    .transition()
    .delay( (d, i) => i / dataset.length * 1000 )
    .duration(1000)
    .attr("width", chartConfig.barWidth)
    .attr("height", chartConfig.barHeight);

  bar.select("text")
    .transition()
    .delay( (d, i) => i / dataset.length * 1000)
    .duration(1000)
    .text(d => d.value)
    .attr("y", chartConfig.textY)
    .attr("x", chartConfig.barWidth/2);

  //Exit
  bar.exit()
    .transition()
    .delay( (d, i) => i / dataset.length * 500)
    .duration(1000)
    .attr("transform", chartConfig.gHidePositionExit)
    .remove();

  oldData = data;
}