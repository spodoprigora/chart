var oldData = [];

function config(quadrant, barWidth){
  var barHeight,
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
    y;
  var oldYScale = d3.scaleLinear().domain([0, d3.max(oldData, function(d){
    return d.value;
  })]);

  if(quadrant == 1 || quadrant == 2 ){
    barHeight = function(d){
      return size.height - size.padding - yScale(d.value);
    };
    textY = function (d) {
      return 13;
    };
    xAxisTranslate = function(){
      return size.height - size.padding + 3;
    };
    xAxis = d3.axisBottom();
    oldYScale.range([size.height - size.padding,  size.padding]);
    yScale.range([size.height - size.padding,  size.padding]);
    y = function(d){
      return yScale(d.value);
    };
  }
  else{
    barHeight = function(d){
      return yScale(d.value) - size.padding;
    };
    textY = function (d) {
      return yScale(d.value) - size.padding - 13 ;
    };
    xAxisTranslate = function(){
      return size.padding - 3;
    };
    xAxis = d3.axisTop();
    oldYScale.range([size.padding, size.height - size.padding]);
    yScale.range([size.padding, size.height - size.padding]);
    y = function(d){
      return size.padding;
    };
  }

  if(quadrant == 1 || quadrant == 3){
    yAxisTranslate = function(){
      return size.width - size.padding + 1 + barWidth()/2;
    };
    yAxis = d3.axisRight();
    xScale.range([size.width - size.padding, size.padding]);
    x = function(d){
      return xScale(d.time) - barWidth() + barWidth()/2;
    };
  }else{
    yAxisTranslate = function(){
      return size.padding - 2  - barWidth()/2;
    };
    yAxis = d3.axisLeft();
    xScale.range([size.padding, size.width - size.padding]);
    x = function(d){
      return xScale(d.time) - barWidth()/2;
    };
  }

  gTransform = function(d){
    return "translate(" + x(d) + ", " + y(d) + ")";
  };

  if(quadrant == 1){
    gHidePositionExit = function(d, i){
      return "translate("+ -size.padding + ", " + oldYScale(d.value) + ")"
    };
    gHidePositionEnter = function(d, i){
      return "translate("+ -size.padding + ", " + yScale(d.value) + ")"
    };
  }
  if(quadrant == 2){
    gHidePositionExit = function(d, i){
      return "translate("+ (size.width + size.padding) + ", " + oldYScale(d.value) + ")"
    };
    gHidePositionEnter = function(d, i){
      return "translate("+ (size.width + size.padding) + ", " + yScale(d.value) + ")"
    };
  }
  if(quadrant == 3){
    gHidePositionEnter = gHidePositionExit = function(d, i){
      return "translate("+ -size.padding + ", " + size.padding + ")"
    };
  }

  if(quadrant == 4){
    gHidePositionEnter = gHidePositionExit = function(d, i){
      return "translate("+ (size.width + size.padding) + ", " + size.padding + ")"
    };
  }

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
  }
}

function chart(data, elem, size, color, quadrant) {

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

  var barWidth = function(){
    return ((size.width - size.padding *2)/(tempData.length)) - size.barPadding;
  }

  var conf = config(quadrant, barWidth);

  var dValue = function(d){
    return d.value;
  };
  var dTime = function(d){
    return d.time;
  };
  var textX = function (d, i) {
    return conf.xScale(d.time);
  };

  conf.yScale.domain([0, d3.max(tempData, dValue)]);
  conf.xScale.domain([d3.min(tempData, dTime), d3.max(tempData, dTime)]);

  conf.xAxis.scale(conf.xScale).ticks(10);
  conf.yAxis.scale(conf.yScale).ticks(3);

  var container = d3.select('#' + elem);
  var svg = container.select("svg");
    if(svg.empty()){
      svg = container
        .append("svg")
        .attr("width", (size.width))
        .attr("height", size.height);
    }else{
      svg = container.select("svg");
    }


  if(svg.select("g.x.axis").empty()){
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + conf.xAxisTranslate() +")")
      .call(conf.xAxis);
  }
  else{
    svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(conf.xAxis);
  }

  if(svg.select("g.y.axis").empty()){
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ conf.yAxisTranslate() +", 0)")
      .call(conf.yAxis);
  }
  else{
    svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(conf.yAxis);
  }

  var bar = svg.selectAll("g.bar")
    .data(tempData);

//Enter
  if(svg.select("rect").empty()){
    var g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", conf.gTransform);

    g.append("rect")
      .attr("width", barWidth)
      .attr("height", conf.barHeight)
      .attr("fill", color);

    g.append("text")
      .text(dValue)
      .attr("x", barWidth()/2)
      .attr("y", conf.textY)
      .attr("text-anchor", "middle");
  }
  else{

    var g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", conf.gHidePositionEnter);

    g.append("rect")
      .attr("width", barWidth)
      .attr("height", conf.barHeight)
      .attr("fill", color);

    g.append("text")
      .text(dValue)
      .attr("x", function(){
        console.log(barWidth()/2);
        return barWidth()/2;
      } )
      .attr("y", conf.textY)
      .attr("text-anchor", "middle");

    g.transition()
      .delay(function (d, i) {
        return i / dataset.length * 1000;
      })
      .duration(1000)
      .attr("transform", conf.gTransform);

  }

  //Update
  bar.transition()
    .delay(function (d, i) {
      return i / dataset.length * 1000;
    })
    .duration(1000)
    .attr("transform", conf.gTransform);

  bar.select("rect")
    .transition()
    .delay(function (d, i) {
      return i / dataset.length * 1000;
    })
    .duration(1000)
    .attr("width", barWidth)
    .attr("height", conf.barHeight);

  bar.select("text")
    .transition()
    .delay(function (d, i) {
      return i / dataset.length * 1000;
    })
    .duration(1000)
    .text(dValue)
    .attr("y", conf.textY)
    .attr("x", barWidth()/2);

  //Exit
  bar.exit()
    .transition()
    .delay(function (d, i) {
      return i / dataset.length * 500;
    })
    .duration(1000)
    .attr("transform", conf.gHidePositionExit)
    .remove();

  oldData = tempData;
}