const BarView = Backbone.View.extend({
  initialize () {
    this.data = [];
  },

  setData (data) {
    this.data = data;
    this.model.setData(data);
    this.render();
    this.model.setOldData(this.data);
  },

  setConfig (config) {
    this.model.setConfig(config);
    this._claerContainer();
    this.render();
  },

  _claerContainer: function () {
    const id = this.model.get('id');
    const container = d3.select(`#${id}`);
    if (!container.empty()) {
      container.remove();
    }
  },

  render () {
    const id = this.model.get('id');
    const height = this.model.get('height');
    const width = this.model.get('width');
    const quadrant = this.model.get('quadrant');
    const placement = this.model.get('placement');

    this.data = this.model.prepareData(this.data);

    let container = d3.select(`#${id}`);
    if (container.empty()) {
      container = d3.select('body')
        .append('div')
        .attr('id', id)
        .attr('class', 'block');
    }

    let svg = container.select('svg');
    if (svg.empty()) {
      svg = this._createContainer(container, placement, height, width);
    } else {
      return this._updateChart(svg,id);
    }

    const wrapper = this._createWrapper(svg, placement, height, width, quadrant);
    svg.on("click", this.clickHandler);

    this._createClipPath(svg, id);

    this._appendXAxis(wrapper);
    this._appendYAxis(wrapper);

    this._appendBar(wrapper, id);

    this._appendXLabel(wrapper);
    this._appendYLabel(wrapper);
    return true;
  },

  clickHandler(){
    command.execute('reset');
  },

  _createContainer (container, placement, height, width) {
    const svg = container.append('svg')
      .attr('style', this.model.getMargin());

    if (placement === 'horizontal') {
      svg.attr('width', height)
        .attr('height', width);
    } else {
      svg.attr('width', width)
        .attr('height', height);
    }
    return svg;
  },

  _createWrapper (svg, placement, height, width, quadrant) {
    const wrapper = svg.append('g')
      .attr('class', 'wrapper');

    // rotate wrapper
    if (placement === 'horizontal') {
      if (quadrant === 1 || quadrant === 3) {
        wrapper.attr('transform', `translate(${height}, 0) rotate(90)`);
      } else {
        wrapper.attr('transform', `translate(0, ${width}) rotate(-90)`);
      }
    }
    return wrapper;
  },

  _createClipPath(svg, id){
    svg.append("clipPath")
      .attr("id", `clip-${id}`)
      .append('rect')
      .attr('x', this.model.xClip)
      .attr('y', this.model.yClip)
      .attr('height', this.model.calculateHeightClip())
      .attr('width', this.model.calculateWidthClip());
  },

  _appendXAxis (wrapper) {
    wrapper.append('g')
      .attr('class', 'x axis')
      .attr('transform', this.model.calculateXAxisPosition())
      .call(this.model.xAxisConfig())
      .selectAll('text')
      .attr('transform', `rotate( ${this.model.getAxisTextAngle()} )`)
      .style('text-anchor', this.model.getXAxisTextAnchor());
  },
  _appendYAxis (wrapper) {
    wrapper.append('g')
      .attr('class', 'y axis')
      .attr('transform', this.model.calculateYAxisPosition())
      .call(this.model.yAxisConfig())
      .selectAll('text')
      .attr('transform', `rotate( ${this.model.getAxisTextAngle()} )`)
      .style('text-anchor', 'middle')
      .attr('dy', this.model.getYAxisTextDy());
  },

  _appendBar (wrapper,id) {
    const accessor = this.model.get('y').accessor;
    const clip = wrapper.append('g')
      .attr('class', 'clip')
      .attr('clip-path', `url("#clip-${id}")`);

    const bar = clip.selectAll('g.bar')
      .data(this.data);

    // Enter
    const g = bar.enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', this.model.calculateBarTransform());

    g.append('rect')
      .attr('width', this.model.calculateBarWidth())
      .attr('height', this.model.calculateBarHeight())
      .attr('fill', this.model.getColor());

    g.append('text')
      .text(d => _.get(d, accessor))
      .attr('x', this.model.calculateXTextPosition())
      .attr('y', this.model.calculateYTextPosition())
      .attr('text-anchor', 'middle')
      .attr('transform', this.model.calculateTextRotate());
  },

  _updateChart (svg, id) {
    const wrapper = svg.select('.wrapper');
    const clip = wrapper.select('.clip');

    this._updateClipPath(svg, id);

    const bar = clip.selectAll('g.bar')
      .data(this.data);

    this._updateXAxis(wrapper);
    this._updateYAxis(wrapper);

    this._enterBar(bar);
    this._updateBar(bar);
    this._exitBar(bar);

  },

  _updateClipPath(svg, id){
     svg.select(`#clip-${id} rect`)
       .attr('width', this.model.calculateWidthClip());
  },
  _updateXAxis (wrapper) {
    wrapper.select('.x.axis')
      .transition()
      .duration(1000)
      .call(this.model.xAxisConfig())
      .attr('transform', this.model.calculateXAxisPosition())
        .selectAll('text')
        .attr('transform', `rotate( ${this.model.getAxisTextAngle()} )`)
        .style('text-anchor', this.model.getXAxisTextAnchor());
  },
  _updateYAxis (wrapper) {
    wrapper.select('.y.axis')
      .transition()
      .duration(1000)
      .call(this.model.yAxisConfig())
        .selectAll('text')
        .attr('transform', `rotate( ${this.model.getAxisTextAngle()} )`)
        .attr('dy', this.model.getYAxisTextDy());
  },

  _enterBar (bar) {
    let accessor = this.model.get('y').accessor;

    const g = bar.enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', this.model.getEnterPositionTranslate());

    g.append('rect')
      .attr('width', this.model.calculateBarWidth())
      .attr('height', this.model.calculateBarHeight())
      .attr('fill', this.model.getColor());

    g.append('text')
      .text(d =>_.get(d, accessor))
      .attr('x', this.model.calculateXTextPosition())
      .attr('y', this.model.calculateYTextPosition())
      .attr("text-anchor", "middle")
      .attr('transform', this.model.calculateTextRotate());

    g.transition()
      .delay(this.model.calculateDelay(1000))
      .duration(1000)
      .attr('transform', this.model.calculateBarTransform());
  },
  _updateBar (bar) {
    let accessor = this.model.get('y').accessor;
    bar.transition()
      .delay(this.model.calculateDelay(1000))
      .duration(1000)
      .attr('transform', this.model.calculateBarTransform());

    bar.select('rect')
      .transition()
      .delay(this.model.calculateDelay(1000))
      .duration(1000)
      .attr('width', this.model.calculateBarWidth())
      .attr('height', this.model.calculateBarHeight());

    bar.select('text')
      .transition()
      .delay(this.model.calculateDelay(1000))
      .duration(1000)
      .text(d => _.get(d, accessor))
      .attr('y', this.model.calculateYTextPosition())
      .attr('x', this.model.calculateXTextPosition())
      .attr('transform', this.model.calculateTextRotate());
  },
  _exitBar (bar) {
    bar.exit()
      .transition()
      .delay(this.model.calculateDelay(400))
      .duration(1000)
      .attr('transform', this.model.getExitPositionTranslate())
      .remove();
  },

  _appendYLabel (wrapper) {
    wrapper.append('text')
      .attr("text-anchor", "middle")
      .attr('class', 'label')
      .attr('transform', this.model.calculateYLabelTranslate())
      .text(this.model.getYLabel());
  },
  _appendXLabel (wrapper) {
    wrapper.append('text')
      .attr("text-anchor", "middle")
      .attr('class', 'label')
      .attr('transform', this.model.calculateXLabelTranslate())
      .text(this.model.getXLabel());
  },

  refresh(arg){
    let placement = this.model.get('placement');
    const quadrant = this.model.get('quadrant');
    if(placement === 'horizontal'){
        this.model.domain = arg.reverse();
    }
    else{
      this.model.domain = arg
    }
    this.render();
  }
});