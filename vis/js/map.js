/**
 * Created by Zadworney on 4/18/2014.
 * Contains the functions required to draw the map
 * and colorize the map
 */


showModalDialog

function drawMap(chosenDiv){

    $(chosenDiv).empty();

    var divWidth = $(chosenDiv).width()

    xy = d3.geo.conicEqualArea()
        .parallels([179, 1])
        .scale(47); // adjust this to make it fit the page later  143/(900/divWidth)

    path = d3.geo.path().projection(xy);


    if(chosenDiv == "#mainVis"){
        vis = d3.select(chosenDiv)
            .append("svg")
            .attr("width", 900) // need to update this
            .attr("height", 300 ); // need to update this

    }
    else {
        vis = d3.select(chosenDiv)
            .append("svg")
            .attr("width", 300) // need to update this
            .attr("height", 200); // need to update this
    }


    tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        var html ="Country: "+  d.properties.name +
            "<br/> Region: "+ region_short[d.properties.featurecla] +
            "<br/> Value: "+ d.value
        return html;
    });

    vis.call(tip)

    map = vis.append("g")
        .attr("transform", function(){
       if(chosenDiv == "#mainVis") return "translate(-30,-100)"
       else return 'translate(-325,-140)'
    }

        )


    map.selectAll("path")
        .data(geoJSON.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", function(d){ return d.properties.featurecla})
        .attr("fill-opacity", 0.5)
        .attr("fill", "#85C3C0")
        .attr("stroke", "#222")
        .attr("stroke-width",.25)
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
            var className = "."+d.properties.featurecla
            $("#regionSelect").val(d.properties.featurecla);
            $("#filterForm").change();
            d3.selectAll(className).attr("fill","yellow"); // color was getting reset when the form changed keep it yellow
        })
    drawChartColors()  // colorize the chart
} // end drawMap


function drawChartColors(){

    scaleValues = d3.extent(filteredData, function(d){
        return +d[filterValues.metric]
    })


    colorScale = d3.scale.linear()
        .domain(scaleValues)
        .range(["white", "red"]);

    filteredData.forEach(function(d,i,a){
        color = colorScale(d[filterValues.metric])
        mapClass = "." + d.region_name.trim()
        d3.selectAll(mapClass)
            .attr("fill", color)
            .attr("fill2", color)
            .attr("value", function(e){ // set color and value
                e.color = color
                e.value = d[filterValues.metric]
                return d[filterValues.metric]
            })

    })


}