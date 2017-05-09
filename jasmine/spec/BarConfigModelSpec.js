describe("BarConfigModel", function() {
  let configModel;
  let config = {

    // id of the chart HTML element
    id: 'chart',

    // limit max height to provided value
    height: 400,

    // optional margin of the chart
    margin: {
      left: 0,
    },

    // quadrant
    quadrant: 1,

    // for horizontal
    padding: {
      right: 10,
      top: 10,
      bottom: 10,
      left: 10,
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
  let data = [
    {
      group: {
        x: 1475761930000,
        a: 1,
        b: 10,
      }
    },
    {
      group: {
        x: 1475762930000,
        a: 2,
        b: 20,
      }
    },
    {
      group: {
        x: 1475763930000,
        a: 3,
        b: 30,
      }
    },
    {
      group: {
        x: 1475764930000,
        a: -20,
        b: 40,
      }
    },
    {
      group: {
        x: 1475765930000,
        a: undefined,
        b: 50,
      }
    },
    {
      group: {
        x: 1475765930000,
        a: 6,
        b: undefined,
      }
    }
  ];

  beforeEach(function() {
    configModel = new BarConfigModel(config);
    configModel.setData(data);
    configModel.setOldData(data);
  });

  afterEach(function() {
    config = {

      // id of the chart HTML element
      id: 'chart',

      // limit max height to provided value
      height: 400,

      // optional margin of the chart
      margin: {
        left: 0,
      },

      // quadrant
      quadrant: 1,

      // for horizontal
      padding: {
        right: 10,
        top: 10,
        bottom: 10,
        left: 10,
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
    data = [
      {
        group: {
          x: 1475761930000,
          a: 1,
          b: 10,
        }
      },
      {
        group: {
          x: 1475762930000,
          a: 2,
          b: 20,
        }
      },
      {
        group: {
          x: 1475763930000,
          a: 3,
          b: 30,
        }
      },
      {
        group: {
          x: 1475764930000,
          a: -20,
          b: 40,
        }
      },
      {
        group: {
          x: 1475765930000,
          a: undefined,
          b: 50,
        }
      },
      {
        group: {
          x: 1475765930000,
          a: 6,
          b: undefined,
        }
      }
    ];
  });

  it("Set data", function() {
     expect(configModel.data).toEqual(data);
  });

  it("Prepare data", function(){
    let clearData = configModel.prepareData(data);
    expect(clearData[3].group.a).toBe(0);
    expect(clearData[4].group.a).toBe(0);

    configModel.set('y',{accessor: 'group.b', label: 'Label Group.A'});
    clearData = configModel.prepareData(data);

    expect(clearData[5].group.b).toBe(0);
  });

  it("Created xScale mast be single", function(){
     expect(configModel.xScaleConfig()).toEqual(configModel.xScaleConfig())
  });

  it("Created yScale mast be single", function(){
    expect(configModel.yScaleConfig()).toEqual(configModel.yScaleConfig())
  });

  it("Created oldYScale mast be single", function(){
    expect(configModel.oldYScaleConfig()).toEqual(configModel.oldYScaleConfig())
  });

  it("Created xAxis mast be single", function(){
     expect(configModel.xAxisConfig()).toEqual(configModel.xAxisConfig())
  });

  it("Created yAxis mast be single", function(){
    expect(configModel.yAxisConfig()).toEqual(configModel.yAxisConfig())
  });

  //width = 500, paddingLeft = 10, paddingRight = 10, barPadding = 1
  //((width - paddingLeft - paddingRight) / data.length) - barPadding
  it("Calculate bar width", function(){
    configModel.data.length = 2;
    expect(configModel.calculateBarWidth()).toBe(239);
    configModel.data.length = 10;
    expect(configModel.calculateBarWidth()).toBe(47);
    configModel.data.length = 50;
    expect(configModel.calculateBarWidth()).toBe(8.6);

  });

  //data.length = 6
  it("Calculate bar height", function(){

    let height = configModel.calculateBarHeight()({
      group: {
        x: 1475761930000,
        a: 0,
        b: 10,
      }
    });
    let quadrant = configModel.get('quadrant');

    if(quadrant === 1 || quadrant === 2){
      expect(height).toBe(0)
    }

    height = configModel.calculateBarHeight()({
      group: {
        x: 1475761930000,
        a: 6,
        b: 10,
      }
    });
    if(quadrant === 1 || quadrant === 2){
      expect(height).toBe(380)
    }
    height = configModel.calculateBarHeight()({
      group: {
        x: 1475761930000,
        a: 3,
        b: 10,
      }
    });
    if(quadrant === 1 || quadrant === 2){
      expect(height).toBe(190)
    }
  })


});
