// time series data sample
const length = 20;
const data = [];
_.each(d3.range(length), i => {
  data.push({
    group: {
      x: 1475760930000 + 1000000 * i,
      a: i,
      b: _.random(0, length),
    }
  })
});

const config = {

  // id of the chart HTML element
  id: 'chart',

  // limit max height to provided value
  height: 400,

  // optional margin of the chart
  margin: {
    left: 0,
  },

  //quadrant
  quadrant: 1,
  //for horizontal
  padding:{
      top: 20,
      right:70,
      bottom: 80,
      left: 50
  },

  //for vertical
   /*padding:{
    top: 20,
    right:40,
    bottom: 40,
    left: 140
   },*/



  //placement vertical or horizontal; default value  'vertical'
  placement: 'horizontal',

  // x axis settings
  x: {
    // how to access values from the serie to plot x
    accessor: 'group.x',

    // use this as axis label
    label: 'Value',

    // use d3 scales: scaleTime by default
    //scale: 'scaleLinear',
  },

  // y axis settings
  y: {
    accessor: 'group.a',
    label: 'Label Group.A',

    // color to plot bars with
    //color: 'steelblue',
  }

};


const configModel = new BarConfigModel(config);
const chart = new BarView({model: configModel});

chart.setData(data);

setTimeout(() => {
  const slice = _.random(3, length)
  chart.setData(data.slice(0, slice))
}, 1000)


setTimeout(() => {
  config.y.accessor = 'group.b';
  chart.setConfig(config)
}, 2000);
