class BarConfigModel extends ContrailModel{

  get defaults(){ return {
    id: 'chart',
    height: 300,
    width: 650,
    barPadding: 1,
    padding:{
      top: 20,
      left:150,
      bottom: 40,
      right: 50
    },
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
      color: 'orange',
    },

    quadrant: 1,
    placement: 'vertical'
  }}

  initialize(){
    this.data = [];
    this.oldData =[];
  }

  setData(data){
    this.data = data;
  }

  setOldData(oldData){
    this.oldData = oldData;
  }

  setConfig(config){
    this.set(config);
  }

  prepareData(data){
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
  }

  getAccessor(axis){
    let accessor = this.get(axis).accessor;
    let args = accessor.split('.');
    let group = args[0];
    let key = args[1];
    return {group, key};
  }

  xScaleConfig(){
    let data = this.data;
    let scale = this.get('x').scale;
    let xScale = d3[scale]();

    let width = this.get('width');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
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
      xScale.range([paddingLeft, width - paddingRight]);
    }
    else{
      xScale.range([width - paddingRight, paddingLeft]);
    }

    return xScale;
  }
  yScaleConfig(){
    let data = this.data;
    let { group, key } = this.getAccessor('y');
    let paddingTop = this.get('padding').top;
    let paddingBottom = this.get('padding').bottom;

    let yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[group][key])]);

    let quadrant = this.get('quadrant');
    let height = this.get('height');


    if(quadrant === 1 || quadrant === 2){
      yScale.range([height - paddingBottom,  paddingTop]);
    }
    else{
      yScale.range([paddingTop, height - paddingBottom]);
    }

    return yScale;
  }
  oldYScaleConfig(){
    let data = this.oldData;
    let { group, key} = this.getAccessor('x');

    let oldYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[group][key])]);

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let paddingTop = this.get('padding').top;
    let paddingBottom = this.get('padding').bottom;

    if(quadrant === 1 || quadrant === 2){
      oldYScale.range([height - paddingBottom,  paddingTop]);
    }
    else{
      oldYScale.range([paddingTop, height - paddingBottom]);
    }

    return oldYScale;
  }

  xAxisConfig(){
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
  }
  yAxisConfig(){
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
  }

  getAxisTextAngle(){
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
  }
  getXAxisTextAnchor(){
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
  }
  getYAxisTextDy(){
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
  }

  calculateXAxisPosition(){
    let xAxisPosition;

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let paddingBottom = this.get('padding').bottom;
    let paddingTop = this.get('padding').top;

    if(quadrant === 1 || quadrant === 2){
      xAxisPosition = height - paddingBottom + 3;
    }
    else{
      xAxisPosition = paddingTop - 3;
    }

    return "translate(0," + xAxisPosition +")";
  }
  calculateYAxisPosition(){
    let yAxisPosition;

    let quadrant = this.get('quadrant');
    let width = this.get('width');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let placement = this.get('placement');

    if(placement === 'horizontal'){
      if(quadrant === 1 ||  quadrant === 4){
        yAxisPosition = width - paddingRight + 3 + this.calculateBarWidth()/2;
      }
      else{
        yAxisPosition = paddingLeft - 3 - this.calculateBarWidth()/2;
      }
    }
    else{
      if(quadrant === 1 ||  quadrant === 4){
        yAxisPosition = paddingLeft - 3  - this.calculateBarWidth()/2;
      }
      else{
        yAxisPosition = width - paddingRight + 3 + this.calculateBarWidth()/2;
      }
    }

    return "translate("+ yAxisPosition +", 0)";
  }

  calculateBarWidth(){
    let data = this.data;

    let width = this.get('width');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let barPadding = this.get('barPadding');

    return ((width - paddingLeft - paddingRight)/(data.length)) - barPadding;
  }
  calculateBarHeight() {
    let barHeight;

    let quadrant = this.get('quadrant');
    let height = this.get('height');
    let paddingTop = this.get('padding').top;
    let paddingBottom = this.get('padding').bottom;
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      barHeight = d => height - paddingBottom - this.yScaleConfig()(d[group][key]);
    }
    else{
      barHeight = d => this.yScaleConfig()(d[group][key]) - paddingTop;
    }
    return barHeight;
  }

  _calculateXBarPosition(){
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
  }
  _calculateYBarPosition(){
    let yPosition;
    let quadrant = this.get('quadrant');
    let paddingTop = this.get('padding').top;
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      yPosition = d => this.yScaleConfig()(d[group][key]);
    }
    else{
      yPosition = d => paddingTop;
    }

    return yPosition;
  }
  calculateBarTransform(){
    let translate;

    translate = d => {
      let x = this._calculateXBarPosition()(d);
      let y = this._calculateYBarPosition()(d);
      return "translate(" + x + ", " + y + ")"
    };

    return translate;
  }

  calculateXTextPosition(){
    return this.calculateBarWidth()/2;
  }
  calculateYTextPosition(){
    let yTextPosition;
    let quadrant = this.get('quadrant');
    let paddingTop = this.get('padding').top;
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      yTextPosition = () => 13;
    }
    else{
      yTextPosition = d => this.yScaleConfig()(d[group][key]) - paddingTop - 13;
    }
    return yTextPosition;
  }
  calculateTextRotate(){
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
  }

  _calculateEnterXPosition(){
    let xPosition;

    let placement = this.get('placement');
    let quadrant = this.get('quadrant');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let width = this.get('width');

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        xPosition = -paddingLeft;
      }
      else{
        xPosition =  width + paddingRight;
      }
    }
    else{
      if(quadrant === 1 || quadrant === 4){
        xPosition = width + paddingRight;
      }
      else{
        xPosition = -paddingLeft;
      }
    }

    return xPosition;
  }
  _calculateEnterYPosition(){
    let yPosition;

    let quadrant = this.get('quadrant');
    let paddingTop = this.get('padding').top;
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      yPosition = d => this.yScaleConfig()(d[group][key]);
    }
    else{
      yPosition = () => paddingTop;
    }

    return yPosition;
  }
  getEnterPositionTranslate(){
    let translatePosition;

    translatePosition = d => {
      let x = this._calculateEnterXPosition();
      let y = this._calculateEnterYPosition()(d);
      return "translate("+ x + ", " + y + ")";
    };

    return translatePosition;
  }

  _calculateExitXPosition(){
    let xPosition;

    let placement = this.get('placement');
    let quadrant = this.get('quadrant');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let width = this.get('width');

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        xPosition = -paddingLeft;
      }
      else{
        xPosition =  width + paddingRight;
      }
    }
    else{
      if(quadrant === 1 || quadrant === 4){
        xPosition = width + paddingRight;
      }
      else{
        xPosition = -paddingLeft;
      }
    }

    return xPosition;
  }
  _calculateExitYPosition(){
    let yPosition;

    let quadrant = this.get('quadrant');
    let paddingTop = this.get('padding').top;
    let { group, key} = this.getAccessor('y');

    if(quadrant === 1 || quadrant === 2){
      yPosition = d => this.oldYScaleConfig()(d[group][key]);
    }
    else{
      yPosition = () => paddingTop;
    }

    return yPosition;
  }
  getExitPositionTranslate(){
    let translatePosition;
    translatePosition = d => {
      let x = this._calculateExitXPosition();
      let y = this._calculateExitYPosition()(d);
      return "translate("+ x + ", " + y + ")";
    };
    return translatePosition;
  }

  calculateDelay(time){
    let delay;

    delay = (d, i) => i / this.data.length * time;

    return delay;
  }

  getMargin(){
    let margin = this.get('margin');
    let top = margin.top === undefined ? '0px' : margin.top + "px";
    let right = margin.right === undefined ? '0px' : margin.right + "px";
    let bottom = margin.bottom === undefined ? '0px' : margin.bottom + "px";
    let left = margin.left === undefined ? '0px' : margin.left + "px";

    return "margin: " + top + " " +  right + " " + bottom + " " + left;

  }
  getColor(){
    return this.get('y').color;
  }

  getYLabel(){
    return this.get('y').label;
  }
  getXLabel(){
    return this.get('x').label;
  }

  calculateYLabelTranslate(){
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let height = this.get('height');
    let quadrant = this.get('quadrant');
    let width = this.get('width');
    let placement = this.get('placement');
    let angle;

    if(placement === 'horizontal'){
      if(quadrant === 1 ||  quadrant === 3){
        angle = '-90';
      }
      else{
        angle = '90'
      }
    }


    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        return "translate(" + (width - 10) + ", "+ height/2+") rotate(" + angle + ")";
      }
      else{
        return "translate(" + 10 + ", "+ height/2+") rotate(" + angle + ")";
      }
    }
    else{
      if(quadrant === 1 || quadrant === 4){
        return "translate(" + paddingLeft/2 + ", "+ height/2+")";
      }
      else{
        return "translate(" + (width - paddingRight/2) + ", "+ height/2+")";
      }
    }
  }
  calculateXLabelTranslate(){
    let paddingBottom = this.get('padding').bottom;
    let paddingRight = this.get('padding').right;
    let paddingLeft = this.get('padding').left;
    let paddingTop = this.get('padding').top;
    let height = this.get('height');
    let width = this.get('width');
    let quadrant = this.get('quadrant');
    let placement = this.get('placement');
    let angle;


    if(placement === 'horizontal'){
      if(quadrant === 1 ||  quadrant === 3){
        angle = '-90';
      }
      else{
        angle = '90'
      }
    }

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 2){
        return "translate(" + ((width - paddingRight - paddingLeft)/2 + paddingLeft) + ", "+ (height - paddingBottom/2 + 20 )+") rotate(" + angle + ")";
      }
      else{
        return "translate(" + ((width - paddingRight - paddingLeft)/2 + paddingLeft ) + ", " + (paddingTop/2 - 20) + ") rotate(" + angle + ")";
      }
    }
    else{
      if(quadrant === 1){
        return "translate(" + ((width - paddingRight - paddingLeft)/2 + paddingLeft) + ", "+ (height - paddingBottom/2 + 20 )+")";
      }
      if(quadrant === 2){
        return "translate(" + ((width - paddingRight - paddingLeft)/2 + paddingLeft) + ", "+ (height - paddingBottom/2 + 20 )+")";
      }
      if(quadrant === 3){
        return "translate(" + ((width - paddingRight - paddingLeft)/2 + paddingLeft) + ", " + (paddingTop/2 - 5) + ")";
      }
      if(quadrant === 4){
        return "translate(" + ((width - paddingRight - paddingLeft)/2 + paddingLeft) + ", "+ (paddingTop/2 - 5) + ")";
      }
    }
  }
}
