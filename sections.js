// Global variables
let neighborhoods, labels, color_domain_max, synth_color_domain_max;

// Needed for zoom
let reset, zoomed, clicked;

const margin = {left: 0, top: 100, bottom: 0, right: 0}

// Height and width of browser
const height =  window.innerHeight
const width = window.innerWidth

// size of the SVG depends on the browser window size
const svg_height = height
const svg_width = svg_height*0.85

// Projection and path
let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);

// Read in data
d3.json("GeoJSON/Neighborhood_Clusters.geojson").then(function(d){
    d3.json("GeoJSON/synthetic_labeled.geojson").then(function(l){
        neighborhoods = d;
        labels = l;

    /* -------------------------------------------------------------------------- */
    /*                                     SVG                                    */
    /* -------------------------------------------------------------------------- */
     // Define the SVG
    let svg = d3.select("svg")
        .attr('width',svg_width)
        .attr('height',svg_height)
        .on("click",reset)
        .on("dblclick.zoom", reset);
    
    // Set group element so the map & points can be resized together in zoom mode
    const g = svg.append("g");

    /* ------------------------------- COLOR SCHEME ------------------------------- */
    // Get the color domain max for each simulation
    let color_domain_max = labels.features[0]['properties'].domain_max;
    let synth_color_domain_max = labels.features[0]['properties'].synth_domain_max;

    // Since some examples have many labels, I'm going to combine 2 color palletes
    var my_color_scheme1 = d3.schemeTableau10;
    var my_color_scheme2 = d3.schemeAccent;
    var my_colors = my_color_scheme1.concat(my_color_scheme2);

    // The labels generated from make_blob
    labeled_synth_color = d3.scaleOrdinal().domain([0,19]).range(my_colors);

    /* -------------------------------------------------------------------------- */
    /*                          FUNCTIONS TO DRAW CIRCLES                         */
    /* -------------------------------------------------------------------------- */
    // synthetic circles 
    let synth_circles = () =>{
        g.selectAll("circle")
        .data(labels.features)
        .enter()
        .append("circle")
        .attr("stroke", "black")
        .transition()
        .delay((d, i) => 3 * i)
        .duration(1000)
        .attr("cx", function(d) {return projection(d.properties.synth_coordinates)[0]})
        .attr("cy", function(d) {return projection(d.properties.synth_coordinates)[1]})
        .attr("r", 4)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("fill", "transparent")};

    // };

    let real_circles = () =>{
        g.selectAll("circle")
        .transition()
          .duration(2000)
          .attr("cx", function(d) {return projection(d.geometry.coordinates)[0]})
          .attr("cy", function(d) {return projection(d.geometry.coordinates)[1]})
          .attr("r", 4)
          .attr("stroke", "black")
          .attr("stroke-width", 0.5)
          .attr("fill", "transparent")
      };       

      /* -------------------------------------------------------------------------- */
      /*                         FUNCTION TO DRAW THE DC MAP                        */
      /* -------------------------------------------------------------------------- */
      // Draw map
      let draw_map = () =>{
        // projection.fitSize([svg_width, svg_height],neighborhoods);
        g.selectAll("path")
            .attr("d", path)
            .style("stroke", "white")
            .style("fill", "transparent") 
            .transition()
            .duration(3000)
      };
        //  Function to color specific path on map 
        function color_neighborhood(object){
        g.selectAll("path")
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            if (d.properties.OBJECTID == object) {
                return "orange";
            }            
            }
        )};


        function color_dupont(){
            color_neighborhood(14)
        };

    /* -------------------------------------------------------------------------- */
    /*                    FUNCTIONS TO COLOR LABELED SYNTHETIC POINTS             */
    /* -------------------------------------------------------------------------- */
    let synth_color_init = () =>{
        g.selectAll("circle")
        .transition()
        .duration(2000)
        .style("fill", function(d) {
                return labeled_synth_color(d.properties.synth_labels)
            })
    }; 

    /* -------------------------------------------------------------------------- */
    /*                     FUNCTION TO CLEAR POINTS OF COLOR                      */
    /* -------------------------------------------------------------------------- */

    let clear_points = () =>{
        g.selectAll("circle")
        .style("fill", "transparent")
        .style("stroke", "black")
        .transition()
        .duration(2000)

    }; 

    /* -------------------------------------------------------------------------- */
    /*                         FUNCTION TO DELETE POINTS                          */
    /* -------------------------------------------------------------------------- */
    function delete_points(){
        g.selectAll('circle')
        .transition()
        .duration(2000)
        .remove();
    };

    /* -------------------------------------------------------------------------- */
    /*                      FUNCTIONS TO UPDATE POINTS COLOR                      */
    /* -------------------------------------------------------------------------- */

    // Function to update the color range depending on how many labels (clusters) we got
    function get_color_domain(type, index){
        if (type == "synth"){
            color_range = d3.scaleOrdinal().domain([0,synth_color_domain_max[index]]).range(my_colors);
        }
        else if (type == "real"){
            color_range = d3.scaleOrdinal().domain([0,color_domain_max[index]]).range(my_colors);
        }
        return color_range
    };

    function color_points(type, index){
        to_color = get_color_domain(type,index);
        g.selectAll("circle")
        .transition()
        .duration(1000)
        .style("fill", function(d) { 
            if (type == "synth"){
                if (d.properties.synth_labels_gen[index] ==-1) {
                    return "transparent";
            } else {
                    return to_color(d.properties.synth_labels_gen[index]);
            }}
            if (type == "real"){
                if (d.properties.labels[index] ==-1) {
                    return "transparent";
            } else {
                    return to_color(d.properties.labels[index]);
            }}
        })
    };

    /* -------------------------------------------------------------------------- */
    /*                                COLORING MAP                                */
    /* -------------------------------------------------------------------------- */

    //  Function to color specific path   
    function color_neighborhood(object){
        g.selectAll("path")
        .data(neighborhoods.features)
        .attr('d', path)
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            if (d.properties.OBJECTID == object) {
                return "red";
            }            
        }
    )};

    function color_dupont(){
        color_neighborhood(14)
    };

    /* -------------------------------------------------------------------------- */
    /*                                    ZOOM                                    */
    /* -------------------------------------------------------------------------- */
    // Initiallize zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    // Zoom to bounding box of each neighborhood
    projection.fitSize([svg_width, svg_height],neighborhoods);
        const clusters = g.append("g")
        .attr("fill", "transparent")
        .attr("cursor", "zoomed-in")
          .selectAll("path")
          .data(neighborhoods.features)
          .join("path")
          .on("mouseover", mouseOverEdge)
          .on("mouseout", mouseOutEdge)
          .on("click", clicked);
               
    // Disable zoom on scroll 
    svg.call(zoom)
        .on("wheel.zoom", null)
        .on("dblclick.zoom", reset);

    // Function to reset the view
    function reset() {
        clusters.transition().style("fill", "#transparent").style("stroke", "white");
        svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([svg_width / 2, svg_height / 2])
        );
    }
    // Zoom on click
    function clicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        clusters.transition().style("fill", "transparent");
        d3.select(this).transition().style("fill", "transparent");
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
            .translate(svg_width / 2, svg_height / 2)
            .scale(5)
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
            );
        }   
      
    function zoomed(event) {
        const {transform} = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }
    
    /* -------------------------------------------------------------------------- */
    /*                                    HOVER                                   */
    /* -------------------------------------------------------------------------- */
    // Source: https://github.com/vegalla/vegalla.github.io

    // This function selects the circle and adds a border to help highlight selection
    // Additionally, a tooltip is transitioned in when selected to provide station details.
    function mouseOverNode(event, d){
        console.log('hi')
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('stroke-width', 5)
            .attr('stroke', 'orange')
                
        d3.select('#tooltip')
            .style('left', (event.pageX + 10)+ 'px')
            .style('top', (event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`This is a point`) // Add tooltip for connected stations
    }

    // This function erases the tool tip display and resets the circle border to zero to remove the highlight.
    function mouseOutNode(d){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
    };

    // This function highlights the neighborhood when it's being hovered over
    // And display its name in the tool tip
    function mouseOverEdge(event, d){       
        console.log(d.properties.NBH_NAMES);
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('stroke-width', 5)               
        d3.select('#tooltip')
            .style('left', (event.pageX + 10)+ 'px')
            .style('top', (event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`${d.properties.NBH_NAMES}`) // Add tooltip for connected stations
    };

    function mouseOutEdge(d, i){
        d3.select('#tooltip')
            .style('display', 'none')
        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('stroke-width', 1)
    };

    /* -------------------------------------------------------------------------- */
    /*                                  SCROLLING                                 */
    /* -------------------------------------------------------------------------- */
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

    /* --------------- INITIALIZE COLOR STEPS TO USE WITH WAYPOINT -------------- */
    // Synthetic points colors

    function color_points_synth0(){
        color_points("synth",0)
    };
    function color_points_synth1(){
        color_points("synth",1)
    };
    function color_points_synth2(){
        color_points("synth",2)
    };
    function color_points_synth3(){
        color_points("synth",3)
    };
    function color_points_synth4(){
        color_points("synth",4)
    };
    function color_points_synth5(){
        color_points("synth",5)
    };

    // Real points colors

    function color_points_real0(){
        color_points("real",0)
    };
    function color_points_real1(){
        color_points("real",1)
    };
    function color_points_real2(){
        color_points("real",2)
    };
    function color_points_real3(){
        color_points("real",3)
    };
    function color_points_real4(){
        color_points("real",4)
    };
    function color_points_real5(){
        color_points("real",5)
    };



    /* ---------------------- ORDER OF EVENTS BASED ON DIV ---------------------- */

    // Scroll steps
    new scroll('div1',"50%", synth_circles, delete_points);
    new scroll('div4',"25%", synth_color_init, synth_circles);
    // new scroll('div5',"50%", color_points_synth0, synth_color_init);
    new scroll('div5',"75%", color_points_synth0, synth_color_init);
    new scroll('div7',"75%", color_points_synth1, color_points_synth0);
    new scroll('div9',"75%", clear_points, color_points_synth1);
    new scroll('div10',"75%", real_circles, clear_points);
    new scroll('div11',"75%", draw_map, real_circles);
    new scroll('div12',"75%", color_points_real0, draw_map);
    new scroll('div13',"75%", color_points_real1, color_points_real0);
    new scroll('div14',"75%", color_points_real2, color_points_real1);
    new scroll('div15',"75%", color_points_real3, color_points_real2);
    new scroll('div16',"75%", color_dupont, color_points_real3);









    // new scroll('div6',"50%", color_points_synth0, color_points_synth0);




    // new scroll('div6',"50%", synth_color_init, draw_synthetic);
    // new scroll('div7',"50%", synth_color_points0, synth_color_init);
    // new scroll('div8',"50%", synth_color_points1, synth_color_points0);
    // new scroll('div9',"50%", draw_real, synth_color_points1);
    // new scroll('div10',"50%", synth_color_points2, synth_color_points1);


    // new scroll('test2',"50%", draw_map, draw_real);

    // new scroll('test1',"50%", draw_map, color_points0);
    // new scroll('test2',"50%", color_map, draw_map);
    // new scroll('test3',"50%", color_points1, color_points0);
    // new scroll('test4',"50%", color_points2, color_points1);
    // new scroll('test5',"50%", color_points3, color_points2);
    // new scroll('test6',"50%", color_dupont, color_points3);
    // new scroll('test7',"50%", color_map, color_dupont);





})});

