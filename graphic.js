let dataset, boundary, points

const margin = {left: 0, top: 100, bottom: 0, right: 0}
const width = 1000 - margin.left - margin.right
const height = 1000 - margin.top - margin.bottom

const svg_height = height*0.75
const svg_width = svg_height*0.80

//svg
    let svg = d3.select("svg");

    //svg width and height
    svg.attr('width',width*0.60)
        .attr('height',svg_height)
        // .style('background','red')


    //set up grid spacing
    //let spacing = 40;
    //let rows = 10;
    //let column = 10;
    //let randnum = (min,max) => Math.round( Math.random() * (max-min) + min );
    
    let projection = d3.geoMercator();
    let path = d3.geoPath().projection(projection);

    // let points = [
    //     {longitude:-77.09543099,latitude:38.94611252},
    //     {longitude:-77.04353969,latitude:38.92211949},
    //     {longitude:-77.03234479,latitude:38.89649258},
    //     {longitude:-77.01515313,latitude:38.913635}
    //     ]
    function clean(){
        let svg = d3.select('svg')
    }    

    d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
        d3.json("GeoJSON/liquor.geojson").then(function(p){
            d3.json("GeoJSON/labeled.geojson").then(function(l){
            dataset = d
            points = p
            labels = l
        console.log(dataset)
            //grid()
    })})});
    

    //Cleaning Function
    //Will hide all the elements which are not necessary for a given chart type 




    // function grid(){
    //     projection.fitSize([width/2,height/2],dataset);
    //     svg.selectAll("path")
    //         .data(dataset.features)
    //         .enter()
    //         .style("fill","navy")
    // }
    // d3.json("GeoJSON/Washington_DC_Boundary.geojson").then(function(b){
    //     boundary = b
    //     console.log(boundary)
    //     drawmap()
    // });

    // function draw_outline(){
    //     projection.fitSize([svg_width, svg_height],boundary);
    //     svg.selectAll("path")
    //         .data(boundary.features)
    //         .enter()
    //         .append("path")
    //         .attr("d", path)
    //         .style("stroke", "black")
    //         .style("fill", "transparent")            
    // }    
// // THIS WORKS    
    function grid(){
        projection.fitSize([svg_width, svg_height],dataset);
        svg.selectAll("path")
            .data(dataset.features)
            .enter()
            .append("path")
            // .style("stroke", "black")            
            .attr("d", path)
            .style("stroke", "black")
            .style("fill", "black")            
    }

    // let grid = () =>{
    //     // projection.fitSize([svg_width, svg_height],dataset);
    //    data(dataset.features)
    //         .enter()
    //         svg.append("path")
    //         // .transition()
    //         // .duration(2000)
    //         // .style("stroke", "black")            
    //         .attr("d", path)
    //         .style("stroke", "black")
    //         .style("fill", "orange")            

    // }    

    // let grid = () =>{
    //     projection.fitSize([svg_width, svg_height],dataset);
    //     svg.selectAll("path")
    //         .data(dataset.features)
    //         .enter()
    //         .append("path")
    //         // .style("stroke", "black")            
    //         .attr("d", path)
    //         .style("stroke", "black")
    //         .style("fill", "orange")            

    // }

    // let grid = () =>{
    //     projection.fitSize([width/2,height/2],dataset);
    //     svg.selectAll("path")
    //         .data(dataset.features)
    //         .enter()
    //         .append("path")
    //         .attr("d", path)
    //         .style("fill", "black")
    //         .style("stroke", "black")
    // }


    let grid2 = () =>{
        svg.selectAll("path")
            .transition()
                .duration(2000)
                //.delay(500)
            .attr("d", path)
            .style("fill", "black")
            .style("stroke", "gray")
    }

    let grid3 = () =>{
        svg.selectAll("path")
            .transition()
                .duration(2000)
            .attr("d", path)
            .style("fill", "darkgray")
            .style("stroke", "gray")
    }
    // p1 = [-77.09543099,38.94611252];
    // p2 = [-77.04353969,38.92211949];
    // p3 = [-77.03234479,38.89649258];
    // p4 = [-77.01515313,38.913635];

    // console.log(projection[p1],projection[p2],projection[p3],projection[p4])

    // let circles = () =>{
    //     svg.selectAll("circle")
	// 	.data([p1,p2,p3,p4])
    //     .enter()
	// 	.append("circle")
	// 	.attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
	// 	.attr("cy", function (d) { return projection(d)[1]; })
	// 	.attr("r", "5px")
    //     .attr("stroke","black")
    //     // .transition()
    //     // .delay(5000)
	// 	.attr("fill","transparent")
    // }





    
    // d3.json("GeoJSON/liquor.geojson").then(function(d){
    //     points = d
    //     console.log(points)
    //     });

    function draw_points(){
        projection.fitSize([svg_width, svg_height],dataset);
        svg.selectAll("circle")
            .data(labels.features)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return projection(d.geometry.coordinates)[0] })
            .attr("cy", function(d) { return projection(d.geometry.coordinates)[1] })
            .attr("r", 3)
            .attr("stroke","black")
            .attr("stroke-width",0.5)
            .attr("fill","transparent")
            .transition()
            .duration(5000)
    } 

    var color  = d3.scaleOrdinal().domain([-1,19]).range(d3.schemeTableau10);
 
    function color_points1(){
        svg.selectAll("circle")
        .transition()
        .duration(2000)
        //.delay(500)
        // .attr("", path)
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .style("fill", function(d) {
            return color(d.properties.labels[1]);
         })
    }

    var color  = d3.scaleOrdinal().domain([-1,55]).range(d3.schemeTableau10);
 
    function color_points2(){
        svg.selectAll("circle")
        .transition()
        .duration(2000)
        //.delay(500)
        // .attr("", path)
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .style("fill", function(d) {
            return color(d.properties.labels[2]);
         })
    }

    var color  = d3.scaleOrdinal().domain([-1,48]).range(d3.schemeTableau10);
 
    function color_points3(){
        svg.selectAll("circle")
        .transition()
        .duration(2000)
        //.delay(500)
        // .attr("", path)
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .style("fill", function(d) {
            return color(d.properties.labels[3]);
         })
    }
    var color  = d3.scaleOrdinal().domain([-1,143]).range(d3.schemeTableau10);
 
    function color_points4(){
        svg.selectAll("circle")
        .transition()
        .duration(2000)
        //.delay(500)
        // .attr("", path)
        .attr("stroke","black")
        .attr("stroke-width",0.5)
        .style("fill", function(d) {
            return color(d.properties.labels[4]);
         })
    }

    // .style("fill", function (d) { return color(d.Species) } )
