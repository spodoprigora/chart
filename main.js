var dataset = [];
var maxValue = 30;
var count = {"countMin": 10, "countMax": 20};
var size = {
  width: 500,
  height: 300,
  barPadding: 1,
  padding: 45
};

function getData(maxValue, count) {
  var dataset = [];
  var time = 0;
  var count = _.random(count.countMin, count.countMax);
  for (var i = 0; i < count; i++) {
    var value = _.random(0, maxValue);
    time += 100;
    dataset.push({time, value});
  }
  return dataset;
  //return [{time: 100, value: 1}, {time: 200, value: 2}, {time: 300, value: 3}, {time: 400, value: 4}, {time: 500, value: 5}]
}

function updateChart(){
  //var dataset = [{time: 100, value: 1}, {time: 200, value: 2}, {time: 300, value: 3}, {time: 400, value: 4}]
  var dataset = getData(maxValue, count);
  chart(dataset, "first", size, "grey", 1);
  chart(dataset, "second", size, "green",  2);
  chart(dataset, "three", size, "blue", 3, "horizontal");
  chart(dataset, "four", size, "brown",  4, "horizontal");
}

setInterval(updateChart, 2000);
//setTimeout(updateChart, 1000);


dataset = getData(maxValue, count);

chart(dataset, "first", size, "grey", 1);

chart(dataset, "second", size, "green", 2);

chart(dataset, "three", size, "blue", 3, "horizontal");

chart(dataset, "four", size, "brown", 4, "horizontal");