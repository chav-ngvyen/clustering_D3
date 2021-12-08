// Global variables
// let svg, dataset, projection, path
// let links, nodes


// Visualization parameters
const margin = {left: 0, top: 50, bottom: 50, right: 50}
const width = 800 - margin.left - margin.right
const height = 800 - margin.top - margin.bottom

// var svg = d3.select("#vis")
//   .append("svg")
//   .attr("width",width)  // apply width,height to svg
//   .attr("height",height);

let projection = d3.geoMercator();
const path = d3.geoPath().projection(projection);
var svg = d3.select("#vis")
        .append('svg')
        .attr('width', 700)
        .attr('height', 750);

d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
    dataset = d
    console.log(dataset)
    drawInitial()
});

function drawInitial(){
    projection.fitSize([width/2,height/2],dataset);
    svg.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "navy")
        .style("stroke", "yellow");
}

function draw1(){
    let svg = d3.select("#vis")
    .select('svg')
    .attr('width', 800)
    .attr('height', 750)
    projection.fitSize([width/2,height/2],dataset);
    svg.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)
        .transition()
        .style("fill", "black")
        .style("stroke", "yellow");
}

function draw2(){
    projection.fitSize([width/2,height/2],dataset);
    svg.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "red")
        .style("stroke", "yellow");
}

function draw3(){
    projection.fitSize([width/2,height/2],dataset);
    svg.selectAll("path")
        .data(dataset.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "white")
        .style("stroke", "yellow");}



//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')

}

let activationFunctions = [
    drawInitial,
    draw1,
    draw2,
    draw3,

]

// This specifies that scrolling occurs over the 'graphic' div that contains the text content on the left side.
let scroll = scroller()
    .container(d3.select('#graphic'))

scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})


// // d3.json("GeoJSON/Neighborhood_Clusters.geojson",
// //     function(data) { 
// //       projection.fitSize([width/2,height/2],data); // adjust the projection to the features
// //       svg.selectAll("path")
// //       .data(data.features)
// //       .enter()
// //       .append("path")
// //       .attr("d", path)
// //       .style("fill", "navy")
// //       .style("stroke", "yellow"); // draw the features
// // })

// // // Global variables
// // let svg, dataset, simulation
// // let links, nodes

// // // Visualization parameters
// // const margin = {left: 50, top: 50, bottom: 50, right: 50}
// // const width = 800 - margin.left - margin.right
// // const height = 800 - margin.top - margin.bottom

// // // Coordinates were already rescaled to [-1 . 1] in previous processing
// // // Set domain to +0.05 to prevent node cut off

// // var x_scale = d3.scaleLinear()
// //     .domain([-1.05, 1.05])
// //     .range([0, margin.left + width + margin.right])

// // var y_scale = d3.scaleLinear()
// //     .domain([-1.05,  1.05])
// //     .range([margin.top + height, margin.top])


// // var projection = d3.geoMercator();
// // var path = d3.geoPath().projection(projection);
// // // Read in DC Metro Graph data and perform the following function to draw it
// // d3.json("GeoJSON/Neighborhood_Clusters.geojson")
// //     .then(function(d){
// //         dataset = d
// //         console.log(dataset)
// //         drawInitial()
// //     });

// // function drawInitial(){

// //     // Append the svg object to the body of the page, the 'vis' div
// //     let svg = d3.select("#vis")
// //         .append('svg')
// //         .attr('width', width)
// //         .attr('height', height)
    
// //     // Initialize the links
// //     projection.fitSize([width,height],data)
// //     svg.append("path").attr("d", path(dataset))
// // }

// // This specifies that scrolling occurs over the 'graphic' div that contains the text content on the left side.
// let scroll = scroller()
//     .container(d3.select('#graphic'))

// scroll()

// scroll.on('active', function(index){
//     // When index in inactive, opacity is reduced for the fade effect
//     d3.selectAll('.step')
//         // This transition call specifies over how much time the fade effect should occur.
//         // It specifies a duration of 500ms
//         .transition().duration(500)
//         .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});

//     // Compared to Chow's version, I've stripped out code related to various activations of his visualization for now.
// })