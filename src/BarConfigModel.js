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
  }

  setOldData (oldData) {
    this.oldData = oldData;
  }

  setConfig (config) {
    this.set(config);
  }

  prepareData (data) {
    const clearData = [];
    const { group, key } = this.getAccessor('y');

    _.forEach(data, (v) => {
      if (v[group][key] < 0 || v[group][key] === undefined) {
        v[group][key] = 0;
        clearData.push(v);
      } else {
        clearData.push(v);
      }
    });
    return clearData;
  }

  getAccessor (axis) {
    const accessor = this.get(axis).accessor;
    const args = accessor.split('.');
    const group = args[0];
    const key = args[1];

    return { group, key };
  }

  xScaleConfig () {
    const data = this.data;
    const scale = this.get('x').scale;
    const xScale = d3[scale]();
    const width = this.get('width');
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;
    const quadrant = this.get('quadrant');
    const placement = this.get('placement');
    const { group, key } = this.getAccessor('x');

    if (placement === 'horizontal') {
      xScale.domain([d3.max(data, d => d[group][key]), d3.min(data, d => d[group][key])]);
    } else {
      xScale.domain([d3.min(data, d => d[group][key]), d3.max(data, d => d[group][key])]);
    }

    if (quadrant === 1 || quadrant === 4) {
      xScale.range([paddingLeft, width - paddingRight - (this.calculateBarWidth() / 2)]);
    } else {
      xScale.range([width - paddingRight - (this.calculateBarWidth() / 2), paddingLeft]);
    }
    return xScale;
  }
  yScaleConfig () {
    const data = this.data;
    const { group, key } = this.getAccessor('y');
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;
    const quadrant = this.get('quadrant');
    const height = this.get('height');

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[group][key])]);

    if (quadrant === 1 || quadrant === 2) {
      yScale.range([height - paddingBottom, paddingTop]);
    } else {
      yScale.range([paddingTop, height - paddingBottom]);
    }
    return yScale;
  }
  oldYScaleConfig () {
    const data = this.oldData;
    const { group, key } = this.getAccessor('y');
    const quadrant = this.get('quadrant');
    const height = this.get('height');
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;

    const oldYScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[group][key])]);

    if (quadrant === 1 || quadrant === 2) {
      oldYScale.range([height - paddingBottom, paddingTop]);
    } else {
      oldYScale.range([paddingTop, height - paddingBottom]);
    }

    return oldYScale;
  }

  xAxisConfig () {
    let xAxis;
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
    const { group, key } = this.getAccessor('y');

    if (quadrant === 1 || quadrant === 2) {
      barHeight = d => height - paddingBottom - this.yScaleConfig()(d[group][key]);
    } else {
      barHeight = d => this.yScaleConfig()(d[group][key]) - paddingTop;
    }

    return barHeight;
  }

  _calculateXBarPosition () {
    let xPosition;
    const quadrant = this.get('quadrant');
    const barWidth = this.calculateBarWidth();
    const { group, key } = this.getAccessor('x');
    const placement = this.get('placement');

    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 4) {
        xPosition = d => this.xScaleConfig()(d[group][key]) - (barWidth / 2);
      } else {
        xPosition = d => this.xScaleConfig()(d[group][key]);
      }
    } else if (quadrant === 1 || quadrant === 4) {
      xPosition = d => this.xScaleConfig()(d[group][key]);
    } else {
      xPosition = d => this.xScaleConfig()(d[group][key]) - (barWidth / 2);
    }

    return xPosition;
  }
  _calculateYBarPosition () {
    let yPosition;
    const quadrant = this.get('quadrant');
    const paddingTop = this.get('padding').top;
    const { group, key } = this.getAccessor('y');

    if (quadrant === 1 || quadrant === 2) {
      yPosition = d => this.yScaleConfig()(d[group][key]);
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
    const { group, key } = this.getAccessor('y');

    if (quadrant === 1 || quadrant === 2) {
      yTextPosition = () => 13;
    } else {
      yTextPosition = d => this.yScaleConfig()(d[group][key]) - paddingTop - 13;
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
    const { group, key } = this.getAccessor('y');

    if (quadrant === 1 || quadrant === 2) {
      yPosition = d => this.yScaleConfig()(d[group][key]);
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
    const { group, key } = this.getAccessor('y');

    if (quadrant === 1 || quadrant === 2) {
      yPosition = d => this.oldYScaleConfig()(d[group][key]);
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
}