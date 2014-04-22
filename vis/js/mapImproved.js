/**
 * Created by Zadworney on 4/21/2014.
 */

var width, height, projection, path, zoom, improvedMapSvg, improvedMapG

function drawImprovedMap(improvedMapDiv) {

    var divWidth = $(improvedMapDiv).width()
    if(improvedMapDiv == "#mainVis"){
        width = 900;
        height = 300;
    }
    else {
        width = 300;
        height = 200;
    }

    projection = d3.geo.conicEqualArea()
        .parallels([179.9,.1])
        .scale(147/(900/divWidth)); // this allows the image to scale to the div, the big div is 900px

    path = d3.geo.path()
        .projection(projection);

    zoom = d3.behavior.zoom()
        .translate(projection.translate())
        .scale(projection.scale())
        .scaleExtent([147/(900/divWidth), 8 * height])
        .on("zoom", zoomed);

    improvedMapSvg = d3.select(improvedMapDiv).append("svg")
        .attr("width", width)
        .attr("height", height);

    improvedMapG = improvedMapSvg.append("g")
        .attr("transform", function(){
            if(improvedMapDiv == "#mainVis") return "translate(-30,-100)"
            else return 'translate(-325,-140)'
        })
        .call(zoom);

    improvedMapG.append("rect")
        .attr("class", "background")
        .attr("fill", "#9FD7F5")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", function(){
            if(improvedMapDiv == "#mainVis") return "translate(30,100)"
            else return 'translate(-325,-140)'
        });


        improvedMapG.append("g")
            .attr("id", "regions")
            .selectAll("path")
            .data(geoJSON.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", function(d){ return "region "+  d.properties.featurecla})
            .attr("stroke", "#222")
            .attr("stroke-width",.25)
            .on("mouseover", function(d){
                // highlight the region and show the tool tip
                className = "."+d.properties.featurecla
                d3.selectAll(className).filter("path")
                    .attr("fill", "yellow");

                d3.selectAll(className).filter("rect")
                    .attr("fill", "yellow")
                    .attr("stroke", "yellow");

                tip.show(d)
            })
            .on("mouseout", function(d){

                tip.hide(d)
                var className = "."+d.properties.featurecla
                var color = d3.select(this).attr("fill2");
                d3.selectAll(className)
                    .attr("stroke", "#222")
                    .attr("fill", color)

                d3.selectAll(className).filter("path")
                    .attr("stroke", "#222")
                    .attr("fill", color);

                d3.selectAll(className).filter("rect")
                    .attr("stroke", "black")
                    .attr("fill", "black");

            })
            .on("dblclick", function(d){   // when you click on a region, change the filter to that region.
                var className = "."+d.properties.featurecla
                $("#regionSelect").val(d.properties.featurecla);
                $("#filterForm").change();
                d3.selectAll(className).attr("fill","yellow"); // color was getting reset when the form changed keep it yellow
            })
            .on("click", clicked)
    drawChartColors2();
}

function clicked(d) {
    var centroid = path.centroid(d),
        translate = projection.translate();

    projection.translate([
            translate[0] - centroid[0] + width / 2,
            translate[1] - centroid[1] + height / 2
    ]);

    zoom.translate(projection.translate());

    improvedMapG.selectAll("path").transition()
        .duration(700)
        .attr("d", path);
}

function zoomed() {
    tip.hide();
    console.log("pre", d3.event.scale)

    projection.translate(d3.event.translate).scale(d3.event.scale);

    console.log(d3.event.scale)
    improvedMapG.selectAll("path").attr("d", path);
}


function drawChartColors2(){



    scaleValues = d3.extent(filteredData, function(d){
        return +d[filterValues.metric]
    })

    console.log(vis);

    // http://bl.ocks.org/mbostock/1086421

    colorScale = d3.scale.linear()
        .domain(scaleValues)
        .range(["white", "red"]);

    var maxRange = width/3
    var numberScale = d3.scale.linear()
        .domain(scaleValues)
        .range(["0", maxRange])


    var gradient = improvedMapSvg
        .append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);

    var axis = d3.svg.axis()
        .scale(numberScale)
        // .ticks(5)
        .orient("top");

    var scaleRect = improvedMapSvg.append("rect")
        .attr("height", height * .02 )
        .attr("width", width/3)
        .attr("fill", "url(#gradient)")
        .attr("transform", "translate(" + width/3 + ","+ height *.96 + ")")

    improvedMapSvg.append("g")
        .attr("class", "axis")
        .attr("height", height * .03 )
        .attr("width", width/3)
        .attr("transform", "translate(" + width/3 + ","+ height *.98 + ")")
        .call(axis)

    improvedMapSvg.append("g")
        .attr("transform", "translate(" + 5 + ","+ height *.98 + ")")
        .append("text")
        .text("Reset Zoom")
        .on("click", filter);


    $("path").attr("value","No Data Provided");

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

    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10,0])
        .html(function(d) {
            var people;
            switch (filterValues.sex) {
                case "Male":
                    people = " males";
                    break;
                case "Female":
                    people = " females";
                    break;
                default:
                    people = " people";
                    break;
            }
            var html ="Country: "+  d.properties.name +
                "<br/> Region: "+ region_short[d.properties.featurecla] +
                "<br/>" + d3.selectAll('path').filter("."+d.properties.featurecla).attr("value") + " "
                + metric[filterValues.metric] + people +
                "<br />" + "due to " + cause_value[filterValues.cause]

            return html;
        });


    improvedMapSvg.call(tip)
}