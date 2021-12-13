let dc, reset;

const margin = {left: 0, top: 100, bottom: 0, right: 0}

// Height and width of browser
const height =  window.innerHeight
const width = window.innerWidth

const svg_height = height
const svg_width = svg_height*0.85

// Coords for Dupont circle [lon, lat]




// Projection and path
let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);

d3.json("GeoJSON/labeled.geojson").then(function(l){
d3.json("GeoJSON/Neighborhood_Clusters.json").then(function(json){
  d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(geo){
  dc = geo;
  topo = json;
  labels = l;

  console.log("geojson file", dc);
  console.log("topojson file", dc);


  // Topojson stuff
  neighborhoods = topojson.feature(topo, topo.objects.Neighborhood_Clusters).features;
  dupont = neighborhoods[13];
  console.log("dupont", dupont);
  console.log(neighborhoods);

 // Define the SVG
  let svg = d3.select("svg")
    .attr('width',svg_width)
    .attr('height',svg_height)
    .on("click", reset);

  const g = svg.append("g")
    .attr("stroke", "blue")
    .attr("cursor", "grab");  

  const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

  function draw_points(){
    projection.fitSize([svg_width, svg_height],dc);
    g.selectAll("circle")
        .data(labels.features)
        .enter()
        .append("circle").raise()
        .attr("cx", function(d) { return projection(d.geometry.coordinates)[0] })
        .attr("cy", function(d) { return projection(d.geometry.coordinates)[1] })
        .attr("r", 4)
        .attr("stroke","white")
        .attr("stroke-width",0.5)
        .attr("fill","transparent")
        .transition()
        .duration(5000)
    };
  
    //  Function to draw DC map   
  function draw_map(){
      svg.selectAll("path")
          .data(dataset.features)
          .enter()
          .append("path")
          .attr("d", path).lower()
          .style("stroke", "white")
          .style("fill", "transparent") 
          .transition()
          .duration(3000)  
  };

  function allow_zoom(){


  projection.fitSize([svg_width, svg_height],dc);
  const clusters = g.append("g")
  .attr("fill", "#444")
  .attr("cursor", "pointer")
    .selectAll("path")
    .data(dc.features)
    .join("path")
    .on("click", clicked)
    .attr("d", path).lower();

    g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path).lower();


  // center = path.centroid(dupont);
  // console.log(center);
  // bounds = path.bounds(dupont);
  // console.log(bounds);
  // padding = 10;
  // start = [center[0], center[1], bounds[1][1] + padding - bounds[0][1] + padding];
  // console.log("start",start);
  // end = [svg_width / 2, svg_height / 2, svg_width / 2];
  // console.log("end",end);
  // k = Math.min(svg_width, svg_height) / start[2];
  // console.log("k",k);
  // translate = [svg_width / 2 - start[0] * k, svg_height / 2 - start[1] * k]
  // transformEnd = `translate(${translate}) scale(${k})`


  svg.call(zoom);

  function reset() {
    clusters.transition().style("fill", null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
  }

  // function clicked(event, d) {
  //   const [[x0, y0], [x1, y1]] = path.bounds(d);
  //   event.stopPropagation();
  //   clusters.transition().style("fill", null);
  //   d3.select(this).transition().style("fill", "red");
  //   svg.transition().duration(750).call(
  //     zoom.transform,
  //     d3.zoomIdentity
  //       .translate(width / 2, height / 2)
  //       .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
  //       .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
  //     d3.pointer(event, svg.node())
  //   );
  // }

    function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    clusters.transition().style("fill", null);
    d3.select(this).transition().style("fill", "red");
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(svg_width / 2, svg_height / 2)
        .scale(Math.min(5, 0.5 / Math.max((x1 - x0) / svg_width, (y1 - y0) / svg_height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
  }


  function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }
}

})})});