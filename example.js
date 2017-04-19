mport BarView from './BarView'
import BarConfigModel from './BarConfigModel'

// time series data sample
const length = 20
const data = []
_.each(d3.range(length), i => {
  data.push({
    group: {
      x: 1475760930000 + 1000000 * i,
      a: i,
      b: _.random(0, length),
    }
  })
})

let chart
const config = {

  // id of the chart HTML element
  id: 'chart',

  // limit max height to provided value
  height: 200,

  // optional margin of the chart
  margin: {
    left: 10,
  },

  quadrant: 3,

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
  y: {
    accessor: 'group.a',
    label: 'Label Group.A',

    // color to plot bars with
    //color: 'steelblue',
  }
}

const configModel = new BarConfigModel(config)
const chart = new BarView(configModel)

chart.setData(data)

// chart.render()

setTimeout(() => {
  const slice = _.random(3, length)
  chart.setData(data.slice(0, slice))
}, 1000)

setTimeout(() => {
  config.y.accessor = 'b'
  chart.setConfig(config)
}, 2000)
