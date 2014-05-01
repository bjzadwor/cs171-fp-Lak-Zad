/**
 * Created by Zadworney on 4/20/2014.
 */
function regionBarChart (dataSet, regionGraphDiv) {
    var xAxis, xScale, yAxis,  yScale, tickCt=10;
    var barChartContainerWidth = $(regionGraphDiv).width();
    var margin = { left: 40 , right: 0, top: 15, bottom: 40};
    var width = barChartContainerWidth - margin.left - margin.right;
    var height = (.65*barChartContainerWidth) - margin.bottom - margin.top;
    if (regionGraphDiv == "#mainVis") height = (250)
    var xAxisMetric = "region_name";

    var backgroundColor = $('body').css("background-color");
    svg = d3.select(regionGraphDiv).append("svg")
        .attr({ width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
            class: "barChart"
        });

    var barChartBackgroundRect = svg.append("rect")
        .attr({ width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
            class: "barChartBackgroundRect",
            fill: backgroundColor
        })
        .on("click", function(d){ // if a user click on the chart(not a bar) open in big window
            $("#mainSelect").val("regionBarChart");
            $('#filterForm').change();

        });

    var yMin = d3.min(dataSet, function(d) { return +d[filterValues.metric];} );
    var yMax = d3.max(dataSet, function(d) { return +d[filterValues.metric];} );
    if (yMin == yMax) { yMax = yMax + 0.01; tickCt=1;}

    var dataLength = dataSet.length,
        wdBar = width/dataLength, j=0, 
        padding = wdBar/6;
    wdBar = wdBar - (wdBar/3);

    xScale = d3.scale.linear()
        .domain([0, dataLength])
        .range([margin.left, width]);

    yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height, margin.top]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(dataLength)
        .tickFormat(function(i) { if (i < dataLength) return dataSet[i][xAxisMetric]; });

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(tickCt);

    var  xAxisDrawing = svg.append("g") // xAxis
        .attr("class", "axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", width / (3 * dataLength)) //".15em")
        .attr("transform", "rotate(-90)");

    var yAxisDrawing = svg.append("g") // Y Axis
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    var leftSideLabel = svg.append("text")  // Left Side Label
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height + margin.top)/2)
        .attr("y", margin.top-5)
        .style("text-anchor", "middle")
        .text(function() {
            return mappings[filterValues.metric];
        })
        .attr("class", "caption");

    var bottomLabel =  svg.append("text")   // Bottom Label
        .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + 2* margin.top) + ")")
        .style("text-anchor", "middle")
        .text(mappings[xAxisMetric])
        .attr("class", "caption");

    var bars = svg.selectAll(".bar")
        .data(dataSet)
        .enter().append("rect")
//        .attr("class", function(d){ return "bar pointer bar" + d.year; })
        .attr("class", function(d){ console.log("class", "bar pointer " + d.region_name.trim() + " bar" + d.year); 
            return "bar pointer " + d.region_name.trim() + " bar" + d.year; })
        .attr("x", function(d, i) { return padding + xScale(i); })
//              .attr("width", xScale.rangeBand())
        .attr("width", wdBar)
        .attr("y", function(d, i) { return yScale(+d[filterValues.metric]); })
        //if the value is too small to be displayed, set the height to a minimum 0.001 
        //to enable the tooltip to be displayed to show data on hover
        .attr("height", function(d) { 
            if (height != yScale(+d[filterValues.metric])) 
                return height - yScale(+d[filterValues.metric]); else return 0.001; })
        .append("title")
        .html(function(d) { 
            return (d.year + ": " + mappings[d.region_name] + ", " + d.cause_medium 
                + ", " + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric]) 
        });

        svg.selectAll(".bar")
            .on("click", function(d){
               $("#regionSelect").val(d.region_name);
               $("#filterForm").change();
            })
            .on("mouseover", function(d){

                if (d.region_name.trim() != 'GLB') {
                    className = '.' + d.region_name.trim();
                console.log("className", className); 
                  d3.selectAll(className)//.filter("path")
                        .attr("class", function(d) { return d3.select(this).attr("class") + " highlight" ; });
                   

//                    d3.selectAll(className).filter("rect")
//                        .attr("fill", "yellow")
//                        .attr("stroke", "yellow");
                }
           })
            .on("mouseout", function(d){
                if (d.region_name.trim() != 'GLB') {
                    className = '.' + d.region_name;
                    /*d3.selectAll(className).filter("path")
                        .attr("fill", function () {
                            return d3.select(this).attr("fill2")
                        });
                    */
                    $(className).removeClass("highlight");


                    d3.selectAll(".bar1990").classed("ZZZ", false);
                    d3.selectAll(className).filter("rect")
                        .attr("fill", "black")
                        .attr("stroke", "black");

                }
            });

      } // end regionBarChart function.
