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
var sex = {male: "Male", female: "Female", both: "Both"};

var filterValues = {sex: "Both", year:"1990"};


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

d3.csv("data/global.csv", function(csv){

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
    })

    d3.csv("data/full.csv", function(csv){
        fullData = csv;

        $("#ageSelect").val(20);

       $("#filterForm").change();
        console.log("Full Data Loaded")
    })

});

xy = d3.geo.conicEqualArea()
    .parallels([179, 1])
    .scale(110); // adjust this to make it fit the page later

path = d3.geo.path().projection(xy);

vis = d3.select("#mapContainer")
    .append("svg")
        .attr("width", 770)
        .attr("height",300 );


tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    var html ="Country: "+  d.properties.name +"<br/> Region: "+ region_short[d.properties.featurecla]
    return html;
});




vis.call(tip)
d3.json("json/Combined.geojson", function(json) {


    map = vis.append("g")
        .attr({
            "transform" : "translate(-100,-100)"
        })


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
            var className = "."+d.properties.featurecla
            d3.selectAll(className)
                .attr("stroke", "red")
                .attr("fill", "yellow");

            tip.show(d)
            $('.d3-tip').offset({left:(window.outerWidth/4),top:25})
        })
        .on("mouseout", function(d){

            tip.hide(d)
            var className = d.properties.featurecla
            var className = "."+d.properties.featurecla
            d3.selectAll(className)
                .attr("stroke", "#222")
                .attr("fill", function(d){
                    console.log("this is this")
                    console.log(d)
                    console.log(d.properties.featurecla)
                    console.log(colorScale(d.properties.featurecla))
                    colorScale(className)

                })
        })
        .on("click", function(d){

        })

    });

var colorScale, scaleValues
    function drawChartColors(){
        scaleValues = d3.extent(filteredData, function(d){
        return +d[filterValues.metric]
    })

       colorScale = d3.scale.linear()
            .domain(scaleValues)
            .range(["red","blue"])

      filteredData.forEach(function(d,i,a){
          color = colorScale(d[filterValues.metric])
          mapClass = "." + region_name[d.region_name]
          console.log(mapClass)
          map.selectAll(mapClass)
            .attr("fill", color)
          d.color = color

       })


    }


    $("#filterForm").change(function(){
        filterValues.region = $("#regionSelect").val();
        filterValues.cause = cause_value[$("#causeSelect").val()];
        filterValues.age = age_value[$("#ageSelect").val()];
        filterValues.metric = $("#metricSelect").val();
        console.log(filterValues)
        filter();


    })
    $("#maleButton").click(function(){
         filterValues.sex = "Male";
        $(".sexButton").removeClass("btn-primary");
        $("#maleButton").addClass("btn-primary");
        filter();
    })
    $("#bothButton").click(function(){
        filterValues.sex = "Both";
        $(".sexButton").removeClass("btn-primary");
        $("#bothButton").addClass("btn-primary");
        filter();
    })
    $("#femaleButton").click(function(){
        filterValues.sex = "Female";
        $(".sexButton").removeClass("btn-primary");
        $("#femaleButton").addClass("btn-primary");
        filter();
    })
    $("#yr1990Button").click(function(){
        filterValues.year = "1990";
        $(".yrButton").removeClass("btn-primary");
        $("#yr1990Button").addClass("btn-primary");
        filter();
    })
    $("#yr2005Button").click(function(){
        filterValues.year = "2005"
        $(".yrButton").removeClass("btn-primary")
        $("#yr2005Button").addClass("btn-primary")
        filter();
    })
    $("#yr2010Button").click(function(){
        filterValues.year = "2010"
        $(".yrButton").removeClass("btn-primary")
        $("#yr2010Button").addClass("btn-primary")
        filter();
    })




    function filter(){
        console.log("filter firing")
        filteredData = [];
        fullData.every(function(element, index, array){
            if (index == 0) console.log(element)
            if (
                     ((element.cause_medium.trim() == filterValues.cause))
                  && true // ((filterValues.region == null)||(element.region_name.trim() == filterValues.region))
                  && (element.year.trim() == filterValues.year)
                  && (element.sex_name.trim() == filterValues.sex)
                  && (element.age_name.trim() == filterValues.age)
                )
            {
              //  console.log(element.sex_name)
                filteredData.push(element)
            }

/*

            if (filteredData.length > 21  ) return false;
            else return true;

*/
            return true;
        })
        console.log(filteredData)
        drawChartColors();
    }// end filter()




$( document ).ready(function() {
    // once the document is ready, trigger a filterForm change
    // and get the values from the select boxes.
    console.log("Document is Ready")

});



