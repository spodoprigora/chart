let oldData = [];

function axisTextConfig (quadrant, type) {
  let axisTextAngle;
  let xAxisTextAnchor;
  let yAxisTextDy;

  if (type === 'horizontal') {
    switch (quadrant) {
    case 1:
      axisTextAngle = -90;
      xAxisTextAnchor = 'end';
      yAxisTextDy = '1.5em';
      break;
    case 2:
      axisTextAngle = 90;
      xAxisTextAnchor = 'start';
      yAxisTextDy = '1.5em';
      break;
    case 3:
      axisTextAngle = -90;
      xAxisTextAnchor = 'start';
      yAxisTextDy = '-1em';
      break;
    case 4:
      axisTextAngle = 90;
      xAxisTextAnchor = 'end';
      yAxisTextDy = '-1em';
      break;
    default :
      axisTextAngle = -90;
      xAxisTextAnchor = 'end';
      yAxisTextDy = '1.5em';
    }
  } else {
    axisTextAngle = 0;
    xAxisTextAnchor = 'middle';
    yAxisTextDy = '0.4em';
  }

  return {
    axisTextAngle,
    xAxisTextAnchor,
    yAxisTextDy }
}

function yAxisConfig(quadrant, type, barWidth){
  var yAxis, yAxisTranslate;

  if(type == "horizontal"){
    if(quadrant == 1 ||  quadrant == 4){
      yAxis = d3.axisRight();
      yAxisTranslate = size.width - size.padding + 3 + barWidth/2;
    }
    else{
      yAxis = d3.axisLeft();
      yAxisTranslate = size.padding - 3 - barWidth/2;
    }
  }
  else{
    if(quadrant == 1 || quadrant == 4){
      yAxis = d3.axisLeft();
      yAxisTranslate = size.padding - 3  - barWidth/2;
    }
    else{
      yAxis = d3.axisRight();
      yAxisTranslate = size.width - size.padding + 3 + barWidth/2;
    }
  }
  return {
    "yAxis": yAxis,
    "yAxisTranslate": yAxisTranslate
  }
}

function gHidePositionConfig(quadrant, type, size, yScale, oldYScale){
  var gHidePositionEnter, gHidePositionExit;
  var enterX, enterY, exitX, exitY;

  if(quadrant == 1 || quadrant == 2 ){
    enterY = d => yScale(d.value);
    exitY = d => oldYScale(d.value);
  }
  else{
    enterY = exitY = () => size.padding;
  }

  if(type == "horizontal"){
    if(quadrant == 1 || quadrant == 4){
      enterX = exitX = -size.padding;
    }
    else{
      enterX = exitX =  size.width + size.padding;
    }
  }
  else{
    if(quadrant == 1 || quadrant == 4){
      enterX = exitX = size.width + size.padding;
    }
    else{
      enterX = exitX = -size.padding;
    }
  }

  gHidePositionEnter = d => "translate("+ enterX + ", " + enterY(d) + ")";
  gHidePositionExit = d => "translate("+ exitX + ", " + exitY(d) + ")";

  return {
    gHidePositionEnter,
    gHidePositionExit
  }
}

function titleTextTransformConfig(quadrant, type, barWidth, textY){
  var titleTextTransform;

  if(type == "horizontal"){
    if(quadrant == 1 || quadrant == 3){
      titleTextTransform = (d) => "rotate(-90 " + ((barWidth/2) + 3) +" " + textY(d) + ")";
    }
    else{
      titleTextTransform = (d) => "rotate(90 " + ((barWidth/2) - 3) +" " + textY(d) + ")";
    }
  }
  else{
    titleTextTransform = (d) => "rotate(0)";
  }

  return {
    titleTextTransform
  };
}

