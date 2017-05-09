class BarConfigModel extends ContrailModel {

  get defaults () {
    return {
      id: 'chart',
      height: 300,
      width: 500,
      barPadding: 1,
      padding: {
        top: 20,
        left: 150,
        bottom: 40,
        right: 50,
      },
      margin: {
        top: 5,
        left: 5,
        bottom: 5,
        right: 5,
      },
      x: {
        accessor: 'group.x',
        label: 'Value',
        scale: 'scaleTime',
      },
      y: {
        accessor: 'group.a',
        label: 'Label Group.A',
        color: 'orange',
      },
      quadrant: 1,
      placement: 'vertical',
    }
  }

  initialize () {
    this.data = [];
    this.oldData = [];
  }

  setData (data) {
    this.data = data;
    this.xScale = null;
    this.yScale = null;
    this.xAxis = null;
    this.yAxis = null;
    this.xScale = this.xScaleConfig();
    this.yScale = this.yScaleConfig();
    this.xAxis = this.xAxisConfig();
    this.yAxis = this.yAxisConfig();
  }

  setOldData (oldData) {
    this.oldData = oldData;
    this.oldYScale = null;
    this.oldYScale = this.oldYScaleConfig();
  }

  setConfig (config) {
    this.set(config);
  }

  prepareData (data) {
    const clearData = [];
    let accessor = this.get('y').accessor;

    _.forEach(data, (v) => {
      if (_.get(v, accessor) < 0 || _.get(v, accessor) === undefined) {
        _.set(v, accessor, 0);
        clearData.push(v);
      } else {
        clearData.push(v);
      }
    });
    return clearData;
  }

  xScaleConfig () {
    let placement = this.get('placement');
    let domain = this.domain;

    if(!this.xScale){
      let data = this.data;
      let scale = this.get('x').scale;
      let xScale = d3[scale]();
      let width = this.get('width');
      let paddingLeft = this.get('padding').left;
      let paddingRight = this.get('padding').right;
      let quadrant = this.get('quadrant');
      let accessor = this.get('x').accessor;

      if( placement === 'horizontal' ){
        xScale.domain([d3.max(data, d => _.get(d, accessor)), d3.min(data, d => _.get(d, accessor))]);
      }
      else{
        xScale.domain([d3.min(data, d => _.get(d, accessor)), d3.max(data, d => _.get(d, accessor))]);
      }


      if( quadrant === 1 || quadrant === 4 ){
        xScale.range([paddingLeft, width - paddingRight -(this.calculateBarWidth()/2)]);
      }
      else {
        xScale.range([width - paddingRight - (this.calculateBarWidth()/2), paddingLeft]);
      }
      return xScale;
    }

    if(domain){
      this.xScale.domain(domain);
    }
    return this.xScale;
  }
  yScaleConfig () {
    if(this.yScale) return this.yScale;
    const data = this.data;
    let accessor = this.get('y').accessor;
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;
    const quadrant = this.get('quadrant');
    const height = this.get('height');

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => _.get(d, accessor))]);

    if (quadrant === 1 || quadrant === 2) {
      yScale.range([height - paddingBottom, paddingTop]);
    } else {
      yScale.range([paddingTop, height - paddingBottom]);
    }
    return yScale;
  }
  oldYScaleConfig () {
    if(this.oldYScale) return this.oldYScale;
    const data = this.oldData;
    let accessor = this.get('y').accessor;
    const quadrant = this.get('quadrant');
    const height = this.get('height');
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;

    const oldYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => _.get(d, accessor))]);

    if (quadrant === 1 || quadrant === 2) {
      oldYScale.range([height - paddingBottom, paddingTop]);
    } else {
      oldYScale.range([paddingTop, height - paddingBottom]);
    }

    return oldYScale;
  }

  xAxisConfig () {
    let xAxis;

    if(this.xAxis) return this.xAxis;

    const quadrant = this.get('quadrant');

    if (quadrant === 1 || quadrant === 2) {
      xAxis = d3.axisBottom();
    } else {
      xAxis = d3.axisTop();
    }

    xAxis.scale(this.xScaleConfig()).ticks(10);

    return xAxis;
  }
  yAxisConfig () {
    let yAxis;

    if(this.yAxis) return this.yAxis;

    const quadrant = this.get('quadrant');
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        yAxis = d3.axisRight();
      } else {
        yAxis = d3.axisLeft();
      }
    } else if (quadrant === 1 || quadrant === 4) {
      yAxis = d3.axisLeft();
    } else {
      yAxis = d3.axisRight();
    }

    yAxis.scale(this.yScaleConfig()).ticks(3);

    return yAxis;
  }

  getAxisTextAngle () {
    let axisTextAngle;
    const quadrant = this.get('quadrant');
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 3) {
        axisTextAngle = -90;
      } else {
        axisTextAngle = 90;
      }
    } else {
      axisTextAngle = 0;
    }

    return axisTextAngle;
  }
  getXAxisTextAnchor () {
    let xAxisTextAnchor;
    const quadrant = this.get('quadrant');
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xAxisTextAnchor = 'end';
      } else {
        xAxisTextAnchor = 'start';
      }
    } else {
      xAxisTextAnchor = 'middle';
    }

    return xAxisTextAnchor;
  }
  getYAxisTextDy () {
    let yAxisTextDy;
    const quadrant = this.get('quadrant');
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 2) {
        yAxisTextDy = '1.5em';
      } else {
        yAxisTextDy = '-1em';
      }
    } else {
      yAxisTextDy = '0.4em';
    }

    return yAxisTextDy;
  }

  calculateXAxisPosition () {
    let xPosition;
    let yPosition;
    const quadrant = this.get('quadrant');
    const height = this.get('height');
    const paddingBottom = this.get('padding').bottom;
    const paddingTop = this.get('padding').top;
    const placement = this.get('placement');

    if (quadrant === 1 || quadrant === 2) {
      yPosition = (height - paddingBottom) + 3;
    } else {
      yPosition = paddingTop - 3;
    }

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xPosition = 0;
      } else {
        xPosition = this.calculateBarWidth() / 2;
      }
    } else if (quadrant === 1 || quadrant === 4) {
      xPosition = this.calculateBarWidth() / 2;
    } else {
      xPosition = 0;
    }

    return `translate(${xPosition}, ${yPosition})`;
  }
  calculateYAxisPosition () {
    let xPosition;
    const quadrant = this.get('quadrant');
    const width = this.get('width');
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xPosition = (width - paddingRight) + 3;
      } else {
        xPosition = paddingLeft - 3;
      }
    } else if (quadrant === 1 || quadrant === 4) {
      xPosition = paddingLeft - 3;
    } else {
      xPosition = (width - paddingRight) + 3;
    }

    return `translate(${xPosition}, 0)`;
  }

  calculateBarWidth () {
    const data = this.data;
    const width = this.get('width');
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;
    const barPadding = this.get('barPadding');

    return ((width - paddingLeft - paddingRight) / (data.length)) - barPadding;
  }
  calculateBarHeight () {
    let barHeight;
    const quadrant = this.get('quadrant');
    const height = this.get('height');
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;
    let accessor = this.get('y').accessor;

    if (quadrant === 1 || quadrant === 2) {
      barHeight = d => height - paddingBottom - this.yScaleConfig()(_.get(d, accessor));
    } else {
      barHeight = d => this.yScaleConfig()(_.get(d, accessor)) - paddingTop;
    }

    return barHeight;
  }

  _calculateXBarPosition () {
    let xPosition;
    const quadrant = this.get('quadrant');
    const barWidth = this.calculateBarWidth();
    let accessor = this.get('x').accessor;
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xPosition = d => this.xScaleConfig()(_.get(d, accessor)) - (barWidth / 2);
      } else {
        xPosition = d => this.xScaleConfig()(_.get(d, accessor));
      }
    } else if (quadrant === 1 || quadrant === 4) {
      xPosition = d => this.xScaleConfig()(_.get(d, accessor));
    } else {
      xPosition = d => this.xScaleConfig()(_.get(d, accessor)) - (barWidth / 2);
    }

    return xPosition;
  }
  _calculateYBarPosition () {
    let yPosition;
    const quadrant = this.get('quadrant');
    const paddingTop = this.get('padding').top;
    let accessor = this.get('y').accessor;

    if (quadrant === 1 || quadrant === 2) {
      yPosition = d => this.yScaleConfig()(_.get(d, accessor));
    } else {
      yPosition = () => paddingTop;
    }

    return yPosition;
  }
  calculateBarTransform () {
    return (d) => {
      const x = this._calculateXBarPosition()(d);
      const y = this._calculateYBarPosition()(d);
      return `translate(${x}, ${y})`;
    };
  }

  calculateXTextPosition () {
    return this.calculateBarWidth() / 2;
  }
  calculateYTextPosition () {
    let yTextPosition;
    const quadrant = this.get('quadrant');
    const paddingTop = this.get('padding').top;
    let accessor = this.get('y').accessor;

    if (quadrant === 1 || quadrant === 2) {
      yTextPosition = () => 13;
    } else {
      yTextPosition = d => this.yScaleConfig()(_.get(d, accessor)) - paddingTop - 13;
    }

    return yTextPosition;
  }
  calculateTextRotate () {
    let textRotate;
    const placement = this.get('placement');
    const quadrant = this.get('quadrant');
    const barWidth = this.calculateBarWidth();

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 3) {
        textRotate = d => `rotate(-90 ${((barWidth / 2) + 3)} ${this.calculateYTextPosition()(d)})`;
      } else {
        textRotate = d => `rotate(90 ${((barWidth / 2) - 3)} ${this.calculateYTextPosition()(d)})`;
      }
    } else {
      textRotate = () => 'rotate(0)';
    }

    return textRotate;
  }

  _calculateEnterXPosition () {
    let xPosition;
    const placement = this.get('placement');
    const quadrant = this.get('quadrant');
    const width = this.get('width');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xPosition = -this.calculateBarWidth() - 5;
      } else {
        xPosition = width + this.calculateBarWidth();
      }
    } else if (quadrant === 1 || quadrant === 4) {
      xPosition = width + this.calculateBarWidth();
    } else {
      xPosition = -this.calculateBarWidth() - 5;
    }

    return xPosition;
  }
  _calculateEnterYPosition () {
    let yPosition;
    const quadrant = this.get('quadrant');
    const paddingTop = this.get('padding').top;
    let accessor = this.get('y').accessor;

    if (quadrant === 1 || quadrant === 2) {
      yPosition = d => this.yScaleConfig()(_.get(d, accessor));
    } else {
      yPosition = () => paddingTop;
    }

    return yPosition;
  }
  getEnterPositionTranslate () {
    return (d) => {
      const x = this._calculateEnterXPosition();
      const y = this._calculateEnterYPosition()(d);
      return `translate(${x}, ${y})`;
    };
  }

  _calculateExitXPosition () {
    let xPosition;
    const placement = this.get('placement');
    const quadrant = this.get('quadrant');
    const width = this.get('width');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xPosition = -this.calculateBarWidth() - 5;
      } else {
        xPosition = width + this.calculateBarWidth();
      }
    } else if (quadrant === 1 || quadrant === 4) {
      xPosition = width + this.calculateBarWidth();
    } else {
      xPosition = -this.calculateBarWidth() - 5;
    }

    return xPosition;
  }
  _calculateExitYPosition () {
    let yPosition;
    const quadrant = this.get('quadrant');
    const paddingTop = this.get('padding').top;
    let accessor = this.get('y').accessor;

    if (quadrant === 1 || quadrant === 2) {
      yPosition = d => this.oldYScaleConfig()(_.get(d, accessor));
    } else {
      yPosition = () => paddingTop;
    }

    return yPosition;
  }
  getExitPositionTranslate () {
    return (d) => {
      const x = this._calculateExitXPosition();
      const y = this._calculateExitYPosition()(d);
      return `translate(${x}, ${y})`;
    };
  }

  calculateDelay (time) {
    return (d, i) => i / (this.data.length * time);
  }

  getMargin () {
    const margin = this.get('margin');
    const top = margin.top === undefined ? '0px' : `${margin.top}px`;
    const right = margin.right === undefined ? '0px' : `${margin.right}px`;
    const bottom = margin.bottom === undefined ? '0px' : `${margin.bottom}px`;
    const left = margin.left === undefined ? '0px' : `${margin.left}px`;

    return `margin: ${top} ${right} ${bottom} ${left}`;
  }
  getColor () {
    return this.get('y').color;
  }

  getYLabel () {
    return this.get('y').label;
  }
  getXLabel () {
    return this.get('x').label;
  }

  calculateYLabelTranslate () {
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;
    const height = this.get('height');
    const quadrant = this.get('quadrant');
    const width = this.get('width');
    const placement = this.get('placement');
    let angle;

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 3) {
        angle = '-90';
      } else {
        angle = '90'
      }
    }

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        return `translate(${width - 10}, ${height / 2}) rotate(${angle})`;
      }
      return `translate(10, ${height / 2}) rotate(${angle})`;
    } else if (quadrant === 1 || quadrant === 4) {
      return `translate(${paddingLeft / 2}, ${height / 2})`;
    }
    return `translate(${(width - (paddingRight / 2))}, ${height / 2})`;
  }
  calculateXLabelTranslate () {
    const paddingBottom = this.get('padding').bottom;
    const paddingRight = this.get('padding').right;
    const paddingLeft = this.get('padding').left;
    const paddingTop = this.get('padding').top;
    const height = this.get('height');
    const width = this.get('width');
    const quadrant = this.get('quadrant');
    const placement = this.get('placement');
    let angle;

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 3) {
        angle = '-90';
      } else {
        angle = '90'
      }
    }

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 2) {
        return `translate(${((width - paddingRight - paddingLeft) / 2) + paddingLeft}, ${(height - (paddingBottom / 2)) + 20}) rotate(${angle})`;
      }
      return `translate(${((width - paddingRight - paddingLeft) / 2) + paddingLeft}, ${(paddingTop / 2) - 20}) rotate(${angle})`;
    } else if (quadrant === 1 || quadrant === 2) {
      return `translate(${((width - paddingRight - paddingLeft) / 2) + paddingLeft}, ${(height - (paddingBottom / 2)) + 20})`;
    }
    return `translate(${((width - paddingRight - paddingLeft) / 2) + paddingLeft}, ${(paddingTop / 2) - 5})`;
  }

  get xClip(){
    const quadrant = this.get('quadrant');
    let placement = this.get('placement');
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;

    if(placement === 'horizontal'){
      if(quadrant === 1 || quadrant === 4){
        return paddingLeft - (this.calculateBarWidth() / 2);
      }
      else{
        return paddingLeft ;
      }
    }
    else{
      if(quadrant === 1 || quadrant === 4){
        return paddingLeft;
      }
      else{
        return paddingLeft - (this.calculateBarWidth() / 2);
      }
    }

  }
  get yClip(){
    return this.get('padding').top;
  }
  calculateHeightClip(){
    const height = this.get('height');
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;

    return height - paddingBottom - paddingTop;
  }
  calculateWidthClip(){
    const width = this.get('width');
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;

    return width - paddingLeft - paddingRight + (this.calculateBarWidth() / 2);
  }
}