class NavigationConfigModel extends ContrailModel{
  get defaults(){ return {
    id: 'navigator',
    height: 200,
    width: 500,
    barPadding: 1,
    padding:{
      top: 0,
      left:0,
      bottom: 0,
      right: 0
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

    placement: 'vertical',
  }}

  initialize(){
    this.data = [];

  }

  setData(data){
    this.data = data;
    this.xScale = null;
    this.xScale = this.calculateXScale();
  }

  getMargin(){
    let margin = this.get('margin');
    let top = margin.top === undefined ? '0px' : margin.top + "px";
    let right = margin.right === undefined ? '0px' : margin.right + "px";
    let bottom = margin.bottom === undefined ? '0px' : margin.bottom + "px";
    let left = margin.left === undefined ? '0px' : margin.left + "px";

    return "margin: " + top + " " +  right + " " + bottom + " " + left;
  }

  calculateBarWidth(){
    let data = this.data;
    let width = this.get('width');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let barPadding = this.get('barPadding');

    return ((width - paddingLeft - paddingRight)/(data.length)) - barPadding;
  }
  calculateXScale (){
    if(this.xScale) return this.xScale;

    let data = this.data;
    let scale = this.get('x').scale;
    let xScale = d3[scale]();
    let width = this.get('width');
    let paddingLeft = this.get('padding').left;
    let paddingRight = this.get('padding').right;
    let placement = this.get('placement');
    let accessor = this.get('x').accessor;

    if( placement === 'horizontal' ){
      xScale.domain([d3.max(data, d => _.get(d, accessor)), d3.min(data, d => _.get(d, accessor))]);
    }
    else{
      xScale.domain([d3.min(data, d => _.get(d, accessor)), d3.max(data, d => _.get(d, accessor))]);
    }

    xScale.range([paddingLeft, width - paddingRight -(this.calculateBarWidth()/2)]);

    return xScale;
  }

  configBrushExtent(){
    const paddingLeft = this.get('padding').left;
    const paddingRight = this.get('padding').right;
    const paddingTop = this.get('padding').top;
    const paddingBottom = this.get('padding').bottom;
    const width = this.get('width');
    const height = this.get('height');

    return [[paddingLeft, paddingTop], [(width - paddingRight - (this.calculateBarWidth()/2)), (height - paddingBottom)]];
  }

  calculateDomain(selection){
    return selection.map(this.calculateXScale().invert);
  }
}