function config(quadrant, size, type, data){
  var
    barHeight,
    barWidth,
    textY,
    xAxis,
    xAxisTranslate,
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    oldYScale = d3.scaleLinear(),
    gTransform,
    x,
    y;

  barWidth = ((size.width - size.padding *2)/(data.length)) - size.barPadding;

  if(type == "horizontal"){
    xScale.domain([d3.max(data, d => d.time), d3.min(data, d => d.time)]);
  }
  else{
    xScale.domain([d3.min(data, d => d.time), d3.max(data, d => d.time)]);
  }

  yScale.domain([0, d3.max(data, d => d.value)]);

  oldYScale.domain([0, d3.max(oldData, d => d.value)]);

  if(quadrant == 1 || quadrant == 2){
    barHeight = d => size.height - size.padding - yScale(d.value);
    textY = () => 13;
    xAxisTranslate = size.height - size.padding + 3;
    xAxis = d3.axisBottom();
    oldYScale.range([size.height - size.padding,  size.padding]);
    yScale.range([size.height - size.padding,  size.padding]);
    y = d => yScale(d.value);
  }
  else{
    barHeight = d => yScale(d.value) - size.padding;
    textY = d => yScale(d.value) - size.padding - 13;
    xAxisTranslate = size.padding - 3;
    xAxis = d3.axisTop();
    oldYScale.range([size.padding, size.height - size.padding]);
    yScale.range([size.padding, size.height - size.padding]);
    y = d => size.padding;
  }

  if(quadrant == 1 || quadrant == 4){
    x = d => xScale(d.time) - barWidth/2;
    xScale.range([size.padding, size.width - size.padding]);
  }
  else{
    x = d => xScale(d.time) - barWidth + barWidth/2;
    xScale.range([size.width - size.padding, size.padding]);
  }

  var {axisTextAngle,xAxisTextAnchor, yAxisTextDy} = axisTextConfig(quadrant, type);
  var {yAxis, yAxisTranslate} = yAxisConfig(quadrant, type, barWidth);
  var {gHidePositionEnter, gHidePositionExit} = gHidePositionConfig(quadrant, type, size, yScale, oldYScale);
  var {titleTextTransform} = titleTextTransformConfig(quadrant, type, barWidth, textY);

  gTransform = d => "translate(" + x(d) + ", " + y(d) + ")";

  return {
    barHeight,
    textY,
    xAxis,
    yAxis,
    xAxisTranslate,
    yAxisTranslate,
    xScale,
    yScale,
    gTransform,
    gHidePositionEnter,
    gHidePositionExit,
    axisTextAngle,
    xAxisTextAnchor,
    yAxisTextDy,
     barWidth,
    titleTextTransform
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

function updateRenderChart(svg, chartConfig, data, color){
  var wrapper = svg.select(".wrapper");

  var bar = wrapper.selectAll("g.bar")
    .data(data);

  wrapper.select(".x.axis")
    .transition()
    .duration(1000)
    .call(chartConfig.xAxis)
    .selectAll("text")
    .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
    .style("text-anchor", chartConfig.xAxisTextAnchor);

  wrapper.select(".y.axis")
    .transition()
    .duration(1000)
    .call(chartConfig.yAxis)
    .attr("transform", "translate("+ chartConfig.yAxisTranslate +", 0)")
    .selectAll("text")
    .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
    .style("text-anchor", "middle")
    .attr("dy", chartConfig.yAxisTextDy);

  //Enter
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
    .attr("text-anchor", "middle")
    .attr("transform", chartConfig.titleTextTransform);

  g.transition()
    .delay( (d, i) => i / dataset.length * 1000 )
    .duration(1000)
    .attr("transform", chartConfig.gTransform);

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
    .attr("x", chartConfig.barWidth/2)
    .attr("transform", chartConfig.titleTextTransform);

  //Exit
  bar.exit()
    .transition()
    .delay( (d, i) => i / dataset.length * 500)
    .duration(1000)
    .attr("transform", chartConfig.gHidePositionExit)
    .remove();


}

function chart(data, elem, size, color, quadrant, type="vertical") {

  data = prepareData(data);

  var chartConfig = config(quadrant, size, type, data);

  var container = d3.select('#' + elem);
  var svg = container.select("svg");
  var wrapper;

  chartConfig.xAxis.scale(chartConfig.xScale).ticks(10);
  chartConfig.yAxis.scale(chartConfig.yScale).ticks(3);

  if(svg.empty()){
    svg = container.append("svg");
  }
  else{
    updateRenderChart(svg, chartConfig, data, color);
    return false;
  }

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

  wrapper.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + chartConfig.xAxisTranslate +")")
    .call(chartConfig.xAxis)
      .selectAll("text")
      .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
      .style("text-anchor", chartConfig.xAxisTextAnchor);

  wrapper.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ chartConfig.yAxisTranslate +", 0)")
    .call(chartConfig.yAxis)
      .selectAll("text")
      .attr("transform", "rotate(" + chartConfig.axisTextAngle + ")")
      .attr("dy", chartConfig.yAxisTextDy)
      .style("text-anchor", "middle");

  var bar = wrapper.selectAll("g.bar")
    .data(data);

  //Enter
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
    .attr("text-anchor", "middle")
    .attr("transform", chartConfig.titleTextTransform);

  oldData = data;
}