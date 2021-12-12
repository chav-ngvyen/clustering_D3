let dataset, labels

const margin = {left: 0, top: 100, bottom: 0, right: 0}
// const width = 1000 - margin.left - margin.right
// const height = 1000 - margin.top - margin.bottom

const height =  window.innerHeight
const width = window.innerWidth

const svg_height = height
const svg_width = svg_height*0.85

//svg
let svg = d3.select("svg")
    .attr('width',svg_width)
    .attr('height',svg_height)

let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);

// Read in data
d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
    d3.json("GeoJSON/labeled.geojson").then(function(l){
        dataset = d
        labels = l
    console.log(dataset)
    console.log(labels)
})});

// Function to clear points
function clean_points(){
    let svg = d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(10000)
    .remove()
};

// Function to clear map
function clean_grid(){
    let svg = d3.select("svg")
    .selectAll("path")
    .transition()
    .duration(10000)
    .remove()
};

// Function to draw points 
function draw_points(){
    projection.fitSize([svg_width, svg_height],dataset);
    svg.selectAll("circle")
        .data(labels.features)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return projection(d.geometry.coordinates)[0] })
        .attr("cy", function(d) { return projection(d.geometry.coordinates)[1] })
        .attr("r", 3.5)
        .attr("stroke","white")
        .attr("stroke-width",0.5)
        .attr("fill","white")
        .transition()
        .duration(5000)
};

var color  = d3.scaleOrdinal().domain([0,19]).range(d3.schemeSet2);

function color_points1(){
    svg.selectAll("circle")
    .transition()
    .duration(1000)
    //.delay(500)
    // .attr("", path)
    .attr("stroke","black")
    .attr("stroke-width",0.5)
    .style("fill", function(d) {
        if (d.properties.labels[1] !=-1) {
            return color(d.properties.labels[1]);
        } else {
            return "transparent"
        }
     })
    .style("stroke", function(d) {
        if (d.properties.labels[1] ==-1) {
            return "white";
        }
     })
};
    

var color  = d3.scaleOrdinal().domain([0,55]).range(d3.schemeSet2);

function color_points2(){
    svg.selectAll("circle")
    .transition()
    .duration(1000)
    //.delay(500)
    // .attr("", path)
    .attr("stroke","black")
    .attr("stroke-width",0.5)
    .style("fill", function(d) {
        if (d.properties.labels[2] !=-1) {
            return color(d.properties.labels[2]);
        } else {
            return "transparent"
        }
     })
     .style("stroke", function(d) {
        if (d.properties.labels[2] ==-1) {
            return "white";
        }
     })
}

var color  = d3.scaleOrdinal().domain([0,48]).range(d3.schemeSet2);

function color_points3(){
    svg.selectAll("circle")
    .transition()
    .duration(1000)
    //.delay(500)
    // .attr("", path)
    .attr("stroke","black")
    .attr("stroke-width",0.5)
    .style("fill", function(d) {
        if (d.properties.labels[3] !=-1) {
            return color(d.properties.labels[3]);
        } else {
            return "transparent"
        }
     })
     .style("stroke", function(d) {
        if (d.properties.labels[3] ==-1) {
            return "white";
        }
     })
}

var color  = d3.scaleOrdinal().domain([0,143]).range(d3.schemePaired);
 
function color_points4(){
    svg.selectAll("circle")
    .transition()
    .duration(2000)
    //.delay(500)
    // .attr("", path)
    .attr("stroke","black")
    .attr("stroke-width",0.5)
    .style("fill", function(d) {
        if (d.properties.labels[4] !=-1) {
            return color(d.properties.labels[4]);
        } else {
            return "transparent"
        }
     })
     .style("stroke", function(d) {
        if (d.properties.labels[4] ==-1) {
            return "white";
        }
     })
};


//  Function to draw DC map   
function grid(){
    projection.fitSize([svg_width, svg_height],dataset);
    svg.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        // .style("stroke", "black")            
        .attr("d", path)
        .style("stroke", "black")
        .style("fill", "transparent") 
        .transition()
        .duration(2000)  
};

// Waypoints scroll constructor
function scroll(n, offset, func1, func2){
  return new Waypoint({
    element: document.getElementById(n),
    handler: function(direction) {
       direction == 'down' ? func1() : func2();
       direction == 'up' ? func2() : func1();
    },
    //start 75% from the top of the div
    offset: offset
  });
};


new scroll('drawpoints',"50%", draw_points, clean_points);
new scroll('drawmap', "50%", grid, clean_grid);
new scroll('colorpoints1', "50%", color_points1, draw_points);
new scroll('colorpoints2', "50%", color_points2, color_points1);
new scroll('colorpoints3', "50%", color_points3, color_points2);
new scroll('colorpoints4', "50%", color_points4, color_points3);



