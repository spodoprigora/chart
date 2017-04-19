const maxValue = 30;
const count = { 'countMin': 10, 'countMax': 20 };
const size = {
  width: 500,
  height: 300,
  barPadding: 1,
  padding: 45 };

function getData (maxVal, range) {
  const data = [];
  let time = 0;
  const number = _.random(range.countMin, range.countMax);
  for (let i = 0; i < number; i++) {
    const value = _.random(0, maxVal);
    time += 100;
    data.push({ time, value });
  }
  return data;
}

function updateChart () {
  const dataset = getData(maxValue, count);
  chart(dataset, 'first', size, 'grey', 1);
  chart(dataset, 'second', size, 'green', 2);
  chart(dataset, 'three', size, 'blue', 3);
  chart(dataset, 'four', size, 'brown', 4);
}

setInterval(updateChart, 2000);
// setTimeout(updateChart, 1000);


const dataset = getData(maxValue, count);

chart(dataset, 'first', size, 'grey', 1);

chart(dataset, 'second', size, 'green', 2);

chart(dataset, 'three', size, 'blue', 3);

chart(dataset, 'four', size, 'brown', 4);
