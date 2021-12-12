let dataset, labels, color_domain_max

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
        dataset = d;
        labels = l;

    let color_domain_max = labels.features[0]['properties'].domain_max;
    console.log("color domain max", color_domain_max);
    console.log(typeof(color_domain_max));


    console.log(color_domain_max[0])
    console.log(dataset);
    console.log(labels);

    c36 = [ "#5A5156", "#E4E1E3", "#F6222E", "#FE00FA", "#16FF32", "#3B00FB",
    "#3283FE", "#FEAF16", "#B00068", "#1CFFCE", "#90AD1C", "#2ED9FF",
    "#DEA0FD", "#AA0DFE", "#F8A19F", "#325A9B", "#C4451C", "#1C8356",
    "#85660D", "#B10DA1", "#FBE426", "#1CBE4F", "#FA0087", "#FC1CBF",
    "#F7E1A0", "#C075A6", "#782AB6", "#AAF400", "#BDCDFF", "#822E1C",
    "#B5EFB5", "#7ED7D1", "#1C7F93", "#D85FF7", "#683B79", "#66B0FF"] 

    set3 = d3.schemeSet3;
    dark2 = d3.schemeDark2;
    colors = set3.concat(dark2);
    console.log(colors);
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
            .attr("fill","transparent")
            .transition()
            .duration(5000)
        };
     
    // Function to update the color range depending on how many labels (clusters) we got
    function get_color_domain(index){
        let color =  d3.scaleOrdinal().domain([0
            ,color_domain_max[index]])
            .range(colors);
        return color
    };

    // Function to color the points
    function color_points(index){
        color = get_color_domain(index);
        console.log("color", color_domain_max[index]);
        svg.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .style("fill", function(d) {
            if (d.properties.labels[index] !=-1) {
                return color(d.properties.labels[index]);
            } else {
                return "transparent"
            }
         })
        .style("stroke", function(d) {
            if (d.properties.labels[index] ==-1) {
                return "white";
            }
         })
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

    // Functions to update colors for every iteration
    function color_points0(){
        color_points(0)
    };

    function color_points1(){
        color_points(1)
    };

    function color_points2(){
        color_points(2)
    };

    function color_points3(){
        color_points(3)
    };

    function color_points4(){
        color_points(4)
    };

    function color_points5(){
        color_points(5)
    };



    new scroll('welcome',"50%", draw_points, clean_points);
    new scroll('test',"50%", color_points0, draw_points);
    new scroll('test1',"50%", color_points1, color_points0);
    new scroll('test2',"50%", color_points2, color_points1);
    new scroll('test3',"50%", color_points3, color_points2);
    new scroll('test4',"50%", color_points4, color_points3);
    new scroll('test5',"50%", color_points5, color_points4);


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

// // Function to draw points 
// function draw_points(){
//     projection.fitSize([svg_width, svg_height],dataset);
//     svg.selectAll("circle")
//         .data(labels.features)
//         .enter()
//         .append("circle")
//         .attr("cx", function(d) { return projection(d.geometry.coordinates)[0] })
//         .attr("cy", function(d) { return projection(d.geometry.coordinates)[1] })
//         .attr("r", 3.5)
//         .attr("stroke","white")
//         .attr("stroke-width",0.5)
//         .attr("fill","white")
//         .transition()
//         .duration(5000)
// };

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

// function colorInterpolate(data, index) {
//     let max_d = data.features.properties.domain_max[index];
//     let range = [0, max_d];
//     return d3.scaleSequential().domain(range).interpolator(d3.interpolateViridis); 
// }

// colorInterpolate(labels, 1);

// let test = color_domain_max[0]
// console.log("is this working?", test)

// function color_points(index){
//     // .data(labels.features)
//     // .enter();
//     var color = d3.scaleOrdinal().domain([0,color_domain_max[index]]).range(d3.schemePaired);
//     console.log(color);
//     svg.selectAll("circle")
//     .transition()
//     .duration(2000)
//     .attr("stroke","black")
//     .attr("stroke-width",0.5)
//     .style("fill", function(d) {
//         // var color = d3.scaleOrdinal().domain([
//         //     0,
//         //     d.properties.domain_max[index]])
//         //     .range(d3.schemePaired);
//         if (d.properties.labels[index] !=-1) {
//             return color(d.properties.labels[index]);
//         } else {
//             return "transparent"
//         }
//      })
// };
// color_points(1)
// console.log(color_points(1));


// function colorP2() {
//     let myColor = update_color(labels.features.properties, 1);
//     svg.selectAll('circle')
//         .data(labels.features)
//         .attr("fill", function(d) {
//                 return myColor(d.properties.labels[index]);
//             })
// }

// colorP2();


// // Waypoints scroll constructor
// function scroll(n, offset, func1, func2){
//     return new Waypoint({
//       element: document.getElementById(n),
//       handler: function(direction) {
//          direction == 'down' ? func1() : func2();
//          direction == 'up' ? func2() : func1();
//       },
//       //start 75% from the top of the div
//       offset: offset
//     });
//   };

// new scroll('welcome',"50%", draw_points, clean_points);
// new scroll('test',"50%", update_color, draw_points);


// new scroll('drawpoints',"50%", draw_points, clean_points);
// new scroll('drawmap', "50%", grid, clean_grid);
// new scroll('colorpoints1', "50%", color_points, draw_points);
// new scroll('colorpoints1', "50%", color_points1, draw_points);
// new scroll('colorpoints2', "50%", color_points2, color_points1);
// new scroll('colorpoints3', "50%", color_points3, color_points2);
// new scroll('colorpoints4', "50%", color_points4, color_points3);



