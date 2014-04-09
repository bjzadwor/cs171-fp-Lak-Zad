/**
 * Created by Bryan on 4/3/14.
 */
/*
var mapContainerWidth = $('#mapContainer').width()

var svg = d3.select("#mapContainer")
    .append("svg")
    .attr({
    width: mapContainerWidth,
    height: mapContainerWidth
    });
*/
/*var g = svg
    .append("g")
    .append("rect")
    .attr({
        transform: "translate(15,15)",
        class: "red",
        fill:"red",
        width:  mapContainerWidth -30,
        height: mapContainerWidth -30
    })
*/

/*
$(window).resize(function(){
    mapContainerWidth = $('#mapContainer').width()
        svg.attr({
            width: mapContainerWidth,
            height: mapContainerWidth
        })
*/
  /*  g.attr({
        width: mapContainerWidth -30,
        height: mapContainerWidth-30
    })
*/
 //       console.log(mapContainerWidth)
  //  })


var path, vis, xy;
var map, tip ;

var region_name = {};
var region_short = {};
var cause_medium = {};
var cause_value = {};
var age_value = {};
var age_name = {};
var metric_value = {};
var metric_name = {};

var cause_value_var = 0;
var age_value_var = 0;
var fullData;
var filteredData;
var barChartData;
var sex = {male: "Male", female: "Female", both: "Both"};

var filterValues = {sex: "Both", year:"1990"};


/*
*  loop through the regions and build the objects we use to translate
 */

d3.csv("data/region.csv", function(csv){
   csv.forEach(function(row){
       if(!(row.fullRegion in region_name)){
            region_name[row.fullRegion.trim()]=row.shortRegion.trim()
            region_short[row.shortRegion.trim()]=row.fullRegion.trim()
            $("#regionSelect")
                .append($("<option></option>")
                    .attr("value",row.shortRegion.trim())
                    .text(row.fullRegion.trim()));
        }
    })
}) // end csv("data/region.csv")

d3.csv("data/fullSmall.csv", function(csv){
    csv.forEach( function(row){

        if (!(row.cause_medium in cause_medium)){
            cause_medium[row.cause_medium] = cause_value_var;
            cause_value[cause_value_var] = row.cause_medium;
            $("#causeSelect")
                .append($("<option></option>")
                    .attr("value",cause_value_var)
                    .text(row.cause_medium));
            cause_value_var++;
        }

        if (!(row.age_name in age_name)){
            age_name[row.age_name] = age_value_var;
            age_value[age_value_var]= row.age_name;
            $("#ageSelect")
                .append($("<option></option>")
                    .attr("value",age_value_var)
                    .text(row.age_name));
            age_value_var++;
        }

        switch(row.year){
            case "90":
                row.year = "1990";
                break;
            case "5":
                row.year = "2005";
                break;
            case "10":
                row.year = "2010";
                break;
        }

    })  // csv for each
    fullData = csv;
    console.log("Full Data Loaded")


})


xy = d3.geo.conicEqualArea()
    .parallels([179, 1])
    .scale(110); // adjust this to make it fit the page later

path = d3.geo.path().projection(xy);

vis = d3.select("#mapContainer")
    .append("svg")
        .attr("width", 770)
        .attr("height",300 );


tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    var html ="Country: "+  d.properties.name +
        "<br/> Region: "+ region_short[d.properties.featurecla] +
        "<br/> Value: "+ d.value
    return html;
});




vis.call(tip)
d3.json("json/Combined.geojson", function(json) {


    map = vis.append("g")
        .attr({
            "transform" : "translate(-100,-100)"
        })

 var className
    map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function(d){ return d.properties.featurecla})
        .attr("fill-opacity", 0.5)
        .attr("fill", "#85C3C0")
        .attr("stroke", "#222")
        .on("mouseover", function(d){
            // color the borders red to highlight the region
            className = "."+d.properties.featurecla
            d3.selectAll(className)
                .attr("stroke", "red")
                .attr("fill", "yellow");

            tip.show(d)
            $('.d3-tip').offset({left:(window.outerWidth/4),top:0})
        })
        .on("mouseout", function(d){

            tip.hide(d)
            var className = "."+d.properties.featurecla
            var color = d3.select(className).attr("fill2");
            d3.selectAll(className)
                .attr("stroke", "#222")
                .attr("fill", color)

        })
        .on("click", function(d){
            $("#regionSelect").val(d.properties.featurecla);
            $("#filterForm").change();
        })
console.log("geoJson complete")
    $("#ageSelect").val(20);
    $("#filterForm").change();
    });

var colorScale, scaleValues
    function drawChartColors(){
        scaleValues = d3.extent(filteredData, function(d){
        return +d[filterValues.metric]
        })


       colorScale = d3.scale.linear()
            .domain(scaleValues)
            .range(["red", "blue"]);

      filteredData.forEach(function(d,i,a){
          color = colorScale(d[filterValues.metric])
          mapClass = "." + d.region_name.trim()
          map.selectAll(mapClass)
            .attr("fill", color)
            .attr("fill2", color)
            .attr("value", function(e){ // I don't really care about e, which comes from the map class, I care about
                  e.color = color
                  e.value = d[filterValues.metric]
                  return d[filterValues.metric]
              })

       })


    }







