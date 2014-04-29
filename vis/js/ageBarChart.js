/**
 * library for subgraphs
 */

var noDataToDisplay = function(divNoData) {
    var noDataContainerWidth = $(divNoData).width()
    var margin = { left: 40 , right: 0, top: 15, bottom: 40};
    var width = noDataContainerWidth - margin.left - margin.right;
    var height = (.65*noDataContainerWidth) - margin.bottom - margin.top;
    if (divNoData == "#mainVis") height = (250)

    var svg = d3.select(divNoData).append("svg")
    .attr({ width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom });
    svg.append("text")
        .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + margin.top+ margin.bottom)/2 + ")")
        .style("text-anchor", "middle")
        .text("NO DATA TO DISPLAY")
        .attr("class", "caption");
}


var createAgeBars = function(ageDataSet, div) {
    console.log("CreateAgeBars is firing", ageDataSet)
    var ageBars, xAxis, xScale, yAxis,  yScale, tickCt=10;
    var barChartContainerWidth = $(div).width()
    var margin = { left: 40 , right: 0, top: 15, bottom: 40};
    var width = barChartContainerWidth - margin.left - margin.right;
    var height = (.65*barChartContainerWidth) - margin.bottom - margin.top;
console.log("**** ageBarChart height", height);
	var xAxisMetric = "age_name";
    if (div == "#mainVis") height = (250)

console.log("****div1", $("#div1"));
    ageBars = d3.select(div).append("svg")
        .attr({ width: width + margin.left + margin.right,
                height: height + margin.top + margin.bottom,
                class: "ageBars"
        })
       .on("click", function(){
            $("#mainSelect").val("ageBarChart");
            $('#filterForm').change();
        } );
        // .append("g").attr({ 
        //     transform: "translate(" + margin.left + "," + margin.top + ")"
        // });
        var yMin = d3.min(ageDataSet, function(d) { return +d[filterValues.metric];} );
        var yMax = d3.max(ageDataSet, function(d) { return +d[filterValues.metric];} );
        if (yMin == yMax) { yMax = yMax + 0.01; tickCt=1;}


        var dataLength = ageDataSet.length,
            wdBar = width / dataLength, j=0, padding = 0;
console.log("ageSexTrendChart wdBar", wdBar);
    wdBar = wdBar - (wdBar/3);
console.log("ageSexTrendChart wdBar zz", wdBar);
console.log("ageSexTrendChart width", width, dataLength);
    console.log("DivWidth", barChartContainerWidth);
    console.log("Width", width);

//        xScale = d3.scale.ordinal().rangeRoundBands([margin.left, width], .1);
        xScale = d3.scale.linear()
            .domain([0, dataLength])
            .range([margin.left, width]);

    console.log("***************************************************************")
    console.log("ageDataSet", ageDataSet);
    console.log("DivWidth", barChartContainerWidth);
    console.log("Width", width);
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^xScale max value",xScale(dataLength-1));
    console.log("***************************************************************")

        yScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([height, margin.top]);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(dataLength)
            .tickFormat(function(i) {console.log(i); if (i < dataLength)return ageDataSet[i][xAxisMetric]; });

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(tickCt);

        ageBars.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.2em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-90)");

        ageBars.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);

    // Draw the Captions on the page

    // Left Side Caption
        ageBars.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height + margin.top )/2)
            .attr("y", 5 )
            .style("text-anchor", "middle")
            .text(function(){
                return mappings[filterValues.metric]
            })
            .attr("class", "caption");
    // Bottom  Caption
        ageBars.append("text")
            .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + margin.top+ margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text(mappings[xAxisMetric])
            .attr("class", "caption");

        ageBars.selectAll(".bar")
            .data(ageDataSet)
            .enter().append("rect")
//                .attr("class", "agebar bar")
                .attr("class", function(d){ return "bar pointer bar" + d.year; })
                .attr("x", function(d, i) { return xScale(i); })
//              .attr("width", xScale.rangeBand())
                .attr("width", wdBar)
                .attr("y", function(d, i) { return yScale(+d[filterValues.metric]); })
                //if the value is too small to be displayed, set the height to a minimum 0.001 to enable the tooltip to be displayed to show data on hover

                .attr("height", function(d) {
                    if (height != yScale(+d[filterValues.metric]))
                        return height - yScale(+d[filterValues.metric]); else return 0.001; })
                .append("title")
                .html(function(d) {
                    return (d.year + ": " + mappings[d.region_name] + ", " + d.cause_medium + ", "

                        + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric])
                });

 }




