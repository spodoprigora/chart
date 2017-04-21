
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

  setConfig(){

    this.render();
  },

  render: function(){
    let id = this.model.get('id');
    let size = this.model.get('size');
    let color = this.model.get('color');
    let quadrant = this.model.get('quadrant');
    let type = this.model.get('type');

    this.data = this.model.prepareData(this.data);

    let container = d3.select('#' + id);
    if(container.empty()){
      container = d3.select('body')
        .append('div')
        .attr('id', id);
    }

    let svg = container.select("svg");
    if(svg.empty()){
      svg = this._createContainer(container, type, size);
    }
    else{
      this._updateChart(svg, color);
      return false;
    }

    let wrapper = this._createWrapper(svg, type, size, quadrant);

    this._appendXAxis(wrapper);
    this._appendYAxis(wrapper);

    this._appendBar(wrapper, color);
  },

  _createContainer: function(container, type, size){
    let svg = container.append("svg");

    if(type === "horizontal"){
      svg.attr("width", size.height)
        .attr("height", size.width);
    }
    else{
      svg.attr("width", size.width)
        .attr("height", size.height);
    }
    return svg;
  },

  _createWrapper: function(svg, type, size, quadrant){
    let wrapper = svg.append("g")
      .attr("class", "wrapper");

    //rotate wrapper
    if(type === "horizontal"){
      if(quadrant === 1 || quadrant === 3){
        wrapper.attr("transform", "translate(" + size.height + ", 0) rotate(90)");
      }
      else{
        wrapper.attr("transform", "translate(0, " + size.width + ") rotate(-90)");
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

  _appendBar: function(wrapper, color){
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
      .attr("fill", color);

    g.append("text")
      .text(d => d.value)
      .attr("x", this.model.calculateXTextPosition())
      .attr("y", this.model.calculateYTextPosition())
      .attr("text-anchor", "middle")
      .attr("transform", this.model.calculateTextRotate());

  },

  _updateChart: function(svg, color){
    let wrapper = svg.select(".wrapper");
    if(!wrapper.empty()){

      let bar = wrapper.selectAll("g.bar")
        .data(this.data);

      this._updateXAxis(wrapper);
      this._updateYAxis(wrapper);

      this._enterBar(bar, color);
      this._updateBar(bar);
      this._exitBar(bar);

    }
  },

  _updateXAxis(wrapper){
    wrapper.select(".x.axis")
      .transition()
      .duration(1000)
      .call(this.model.xAxisConfig())
      .selectAll("text")
      .attr("transform", "rotate(" + this.model.getAxisTextAngle() + ")")
      .style("text-anchor", this.model.getXAxisTextAnchor());
  },

  _updateYAxis(wrapper){
    wrapper.select(".y.axis")
      .transition()
      .duration(1000)
      .call(this.model.yAxisConfig())
      .attr("transform", this.model.calculateYAxisPosition())
      .selectAll("text")
      .attr("transform", "rotate(" + this.model.getAxisTextAngle() + ")")
      .style("text-anchor", "middle")
      .attr("dy", this.model.getYAxisTextDy());
  },

  _enterBar(bar, color){

    let g = bar.enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", this.model.getEnterPositionTranslate());

    g.append("rect")
      .attr("width", this.model.calculateBarWidth())
      .attr("height", this.model.calculateBarHeight())
      .attr("fill", color);

    g.append("text")
      .text(d => d.value)
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
      .text(d => d.value)
      .attr("y", this.model.calculateYTextPosition())
      .attr("x", this.model.calculateXTextPosition())
      .attr("transform", this.model.calculateTextRotate());
  },

  _exitBar(bar){
    bar.exit()
      .transition()
      .delay( this.model.calculateDelay(500) )
      .duration(1000)
      .attr("transform", this.model.getExitPositionTranslate())
      .remove();
  }

});