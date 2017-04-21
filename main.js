const maxValue = 30;
const count = { 'countMin': 10, 'countMax': 20 };

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

const myConfig = {

  // id of the chart HTML element
  id: 'chart',

  //config size
  size: {
    width: 500,
    height: 300,
    barPadding: 1,
    padding: 45 },

  //bar color
  color: 'orange',

  //quadrant
  quadrant: 1,

  //placement vertical or horizontal; default value  'vertucal'
  type: 'vertucal'

};


const configModel = new BarConfigModel(myConfig);
const chart = new BarView({model: configModel});


const data = getData(maxValue, count);
chart.setData(data);


setInterval(() => { chart.setData(getData(maxValue, count)) }, 2000);
