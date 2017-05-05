let NavigationView = Backbone.View.extend({

  setData(data){
    this.data = data;
    this.model.setData(data);
    this.render();
  },

  render(){
    let id = this.model.get('id');
    let height = this.model.get('height');
    let width = this.model.get('width');
    let quadrant = this.model.get('quadrant');
    let placement = this.model.get('placement');

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
    else {
      return this._updateNavigtion(svg);
    }

    let wrapper = this._createWrapper(svg, placement, height, width, quadrant);

    this.brush = d3.brushX()
      .extent(this.model.configBrushExtent())
      .on("brush", this.brushed.bind(this));

    wrapper.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    this.reset();
  },
  _updateNavigtion(svg){
   /* svg.remove();
    this.render()*/
  },

  _createContainer(container, placement, height, width){
    let svg = container.append('svg')
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
  _createWrapper(svg, placement, height, width, quadrant){
    let wrapper = svg.append("g")
      .attr("class", "wrapper")
      .attr('stroke', 'black')
      .attr('stroke-width', '1');

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

  brushed(){
    const domain = this.model.calculateDomain(d3.event.selection);
    command.execute('refresh', domain);
  },

  reset(){
    d3.select('g.brush')
      .call(this.brush.move, this.model.xScale.range());
  }

});