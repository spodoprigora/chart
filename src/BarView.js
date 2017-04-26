
let BarView = Backbone.View.extend({
  initialize: function(){
    this.data = [];
  },

  setData(data){
    this.data = data;
    this.model.setData(data);
    this.render();
    this.model.setOldData(this.data);
  },

  setConfig(config){
    this.model.setConfig(config);
    this.render();
  },

  render: function(){
    let id = this.model.get('id');
    let height = this.model.get('height');
    let width = this.model.get('width');
    let quadrant = this.model.get('quadrant');
    let placement = this.model.get('placement');

    this.data = this.model.prepareData(this.data);

    let container = d3.select('#' + id);
    if(container.empty()){
      container = d3.select('body')
        .append('div')
        .attr('id', id);
    }

    let svg = container.select("svg");
    if(svg.empty()){
      svg = this._createContainer(container, placement, height, width);
    }
    else{
      this._updateChart(svg);
      return false;
    }

    let wrapper = this._createWrapper(svg, placement, height, width, quadrant);

    this._appendXAxis(wrapper);
    this._appendYAxis(wrapper);

    this._appendBar(wrapper);

    this._appendXLabel(wrapper);
    this._appendYLabel(wrapper);
  },

  _createContainer: function(container, placement, height, width){
    let svg = container.append("svg")
      .attr('style', this.model.getMargin());

    if(placement === "horizontal"){
      svg.attr("width", height)
        .attr("height", width);
    }
    else{
      svg.attr("width", width)
        .attr("height", height);
    }
    return svg;
  },

  _createWrapper: function(svg, placement, height, width, quadrant){
    let wrapper = svg.append("g")
      .attr("class", "wrapper");

    //rotate wrapper
    if(placement === "horizontal"){
      if(quadrant === 1 || quadrant === 3){
        wrapper.attr("transform", "translate(" + height + ", 0) rotate(90)");
      }
      else{
        wrapper.attr("transform", "translate(0, " + width + ") rotate(-90)");
      }
    }
    return wrapper;
  },

  _appendXAxis: function(wrapper){
    wrapper.append("g")
      .attr("class", "x axis")
      .attr("transform", this.model.calculateXAxisPosition())
      .call(this.model.xAxisConfig())
      .selectAll("text")
      .attr("transform", "rotate(" + this.model.getAxisTextAngle() + ")")
      .style("text-anchor", this.model.getXAxisTextAnchor());
  },
  _appendYAxis: function(wrapper){
    wrapper.append("g")
      .attr("class", "y axis")
      .attr("transform", this.model.calculateYAxisPosition())
      .call(this.model.yAxisConfig())
      .selectAll("text")
      .attr("transform", "rotate(" + this.model.getAxisTextAngle() + ")")
      .style("text-anchor", "middle")
      .attr("dy", this.model.getYAxisTextDy());
  },

  _appendBar: function(wrapper){
    let {group, key} = this.model.getAccessor('y');
    let bar = wrapper.selectAll("g.bar")
      .data(this.data);

    //Enter
    let g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", this.model.calculateBarTransform());

    g.append("rect")
      .attr("width", this.model.calculateBarWidth())
      .attr("height", this.model.calculateBarHeight())
      .attr("fill", this.model.getColor());

    g.append("text")
      .text(d => d[group][key])
      .attr("x", this.model.calculateXTextPosition())
      .attr("y", this.model.calculateYTextPosition())
      .attr("text-anchor", "middle")
      .attr("transform", this.model.calculateTextRotate());

  },

  _updateChart: function(svg){
    let wrapper = svg.select(".wrapper");
    if(!wrapper.empty()){

      let bar = wrapper.selectAll("g.bar")
        .data(this.data);

      this._updateXAxis(wrapper);
      this._updateYAxis(wrapper);

      this._enterBar(bar);
      this._updateBar(bar);
      this._exitBar(bar);

    }
  },

  _updateXAxis(wrapper){
    wrapper.select(".x.axis")
      .transition()
      .duration(1000)
      .call(this.model.xAxisConfig())
      .attr("transform", this.model.calculateXAxisPosition())
      .selectAll("text")
      .attr("transform", "rotate(" + this.model.getAxisTextAngle() + ")")
      .style("text-anchor", this.model.getXAxisTextAnchor());
  },
  _updateYAxis(wrapper){
    wrapper.select(".y.axis")
      .transition()
      .duration(1000)
      .call(this.model.yAxisConfig())
      .selectAll("text")
      .attr("transform", "rotate(" + this.model.getAxisTextAngle() + ")")
      .style("text-anchor", "middle")
      .attr("dy", this.model.getYAxisTextDy());
  },

  _enterBar(bar){
    let {group, key} = this.model.getAccessor('y');
    let g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", this.model.getEnterPositionTranslate());

    g.append("rect")
      .attr("width", this.model.calculateBarWidth())
      .attr("height", this.model.calculateBarHeight())
      .attr("fill", this.model.getColor());

    g.append("text")
      .text(d => d[group][key])
      .attr("x", this.model.calculateXTextPosition())
      .attr("y", this.model.calculateYTextPosition())
      .attr("text-anchor", "middle")
      .attr("transform", this.model.calculateTextRotate());

    g.transition()
      .delay( this.model.calculateDelay(1000) )
      .duration(1000)
      .attr("transform", this.model.calculateBarTransform());

  },
  _updateBar(bar){
    let {group, key} = this.model.getAccessor('y');
    bar.transition()
      .delay( this.model.calculateDelay(1000) )
      .duration(1000)
      .attr("transform", this.model.calculateBarTransform());

    bar.select("rect")
      .transition()
      .delay( this.model.calculateDelay(1000) )
      .duration(1000)
      .attr("width", this.model.calculateBarWidth())
      .attr("height", this.model.calculateBarHeight());

    bar.select("text")
      .transition()
      .delay( this.model.calculateDelay(1000) )
      .duration(1000)
      .text(d => d[group][key])
      .attr("y", this.model.calculateYTextPosition())
      .attr("x", this.model.calculateXTextPosition())
      .attr("transform", this.model.calculateTextRotate());
  },
  _exitBar(bar){
    bar.exit()
      .transition()
      .delay( this.model.calculateDelay(400) )
      .duration(1000)
      .attr("transform", this.model.getExitPositionTranslate())
      .remove();
  },

  _appendYLabel(wrapper){
    wrapper.append("text")
      .attr("text-anchor", "middle")
      .attr("class", 'label')
      .attr("transform", this.model.calculateYLabelTranslate())
      .text(this.model.getYLabel());
  },
  _appendXLabel(wrapper){
    wrapper.append("text")
      .attr("text-anchor", "middle")
      .attr("class", 'label')
      .attr("transform", this.model.calculateXLabelTranslate())
      .text(this.model.getXLabel());
  }

});