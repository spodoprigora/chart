var dataset = [];
var time = 0;
var value = 0;
for (var i = 0; i < 10; i++) {
  //var value = _.random(0, 30);
  value +=5;
  time += 100;
  dataset.push({time, value});
}

//dataset[3].value = undefined
//dataset[5].value = dataset[4].value
//dataset[6].value = -1


var size = {
  width: 500,
  height: 300,
  barPadding: 1,
  padding: 40
}


chart(dataset, "first", size, "grey", 1);

chart(dataset, "second", size, "green", 2);

chart(dataset, "three", size, "blue", 3);

chart(dataset, "four", size, "brown", 4);

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
    return (size.width - size.padding *2)/(tempData.length - 1) - size.barPadding;
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

  var svg = d3.select("#" + elem)
    .append("svg")
    .attr("width", (size.width))
    .attr("height", size.height);

  var bar = svg.selectAll("g")
    .data(tempData)
    .enter()
    .append("g")
    .attr("class", "bar");

  bar.append("rect")
    .attr("x", conf.xPoint)
    .attr("y", conf.yPoint)
    .attr("width", barWidth)
    .attr("height", conf.barHeight)
    .attr("fill", color);


  bar.append("text")
    .text(dValue)
    .attr("x", textX)
    .attr("y", conf.textY);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + conf.xAxisTranslate() +")")
    .call(conf.xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+ conf.yAxisTranslate() +", 0)")
    .call(conf.yAxis);
}

function config(quadrant, barWidth){
  var barHeight;
  var textY;
  var xAxis;
  var yAxis;
  var xAxisTranslate;
  var yAxisTranslate;
  var xPoint;
  var yPoint;
  var xScale;
  var yScale;

  switch (quadrant) {
    case 1:
      barHeight = function (d) {
        return size.height - size.padding - yScale(d.value);
      };

      textY = function (d) {
        return yScale(d.value) + 13;
      };

      xPoint = function (d, i) {
        return xScale(d.time) - barWidth() + barWidth()/2;
      };
      yPoint = function(d){
        return yScale(d.value);
      };

      xAxis = d3.axisBottom();
      yAxis = d3.axisRight();

      xAxisTranslate = function(){
        return size.height - size.padding + 3;
      };
      yAxisTranslate = function(){
        return size.width - size.padding + 1 + barWidth()/2;
      }

      xScale = d3.scaleLinear().range([size.width - size.padding, size.padding]);
      yScale = d3.scaleLinear().range([size.height - size.padding,  size.padding]);
      break;
    case 2:
      barHeight = function (d) {
        return size.height - size.padding - yScale(d.value);
      };

      textY = function (d) {
        return yScale(d.value) + 13;
      };

      xPoint = function (d, i) {
        return xScale(d.time) - barWidth()/2;
      };
      yPoint = function(d){
        return yScale(d.value);
      };

      xScale = d3.scaleLinear().range([size.padding, size.width - size.padding]);
      yScale = d3.scaleLinear().range([size.height - size.padding,  size.padding]);

      xAxis = d3.axisBottom();
      yAxis = d3.axisLeft();

      xAxisTranslate = function(){
        return size.height - size.padding + 3;
      };
      yAxisTranslate = function(){
        return size.padding - 2  - barWidth()/2;;
      }
      break;
    case 3:
      barHeight = function (d) {
        return yScale(d.value) - size.padding;
      };

      textY = function (d) {
        return yScale(d.value) - 7;
      };

      xScale = d3.scaleLinear().range([size.width - size.padding, size.padding]);
      yScale = d3.scaleLinear().range([size.padding, size.height - size.padding]);

      xPoint = function (d, i) {
        return xScale(d.time) - barWidth() + barWidth()/2
      };
      yPoint = function(d){
        return size.padding;
      };

      xAxis = d3.axisTop();
      yAxis = d3.axisRight();

      xAxisTranslate = function(){
        return size.padding - 3;
      };
      yAxisTranslate = function(){
        return size.width - size.padding + 1  + barWidth()/2;
      }
      break;
    case 4:
      barHeight = function (d) {
        return yScale(d.value) - size.padding;
      };

      textY = function (d) {
        return yScale(d.value) - 7;
      };

      xScale = d3.scaleLinear().range([size.padding, size.width - size.padding]);
      yScale = d3.scaleLinear().range([size.padding, size.height - size.padding]);

      xPoint = function (d, i) {
        return xScale(d.time) - barWidth()/2;
      };
      yPoint = function(d){
        return size.padding;
      };

      xAxis = d3.axisTop();
      yAxis = d3.axisLeft();

      xAxisTranslate = function(){
        return size.padding - 3;
      };
      yAxisTranslate = function(){
        return size.padding - 2  - barWidth()/2;;
      }
      break;
  }

  return {
    "barHeight": barHeight,
    "textY": textY,
    "xAxis": xAxis,
    "yAxis": yAxis,
    "xAxisTranslate": xAxisTranslate,
    "yAxisTranslate": yAxisTranslate,
    "xPoint": xPoint,
    "yPoint": yPoint,
    "xScale": xScale,
    "yScale": yScale
  }
}