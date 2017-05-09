/*// time series data sample
const length = 20;
const data = [];
_.each(d3.range(length), (i) => {
  data.push({
    group: {
      x: 1475760930000 + (1000000 * i),
      a: ++i,
      b: _.random(0, length),
    },
  })
});*/

const maxValue = 30;
const count = { 'countMin': 3, 'countMax': 20 };

function getData (maxVal, range) {
  let length =_.random(range.countMin, range.countMax);
  const data = [];

  _.each(d3.range(length), i => {
    data.push({
      group: {
        x: 1475760930000 + 1000000 * i,
        a: ++i,
        b: _.random(0, maxVal),
      }
    });
  });


  return data;
}
const data = getData(maxValue, count);

let command  = new Command();

const config = {

  // id of the chart HTML element
  id: 'chart',

  // limit max height to provided value
  height: 400,

  // optional margin of the chart
  margin: {
    left: 0,
  },

  // quadrant
  quadrant: 4,

  // for horizontal
  padding: {
    right: 70,
    top: 80,
    bottom: 20,
    left: 50,
  },

  // for vertical
   /* padding:{
    top: 20,
    right:40,
    bottom: 40,
    left: 140
   },*/

  // placement vertical or horizontal; default value  'vertical'
  placement: 'horizontal',

  // x axis settings
  x: {
    // how to access values from the serie to plot x
    accessor: 'group.x',

    // use this as axis label
    label: 'Value',

    // use d3 scales: scaleTime by default
    // scale: 'scaleLinear',
  },

  // y axis settings
  y: {
    accessor: 'group.a',
    label: 'Label Group.A',

    // color to plot bars with
    // color: 'steelblue',
  },
};

const configModel = new BarConfigModel(config);
const chart = new BarView({ model: configModel });

chart.setData(data);

const configNavigator = {

  //placement vertical or horizontal; default value  'vertical'
  //placement: 'horizontal',

  // x axis settings
  x: {
    // how to access values from the serie to plot x
    accessor: 'group.x',
    //scale: 'scaleLinear',
  },
};

const configNavigatorModel = new NavigationConfigModel(configNavigator);
const navigator = new NavigationView({model: configNavigatorModel});
navigator.setData(data);

command.subscribe('refresh', chart);
//command.subscribe('reset', navigator);


/*
setInterval(() => {
  let data = getData(maxValue, count);
  chart.setData(data);
  navigator.setData(data);
  //const slice = _.random(3, length);
  //chart.setData(data.slice(0, slice));

}, 2000);
*/

/*
setTimeout(() => {
  config.y.accessor = 'group.b';
  config.quadrant = 4;
  config.placement = 'vertical';
  config.padding = {
    top: 50,
    right: 40,
    bottom: 40,
    left: 140,
  };
  chart.setConfig(config);
}, 2000);*/
