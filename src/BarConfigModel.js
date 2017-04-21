
let BarConfigModel = Backbone.Model.extend({
  initialize: function(){
    this.data = [];
    this.oldData =[];
  },

  defaults: {
    id: 'chart',
    size: {
      width: 500,
      height: 300,
      barPadding: 1,
      padding: 45 },
    color: 'orange',
    quadrant: 1,
    type: 'vertical'
  },

  setData: function(data){
    this.data = data;
  },

  setOldData: function(oldData){
    this.oldData = oldData;
  },

  prepareData: function(){
    let data = this.data;

    let tempData = [];
    _.forEach(data, function (v, key) {
      if (v.value < 0 || v.value === undefined) {
        v.value = 0;
        tempData.push(v);
      }
      else {
        tempData.push(v);
      }
    });
    return tempData;
  },

  xScaleConfig: function(){
    let data = this.data;
    let xScale = d3.scaleLinear();

    let width = this.get('size').width;
    let padding = this.get('size').padding;
    let quadrant = this.get('quadrant');
    let type = this.get('type');

    if( type === 'horizontal' ){
      xScale.domain([d3.max(data, d => d.time), d3.min(data, d => d.time)]);
    }
    else{
      xScale.domain([d3.min(data, d => d.time), d3.max(data, d => d.time)]);
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

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]);

    let quadrant = this.get('quadrant');
    let height = this.get('size').height;
    let padding = this.get('size').padding;

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

    let oldYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]);

    let quadrant = this.get('quadrant');
    let height = this.get('size').height;
    let padding = this.get('size').padding;

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
    let type = this.get('type');

    if(type === 'horizontal'){
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
    let type = this.get('type');

    if (type === 'horizontal') {
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
    let type = this.get('type');

    if (type === 'horizontal') {
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
    let type = this.get('type');

    if (type === 'horizontal') {
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
    let height = this.get('size').height;
    let padding = this.get('size').padding;

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
    let width = this.get('size').width;
    let padding = this.get('size').padding;
    let type = this.get('type');

    if(type === 'horizontal'){
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

    let width = this.get('size').width;
    let padding = this.get('size').padding;
    let barPadding = this.get('size').barPadding;

    return ((width - padding *2)/(data.length)) - barPadding;
  },
  calculateBarHeight: function(d) {
    let barHeight;

    let quadrant = this.get('quadrant');
    let height = this.get('size').height;
    let padding = this.get('size').padding;

    if(quadrant === 1 || quadrant === 2){
      barHeight = d => height - padding - this.yScaleConfig()(d.value);
    }
    else{
      barHeight = d => this.yScaleConfig()(d.value) - padding;
    }
    return barHeight;
  },

  _calculateXBarPosition: function(){
    let xPosition;
    let quadrant = this.get('quadrant');
    let barWidth = this.calculateBarWidth();

    if(quadrant === 1 || quadrant === 4){
      xPosition = d => this.xScaleConfig()(d.time) - barWidth/2;
    }
    else{
      xPosition = d => this.xScaleConfig()(d.time) - barWidth + barWidth/2;
    }

    return xPosition;
  },
  _calculateYBarPosition: function(){
    let yPosition;
    let quadrant = this.get('quadrant');
    let padding = this.get('size').padding;

    if(quadrant === 1 || quadrant === 2){
      yPosition = d => this.yScaleConfig()(d.value);
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
    let padding = this.get('size').padding;

    if(quadrant === 1 || quadrant === 2){
      yTextPosition = () => 13;
    }
    else{
      yTextPosition = d => this.yScaleConfig()(d.value) - padding - 13;
    }
    return yTextPosition;
  },
  calculateTextRotate: function(){
    let textRotate;

    let type = this.get('type');
    let quadrant = this.get('quadrant');
    let barWidth = this.calculateBarWidth();

    if(type === 'horizontal'){
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

    let type = this.get('type');
    let quadrant = this.get('quadrant');
    let padding = this.get('size').padding;
    let width = this.get('size').width;

    if(type === 'horizontal'){
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
    let padding = this.get('size').padding;

    if(quadrant == 1 || quadrant == 2){
      yPosition = d => this.yScaleConfig()(d.value);
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

    let type = this.get('type');
    let quadrant = this.get('quadrant');
    let padding = this.get('size').padding;
    let width = this.get('size').width;

    if(type === 'horizontal'){
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
    let padding = this.get('size').padding;

    if(quadrant == 1 || quadrant == 2){
      yPosition = d => this.oldYScaleConfig()(d.value);
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
  }

});