// THIS WORKS
    // d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
    //     dataset = d
    //     console.log(dataset)
    //     drawInitial()
    // });

    // function drawInitial(){
    //     projection.fitSize([width/2,height/2],dataset);
    //     svg.selectAll("path")
    //         .data(dataset.features)
    //         .enter()
    //         .append("path")
    //         .attr("d", path)
    //         .style("fill", "navy")
    //         .style("stroke", "yellow")
    //}
    // function updateMap(){
    //     //Update all rects
    //     svg.selectAll("path")
    //       .data(dataset.features)
    //       .transition() // <---- Here is the transition
    //       .duration(2000)
    //       .append("path")
    //       .attr("d", path)
    //       .style("fill", "black")
    //       .style("stroke", "blue");

    // //Create an array of objects
    // let our_data = d3.range(20).map(i => 
    // ({ 'device': i < 5 ? 'ios' : 'android', 
    //     'city': i < 3 ? 'San Diegan' : 'Out of towners', 
    //     'age': randnum(25, 65)
    // }));


    // //create group and join our data to that group
    // let group = svg.selectAll('g')
    //   .data(our_data)
    //   .enter()
    //   .append("g")



    // //create rectangles
    // let rects = group.append("rect")


    // //city data
    // d3.selectAll('g')
    //   .append("text")
    //   .text( (d) => d["city"])
    //   .attr("fill", "black")
    //   .attr("class", "city")
    //   .attr("dx", -500)



    // //age data
    // d3.selectAll('g')
    //   .append("text")
    //   .text( (d) => d["age"] )
    //   .attr("fill", "#fff")
    //   .attr("class", "age")
    //   .attr("dx", -500)








    // square grid
    // let grid = () =>{
    //   rects
    //     .transition()
    //     .delay((d, i) => 10 * i)
    //     .duration(600)
    //     .ease("elastic")
    //     .attr("width", 20)
    //     .attr("height", 20)
    //     .attr("rx", 5)
    //     .attr("ry", 5)
    //     .attr("x", (d, i) => i % column * spacing)
    //     .attr("y", (d, i) => Math.floor(i / 10) % rows * spacing)
    //     .attr("fill", (d, i) => (i < 40 ? "black" : "red"))
    //     .attr("opacity", "1")
    // }



    // //circle grid
    // let grid2 = () =>{
    //   rects
    //     .transition()
    //     .delay((d, i) => 10 * i)
    //     .duration(600)
    //     .ease("elastic")
    //     .attr("width", 20)
    //     .attr("height", 20)
    //     .attr("rx", "50%")
    //     .attr("ry", "50%")
    //     .attr("x", (d, i) => i % column * spacing)
    //     .attr("y", (d, i) => Math.floor(i / 10) % rows * spacing)
    //     .attr("fill", (d, i) => (i < 8 ? "none" : "white"))
    // }


    // //divide
    // let divide = () =>{
    //   rects
    //     .transition()
    //     .delay((d, i) => 10 * i)
    //     .duration(600)
    //     .ease("elastic")
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .attr("rx", 0)
    //     .attr("ry", 0)
    //     .attr("x", (d, i) => d['device'] == "ios" ? randnum(100, 150) :  randnum(300, 350))
    //     .attr("y", (d, i) => i * 20)
    //     .attr("fill", (d, i) => d['device'] == "ios" ? "#394147": "#99c125")
    //     .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//only show 12 people



    //     //age
    //     d3.selectAll('text.age')
    //       .transition()
    //       .delay( (d,i) => 40*i ) 
    //       .duration(900)
    //       .ease('elastic')
    //       .attr("dx", -500)


    //     //city
    //     d3.selectAll('text.city')
    //       .transition()
    //       .delay( (d,i) => 40*i ) 
    //       .duration(900)
    //       .ease('elastic')
    //       .attr("dx", -500)
    // }





    // //bar cart
    // let barChart = () => {
    //   rects
    //     .attr("rx", 0 )
    //     .attr("ry", 0 )
    //     .transition()
    //     .delay( (d,i) => 20*i ) 
    //     .duration(900)
    //     .ease('elastic')//linear, quad, cubic, sin, exp, circle, elastic, back, bounce
    //     .attr("x", (d,i) => 150 )
    //     .attr("y", (d,i) => i * 17 )
    //     .attr("width", (d,i) => d["age"])
    //     .attr("height", (d,i) => 15)
    //     .attr("fill", (d, i) => (i < 3 ? "#99c125" : "#394147"))
    //     .attr("opacity", 1)
    //     .attr("transform", "translate(0,0) rotate(0)")
    //     .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//only show 12 people


    //   //age text
    //   d3.selectAll('text.age')
    //     .transition()
    //     .delay( (d,i) => 20*i ) 
    //     .duration(900)
    //     .ease('elastic')
    //     //align text right
    //     .attr("text-anchor", "start")
    //     .attr("dx", 160)
    //     .attr("dy", (d,i)=> (i * 17) + 12)
    //     .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//nly show 12 people



    //   //city text
    //   d3.selectAll('text.city')
    //     .transition()
    //     .delay( (d,i) => 20*i ) 
    //     .duration(900)
    //     .ease('elastic')
    //     //align text left
    //     .attr("text-anchor", "end")
    //     .attr("dx", 140)
    //     .attr("dy", (d,i)=> (i * 17) + 12)
    //     .attr("opacity", (d,i)=> i < 12 ? 1 : 0 )//only show 12 people


    // }




    // //waypoints scroll constructor
    function scroll(n, offset, func1, func2){
      return new Waypoint({
        element: document.getElementById(n),
        handler: function(direction) {
           direction == 'down' ? func1() : func2();
        },
        //start 75% from the top of the div
        offset: offset
      });
    };


    //triger these functions on page scroll
    // new scroll('div0', '75%', draw_outline, draw_outline);
    // new scroll('div1', '75%', grid, grid);
    // new scroll('div2', '75%', grid2, grid);
    // new scroll('div3', '75%', grid3, grid2);
    // new scroll('div6', '75%', draw_points, grid3)

    
    new scroll('drawpoints',"50%", draw_points, clean);
    new scroll('colorpoints1', "75%", color_points1, draw_points);
    new scroll('colorpoints2', "75%", color_points2, color_points1);
    new scroll('colorpoints3', "75%", color_points3, color_points2);
    new scroll('colorpoints4', "75%", color_points4, color_points3);



    // new scroll('div1', '75%', grid, grid);
    // new scroll('div2', '75%', draw_points, grid);
    // new scroll('div3', '75%', grid3, grid2);
    // new scroll('div6', '75%', draw_points, grid3)


    //start grid on page load
    // draw_outline()

    // var headerPoint = $(".project");

    // headerPoint.waypoint({
    //   handler: function(direction) {
    //     if (direction === 'down') {
    //       var title = this.element.getAttribute("data-title");
    //       $("#header").text(title);
    //     }
    //   },
    //   offset: '50%'
    // });
    
    // headerPoint.waypoint({
    //   handler: function(direction) {
    //     if (direction === 'up') {
    //       var title = this.element.getAttribute("data-title");
    //       $("#header").text(title);
    
    //       //console.log($(window).height());
    //       //console.log(this.element.clientHeight);
    //     }
    //   },
    //   offset: function() {
    //     return -this.element.clientHeight + ($(window).height()/2);
    //   }
    // });