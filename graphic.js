let dataset, boundary

const margin = {left: 0, top: 50, bottom: 50, right: 50}
const width = 800 - margin.left - margin.right
const height = 800 - margin.top - margin.bottom
//svg
    let svg = d3.select("svg");

    //svg width and height
    svg.attr('width',500)
        .attr('height',500)


    //set up grid spacing
    let spacing = 40;
    let rows = 10;
    let column = 10;
    let randnum = (min,max) => Math.round( Math.random() * (max-min) + min );
    
    let projection = d3.geoMercator();
    let path = d3.geoPath().projection(projection);

    d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
        dataset = d
        console.log(dataset)
        //grid()
    });
    
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

    // function drawmap(){
    //     projection.fitSize([width/2,height/2],boundary);
    //     svg.selectAll("path")
    //         .data(boundary.features)
    //         .enter()
    //         .append("path")
    //         .attr("b", path)
    //         .style("fill", "black")
    //         .style("stroke", "black")
    // }
    
    function grid(){
        projection.fitSize([width/2,height/2],dataset);
        svg.selectAll("path")
            .data(dataset.features)
            .enter()
            .append("path")
            .attr("d", path)
            .transition()
                .duration(5000)
            .style("fill", "black")
            .style("stroke", "black")
    }


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
            .style("stroke", "yellow")
    }

    let grid3 = () =>{
        svg.selectAll("path")
            .transition()
                .duration(2000)
            .attr("d", path)
            .style("fill", "yellow")
            .style("stroke", "yellow")
    }

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
    new scroll('div1', '20%', grid, grid);
    new scroll('div2', '75%', grid2, grid);
    new scroll('div3', '75%', grid3, grid2);
    // new scroll('div6', '75%', barChart, divide);



    //start grid on page load
    //drawmap()