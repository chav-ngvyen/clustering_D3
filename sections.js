// Global variables
let neighborhoods, labels;
// // things to display 
// let color_domain_max, synth_color_domain_max, synth_noise, real_noise;
// let simulation, min_samples, epsilon, min_sample_size; 
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




    // let group = svg.selectAll('g')
    // .data(labels.features)
    // .enter()
    // .append("g");

    // group = group.selectAll('g')
    // .data(neighborhoods.features)
    // .enter()
    // .append("g");
    


        
    // Initialize neighborhood clusters
    const clusters = g.append("g")
        .attr("fill", "transparent")
        .attr("cursor", "zoomed-in")
          .selectAll("path")
          .data(neighborhoods.features)
          .join("path")
          .on("mouseover", mouseOverEdge)
          .on("mouseout", mouseOutEdge)
          .on("wheel", mouseOutEdge) // remove the tooltip during scroll
          .on("click", clicked);
    
    // Initialize circles (locations of each liquor licensee)
    let circles = g.selectAll("circle")
        .data(labels.features)
        .enter()
        .append("circle")
        .on("mouseover", mouseOverNode)
        .on("mouseout", mouseOutNode) // remove the tooltip during scroll
        .on("wheel", mouseOutNode);

    let sim = g.append("text")
        .attr('class', 'sim')
        .attr('x', svg_width*.05)
        .attr('y', 200)
        .attr('text-anchor', 'left')
        .text(function(d) { return d })

    let titles = g.append("text")
        .attr('class', 'title')
        .attr('x', svg_width*.05)
        .attr('y', 50)
        .attr('text-anchor', 'left')
        .text(function(d) { return d })

    let noises_title = g.append("text")
        .attr('class', 'noise')
        .attr('x', svg_width*.05)
        .attr('y', 70)
        .attr('text-anchor', 'left')
        .text(function(d) { return d })

    let min_samples_title = g.append("text")
        .attr('class', 'noise')
        .attr('x', svg_width*.05)
        .attr('y', 90)
        .attr('text-anchor', 'left')
        .text(function(d) { return d })

    let epsilon_title = g.append("text")
        .attr('class', 'noise')
        .attr('x', svg_width*.05)
        .attr('y', 110)
        .attr('text-anchor', 'left')
        .text(function(d) { return d })   
    
    let min_cluster_size_title = g.append("text")
        .attr('class', 'noise')
        .attr('x', svg_width*.05)
        .attr('y', 130)
        .attr('text-anchor', 'left')
        .text(function(d) { return d })

    
    // console.log(height);
    // console.log(svg_height);

    

    /* ------------------------------- COLOR SCHEME ------------------------------- */
    // Get the color domain max for each simulation
    let color_domain_max = labels.features[0]['properties'].domain_max;
    let synth_color_domain_max = labels.features[0]['properties'].synth_domain_max;
    // Get the number of noise points, simulation name, type & whatnot from the preprocessed data

    let synth_noise = labels.features[0]['properties'].synth_noise;
    let real_noise = labels.features[0]['properties'].real_noise;
    let simulation = labels.features[0]['properties'].simulation;
    let min_samples = labels.features[0]['properties'].min_samples;
    let epsilon = labels.features[0]['properties'].epsilon;
    let min_cluster_size = labels.features[0]['properties'].min_cluster_size;
    let sel_method = labels.features[0]['properties'].sel_method;


    


   


    // Since some examples have many labels, I'm going to combine 2 color palletes
    var my_color_scheme1 = d3.schemeTableau10;
    var my_color_scheme2 = d3.schemeAccent;
    var my_colors = my_color_scheme1.concat(my_color_scheme2);

    // The labels generated from make_blob
    labeled_synth_color = d3.scaleOrdinal().domain([0,19]).range(my_colors);

    // g.append('text')
    // .attr('class', 'title')
    // .attr('x', svg_width*.8)
    // .attr('y', 50)
    // .attr('text-anchor', 'middle')
    // .text(function(d){
    //     return get_clusters(1)
    // });

    /* -------------------------------------------------------------------------- */
    /*                          FUNCTIONS TO DRAW CIRCLES                         */
    /* -------------------------------------------------------------------------- */
    // synthetic circles 
    let synth_circles = () =>{
        // circles.append("circles")
        // g.selectAll("circle")
        // .data(labels.features)
        // .enter()
        // .append("circle")
        circles
        .attr("stroke", "black")
        .transition()
        .delay((d, i) => 3 * i)
        .duration(1000)
        .attr("cx", function(d) {return projection(d.properties.synth_coordinates)[0]})
        .attr("cy", function(d) {return projection(d.properties.synth_coordinates)[1]})
        .attr("r", 4)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("fill", "transparent")};
    
    // Call this before drawing the real circles so they'd move back after scrolling up 
    let synth_circles_fast = () =>{
        // g.selectAll("circle")
        circles
        .transition()
          .attr("cx", function(d) {return projection(d.properties.synth_coordinates)[0]})
          .attr("cy", function(d) {return projection(d.properties.synth_coordinates)[1]})
          .attr("r", 4)
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .attr("fill", "transparent")
      };    
    
        
    let real_circles = () =>{
        // g.selectAll("circle")
        circles
        .transition()
        .duration(1000)
        // .transition()
        //   .duration(500)
          .attr("cx", function(d) {return projection(d.geometry.coordinates)[0]})
          .attr("cy", function(d) {return projection(d.geometry.coordinates)[1]})
        //   .attr("r", 4)
        //   .attr("stroke", "white")
        //   .attr("stroke-width", 0.5)
        //   .attr("fill", "transparent")
        .attr("stroke", "black")


      };       

      /* -------------------------------------------------------------------------- */
      /*                         FUNCTION TO DRAW THE DC MAP                        */
      /* -------------------------------------------------------------------------- */
      // Draw map
      let draw_map = () =>{
          clusters
            .attr("d", path)
            .style("stroke", "white")
            .style("fill", "transparent") 
            .transition()
            .duration(3000)
      };

      

        //  Function to color specific path on map 
    function highlight_neighborhood(object){
        clusters
        .transition()
        .duration(1000)
        .style("fill", function(d) {
            if (d.properties.OBJECTID === object) {
                return "black";
            }            
            }
        )};

        function highlight_dupont(){
            highlight_neighborhood(14)
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
            });
        titles
        .transition()
        .duration(1000)
        .text(function(d){
            return "20 synthetic clusters" 
        });
    }; 

    /* -------------------------------------------------------------------------- */
    /*                     FUNCTION TO CLEAR POINTS OF COLOR                      */
    /* -------------------------------------------------------------------------- */

    let clear_points = () =>{
        circles
        .transition()
        .duration(2000)
        .style("fill", "transparent")
        .style("stroke", "black")
        titles
        .transition()
        .duration(1000)
        .text(function(d){
            return "No clustering in effect"});
        noises_title
        .transition()
        .duration(1000)
        .text("");
        sim
        .transition()
        .duration(1000)
        .text("");
        min_samples_title
        .transition()
        .duration(1000)
        .text("");
        epsilon_title
        .transition()
        .duration(1000)
        .text("");
        min_cluster_size_title
        .transition()
        .duration(1000)
        .text("");

    }; 

    /* -------------------------------------------------------------------------- */
    /*                         FUNCTION TO DELETE POINTS                          */
    /* -------------------------------------------------------------------------- */
    
    // Use this is the first div
    function delete_points(){
        circles
        .transition()
        .duration(2000)
        .remove();
    };

    function delete_map(){
        clusters
        .attr("d", path)
        .style("stroke", "none")
        .style("fill", "none") 
        .transition()
        .duration(3000)
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

    // Function to get the number of clusters for each simulation
    function get_clusters(type, index){
        if (type == "synth"){
            return synth_color_domain_max[index];
        } else (type == "real")
            return color_domain_max[index];
    };
    // Function to get the number of noise for each simulation
    function get_noise(type, index){
        if (type == "synth"){
            return synth_noise[index];
        } else (type == "real")
            return real_noise[index];
    };

    // Get simulation parameteres - same for both
    function get_sim(index){
        return simulation[index];
    };

    function get_min_samples(index){
        return min_samples[index];
    };

    function get_epsilon(index){
        return epsilon[index];
    };
 
    function get_min_cluster_size(index){
        return min_cluster_size[index];
    };

    function get_sel_method(index){
        return sel_method[index];
    };


    function color_points(type, index){
        to_color = get_color_domain(type,index);
        // g.selectAll("circle")
        circles
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
        .style("stroke", function(d) { 
            if (type == "synth"){
                if (d.properties.synth_labels_gen[index] ==-1) {
                    return "white";
            } else {
                    return "black";
            }}
            if (type == "real"){
                if (d.properties.labels[index] ==-1) {
                    return "white";
            } else {
                    return "black";
            }}
        });
    
    };

    function update_title(type, index){
        titles
        .transition()
        .duration(500)
        .text(function(d){
            return "Number of clusters: " +get_clusters(type, index)
        });
        };

    function update_noise(type, index){
        noises_title
        .transition()
        .duration(500)
        .text(function(d){
            return "Number of points counted as noise: " +get_noise(type, index)
        });
        };
    
    function update_sim(index){
        sim
        .transition()
        .duration(500)
        .text(function(d){
            "Clustering method: " +get_sim(index)
        });
        };

    console.log(update_sim(0));
    


    function update_epsilon(index){
        epsilon_title
        .transition()
        .duration(500)
        .text(function(d){
            "Epsilon param: " +get_epsilon(index)
        });
        };
    function update_min_samples(index){
        min_samples_title
        .transition()
        .duration(500)
        .text(function(d){
            "Min samples: " +get_min_samples(index)
        });
        };

    function update_min_cluster_size(index){
        min_cluster_size_title
        .transition()
        .duration(500)
        .text(function(d){
            "Min cluster size: " +get_min_cluster_size(index)
        });
        };
    

    // console.log(update_title("synth",0));




    // console.log("get_clusters", get_clusters(0));



    /* -------------------------------------------------------------------------- */
    /*                                    ZOOM                                    */
    /* -------------------------------------------------------------------------- */
    // Initiallize zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    // Zoom to bounding box of each neighborhood cluster
    projection.fitSize([svg_width, svg_height],neighborhoods);
    

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
        // console.log(d.properties);
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('stroke-width', 1)
                
        d3.select('#tooltip')
            .style('left', (event.pageX + 10)+ 'px')
            .style('top', (event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(`${d.properties.TRADE_NAME}`) // Add tooltip for connected stations
    };

    // console.log(labels);
    // This function erases the tool tip display and resets the circle border to zero to remove the highlight.
    function mouseOutNode(d){
        d3.select('#tooltip')
            .style('display', 'none')

        d3.select(this)
            .transition('mouseout').duration(100)
            .attr('stroke-width', 0.5)

    };

    // This function highlights the neighborhood when it's being hovered over
    // And display its name in the tool tip
    function mouseOverEdge(event, d){       
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

    function mouseMoveEdge(d, i){        
        d3.select('#tooltip')
        .style('display', 'none')
        d3.select(this)
        .transition('mousemove').duration(100)
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
        update_title("synth",0);
        update_noise("synth",0);
        update_sim(0);
        update_epsilon(0);
        update_min_samples(0);
        update_min_cluster_size(0);
        color_points("synth",0);
    };
    function color_points_synth1(){
        update_sim(1);
        update_epsilon(1);
        update_min_samples(1);
        update_min_cluster_size(1);
        update_title("synth",1);
        update_noise("synth",1);
        color_points("synth",1);
    };
    function color_points_synth2(){
        update_sim(2);
        update_epsilon(2);
        update_min_samples(2);
        update_min_cluster_size(2);
        update_title("synth",2);
        update_noise("synth",2);
        color_points("synth",2)
    };
    function color_points_synth3(){

        update_sim(3);
        update_epsilon(3);
        update_min_samples(3);
        update_min_cluster_size(3);
        update_title("synth",3);
        update_noise("synth",3);

        color_points("synth",3)
    };
    function color_points_synth4(){
        update_sim(4);
        update_epsilon(4);
        update_min_samples(4);
        update_min_cluster_size(4);
        update_title("synth",4);
        update_noise("synth",4);

        color_points("synth",4)
    };
    function color_points_synth5(){
        update_sim(5);
        update_epsilon(5);
        update_min_samples(5);
        update_min_cluster_size(5);
        update_title("synth",5);
        update_noise("synth",5);

        color_points("synth",5)
    };

    // Real points colors

    function color_points_real0(){
        update_sim(0);
        update_epsilon(0);
        update_min_samples(0);
        update_min_cluster_size(0);
        update_title("real",0);
        update_noise("real",0);

        color_points("real",0)
    };
    function color_points_real1(){
        update_sim(1);
        update_epsilon(1);
        update_min_samples(1);
        update_min_cluster_size(1);
        update_title("real",1);
        update_noise("rea",1);

        color_points("real",1)
    };
    function color_points_real2(){
        update_sim(2);
        update_epsilon(2);
        update_min_samples(2);
        update_min_cluster_size(2);
        update_title("real",2);
        update_noise("real",2);

        color_points("real",2)
    };
    function color_points_real3(){
        update_sim(3);
        update_epsilon(3);
        update_min_samples(3);
        update_min_cluster_size(3);
        update_title("real",3);
        update_noise("real",3);


        color_points("real",3)
    };
    function color_points_real4(){
        update_sim(4);
        update_epsilon(4);
        update_min_samples(4);
        update_min_cluster_size(4);
        update_title("real",4);
        update_noise("real",4);

        color_points("real",4)
    };
    function color_points_real5(){
        update_sim(5);
        update_epsilon(5);
        update_min_samples(5);
        update_min_cluster_size(5);
        update_title("real",5);
        update_noise("real",5);


        color_points("real",5)
    };



    /* ---------------------- ORDER OF EVENTS BASED ON DIV ---------------------- */

    // Scroll steps
    new scroll('div1',"50%", synth_circles, delete_points);
    new scroll('div4',"25%", synth_color_init, synth_circles);
    // new scroll('div5',"50%", color_points_synth0, synth_color_init);
    new scroll('div5',"75%", color_points_synth0, synth_color_init);
    new scroll('div7',"75%", color_points_synth1, color_points_synth0);
    new scroll('div8',"75%", clear_points, color_points_synth1);
   
    new scroll('div9',"75%", synth_circles_fast, clear_points);
    new scroll('div10',"75%", delete_map, synth_circles_fast);
    new scroll('div11',"75%", clear_points, delete_map);
    new scroll('div12',"75%", real_circles, clear_points);
    new scroll('div13',"75%", draw_map, real_circles);
    new scroll('div14',"75%", color_points_real0, draw_map);
    new scroll('div15',"75%", color_points_real1, color_points_real0);
    new scroll('div16',"75%", color_points_real2, color_points_real1);
    new scroll('div17',"75%", color_points_real3, color_points_real2);
    new scroll('div18',"75%", draw_map, color_points_real3);
    new scroll('div19',"75%", highlight_dupont, draw_map);










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

