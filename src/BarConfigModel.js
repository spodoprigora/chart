
let BarConfigModel = Backbone.Model.extend({
  initialize: function(config){
    this.data = [];
    this.oldData =[];
    console.log(config);
  },

  defaults: {
    id: 'chart',
    height: 300,
    width: 800,
    barPadding: 1,
    padding: 45,
    margin: {
      top: 5,
      left: 5,
      bottom: 5,
      right: 5
    },
    x: {
      accessor: 'group.x',
      label: 'Value',
      scale: 'scaleTime'
    },
    y: {
      accessor: 'group.a',
      label: 'Label Group.A',
    },
    color: 'orange',
    quadrant: 1,
    placement: 'vertical'
  },

  setData: function(data){
    this.data = data;
  },

  setOldData: function(oldData){
    this.oldData = oldData;
  },

  setConfig: function(config){
    _.forEach(config, (value, key) => this.set(key, value));
  },

  prepareData: function(data){
    let tempData = [];
    _.forEach(data, function (v, key) {
      if (v.b < 0 || v.b === undefined) {
        v.b = 0;
        if(v.a < 0 || v.a === undefined){
          v.a = 0;
        }
        tempData.push(v);
      }
      else {
        tempData.push(v);
      }
    });
    return tempData;
  },

  getAccessor: function(x){
    let accessor = this.get(x).accessor;
    let arr = accessor.split('.');
    let group = arr[0];
    let key = arr[1];
    return {group, key};
  },

  xScaleConfig: function(){
    let data = this.data;
    let scale = this.get('x').scale;
    let xScale = d3[scale]();

    let width = this.get('width');
    let padding = this.get('padding');
    let quadrant = this.get('quadrant');
    let placement = this.get('placement');

    let { group, key} = this.getAccessor('x');

    if( placement === 'horizontal' ){
      xScale.domain([d3.max(data, d => d[group][key]), d3.min(data, d => d[group][key])]);
    }
    else{
      xScale.domain([d3.min(data, d => d[group][key]), d3.max(data, d => d[group][key])]);
    }

    if( quadrant === 1 || quadrant === 4 ){
      xScale.range([padding, width - padding]);
    }
    else{
      xScale.range([width - padding, padding]);
    }

    return xScale;
  },
  yScaleConfig: function(){
    let data = this.data;
    let { group, key } = this.getAccessor('y');

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[group][key])]);

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let padding = this.get('padding');

    if(quadrant === 1 || quadrant === 2){
      yScale.range([height - padding,  padding]);
    }
    else{
      yScale.range([padding, height - padding]);
    }

    return yScale;
  },
  oldYScaleConfig: function(){
    let data = this.oldData;
    let { group, key} = this.getAccessor('x');

    let oldYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[group][key])]);

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let padding = this.get('padding');

    if(quadrant === 1 || quadrant === 2){
      oldYScale.range([height - padding,  padding]);
    }
    else{
      oldYScale.range([padding, height - padding]);
    }

    return oldYScale;
  },

  xAxisConfig: function(){
    let xAxis;
    let quadrant = this.get('quadrant');

    if(quadrant === 1 || quadrant === 2){
      xAxis = d3.axisBottom();
    }
    else{
      xAxis = d3.axisTop();
    }

    xAxis.scale(this.xScaleConfig()).ticks(10);
    return xAxis;
  },
  yAxisConfig: function(){
    let yAxis;
    let quadrant = this.get('quadrant');
    let placement = this.get('placement');

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        yAxis = d3.axisRight();
      }
      else{
        yAxis = d3.axisLeft();
      }
    }
    else
    {
      if(quadrant === 1 || quadrant === 4){
        yAxis = d3.axisLeft();
      }
      else{
        yAxis = d3.axisRight();
      }
    }
    yAxis.scale(this.yScaleConfig()).ticks(3);

    return yAxis;
  },

  getAxisTextAngle: function(){
    let axisTextAngle;

    let quadrant = this.get('quadrant');
    let placement = this.get('placement');

    if (placement === 'horizontal') {
      if(quadrant === 1 || quadrant === 3){
        axisTextAngle = -90;
      }
      else{
        axisTextAngle = 90;
      }
    }
    else{
      axisTextAngle = 0;
    }

    return axisTextAngle;
  },
  getXAxisTextAnchor: function(){
    let xAxisTextAnchor;

    let quadrant = this.get('quadrant');
    let placement = this.get('placement');

    if (placement === 'horizontal') {
      if(quadrant === 1 || quadrant === 4){
        xAxisTextAnchor = 'end';
      }
      else{
        xAxisTextAnchor = 'start';
      }
    }
    else{
      xAxisTextAnchor = 'middle';
    }

    return xAxisTextAnchor;
  },
  getYAxisTextDy: function(){
    let yAxisTextDy;

    let quadrant = this.get('quadrant');
    let placement = this.get('placement');

    if (placement === 'horizontal') {
      if(quadrant === 1 || quadrant === 2){
        yAxisTextDy = '1.5em';
      }
      else{
        yAxisTextDy = '-1em';
      }
    }
    else{
      yAxisTextDy = '0.4em';
    }

    return yAxisTextDy;
  },

  calculateXAxisPosition: function(){
    let xAxisPosition;

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let padding = this.get('padding');

    if(quadrant === 1 || quadrant === 2){
      xAxisPosition = height - padding + 3;
    }
    else{
      xAxisPosition = padding - 3;
    }

    return "translate(0," + xAxisPosition +")";
  },
  calculateYAxisPosition: function(){
    let yAxisPosition;

    let quadrant = this.get('quadrant');
    let width = this.get('width');
    let padding = this.get('padding');
    let placement = this.get('placement');

    if(placement === 'horizontal'){
      if(quadrant === 1 ||  quadrant === 4){
        yAxisPosition = width - padding + 3 + this.calculateBarWidth()/2;
      }
      else{
        yAxisPosition = padding - 3 - this.calculateBarWidth()/2;
      }
    }
    else{
      if(quadrant === 1 ||  quadrant === 4){
        yAxisPosition = padding - 3  - this.calculateBarWidth()/2;
      }
      else{
        yAxisPosition = width - padding + 3 + this.calculateBarWidth()/2;
      }
    }

    return "translate("+ yAxisPosition +", 0)";
  },

  calculateBarWidth: function(){
    let data = this.data;

    let width = this.get('width');
    let padding = this.get('padding');
    let barPadding = this.get('barPadding');

    return ((width - padding *2)/(data.length)) - barPadding;
  },
  calculateBarHeight: function(d) {
    let barHeight;

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let padding = this.get('padding');
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      barHeight = d => height - padding - this.yScaleConfig()(d[group][key]);
    }
    else{
      barHeight = d => this.yScaleConfig()(d[group][key]) - padding;
    }
    return barHeight;
  },

  _calculateXBarPosition: function(){
    let xPosition;
    let quadrant = this.get('quadrant');
    let barWidth = this.calculateBarWidth();
    let { group, key} = this.getAccessor('x');

    if(quadrant === 1 || quadrant === 4){
      xPosition = d => this.xScaleConfig()(d[group][key]) - barWidth/2;
    }
    else{
      xPosition = d => this.xScaleConfig()(d[group][key]) - barWidth + barWidth/2;
    }

    return xPosition;
  },
  _calculateYBarPosition: function(){
    let yPosition;
    let quadrant = this.get('quadrant');
    let padding = this.get('padding');
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      yPosition = d => this.yScaleConfig()(d[group][key]);
    }
    else{
      yPosition = d => padding;
    }

    return yPosition;
  },
  calculateBarTransform: function(){
    let translate;

    translate = d => {
      let x = this._calculateXBarPosition()(d);
      let y = this._calculateYBarPosition()(d);
      return "translate(" + x + ", " + y + ")"
    };

    return translate;
  },

  calculateXTextPosition: function(){
    return this.calculateBarWidth()/2;
  },
  calculateYTextPosition: function(){
    let yTextPosition;
    let quadrant = this.get('quadrant');
    let padding = this.get('padding');
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      yTextPosition = () => 13;
    }
    else{
      yTextPosition = d => this.yScaleConfig()(d[group][key]) - padding - 13;
    }
    return yTextPosition;
  },
  calculateTextRotate: function(){
    let textRotate;

    let placement = this.get('placement');
    let quadrant = this.get('quadrant');
    let barWidth = this.calculateBarWidth();

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 3){
        textRotate = d => "rotate(-90 " + ((barWidth/2) + 3) +" " + this.calculateYTextPosition()(d) + ")";
      }
      else{
        textRotate = d => "rotate(90 " + ((barWidth/2) - 3) +" " + this.calculateYTextPosition()(d) + ")";
      }
    }
    else{
      textRotate = d => "rotate(0)";
    }

    return textRotate;
  },

  _calculateEnterXPosition: function(){
    let xPosition;

    let placement = this.get('placement');
    let quadrant = this.get('quadrant');
    let padding = this.get('padding');
    let width = this.get('width');

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        xPosition = -padding;
      }
      else{
        xPosition =  width + padding;
      }
    }
    else{
      if(quadrant === 1 || quadrant === 4){
        xPosition = width + padding;
      }
      else{
        xPosition = -padding;
      }
    }

    return xPosition;
  },
  _calculateEnterYPosition: function(){
    let yPosition;

    let quadrant = this.get('quadrant');
    let padding = this.get('padding');
    let { group, key} = this.getAccessor('y');

    if(quadrant == 1 || quadrant == 2){
      yPosition = d => this.yScaleConfig()(d[group][key]);
    }
    else{
      yPosition = () => padding;
    }

    return yPosition;
  },
  getEnterPositionTranslate: function(){
    let translatePosition;

    translatePosition = d => {
      let x = this._calculateEnterXPosition();
      let y = this._calculateEnterYPosition()(d);
      return "translate("+ x + ", " + y + ")";
    };

    return translatePosition;
  },

  _calculateExitXPosition: function(){
    let xPosition;

    let placement = this.get('placement');
    let quadrant = this.get('quadrant');
    let padding = this.get('padding');
    let width = this.get('width');

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        xPosition = -padding;
      }
      else{
        xPosition =  width + padding;
      }
    }
    else{
      if(quadrant === 1 || quadrant === 4){
        xPosition = width + padding;
      }
      else{
        xPosition = -padding;
      }
    }

    return xPosition;
  },
  _calculateExitYPosition: function(){
    let yPosition;

    let quadrant = this.get('quadrant');
    let padding = this.get('padding');
    let { group, key} = this.getAccessor('y');

    if(quadrant == 1 || quadrant == 2){
      yPosition = d => this.oldYScaleConfig()(d[group][key]);
    }
    else{
      yPosition = () => padding;
    }

    return yPosition;
  },
  getExitPositionTranslate: function(){
    let translatePosition;
    translatePosition = d => {
      let x = this._calculateExitXPosition();
      let y = this._calculateExitYPosition()(d);
      return "translate("+ x + ", " + y + ")";
    };
    return translatePosition;
  },

  calculateDelay: function(time){
    let delay;

    delay = (d, i) => i / this.data.length * time;

    return delay;
  },

  getMargin: function(){
    let margin = this.get('margin');
    let top = margin.top === undefined ? '0px' : margin.top + "px";
    let right = margin.right === undefined ? '0px' : margin.right + "px";
    let bottom = margin.bottom === undefined ? '0px' : margin.bottom + "px";
    let left = margin.left === undefined ? '0px' : margin.left + "px";

    return "margin: " + top + " " +  right + " " + bottom + " " + left;

  }

});