/**
 * Created by Zadworney on 4/20/2014.
 */
var regionGraphLoaded = false;
var regionBarChart = function(dataSet, regionGraphDiv) {
    var barChart, xAxis, xScale, yAxis,  yScale;
    var barChartContainerWidth = $(regionGraphDiv).width();
    var margin = { left: 40 , right: 0, top: 15, bottom: 40};
    var width = barChartContainerWidth - margin.left - margin.right;
    var height = (.65*barChartContainerWidth) - margin.bottom - margin.top;
    if (regionGraphDiv == "#mainVis") height = (250)

    if (regionGraphLoaded){
        var selectString = regionGraphDiv + " .barChart"
        d3.select(selectString).remove();
    }

    regionGraphLoaded = true;

    barChart = d3.select(regionGraphDiv).append("svg")
        .attr({ width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
            class: "barChart"
        })
        .on("click", function(d){
            $("#mainSelect").val("regionBarChart");
         $('#filterForm').change();

        } );

    var yMin = d3.min(dataSet, function(d) { return +d[filterValues.metric];} );   //<-------------------------------------------------------------------------------------------------
    var yMax = d3.max(dataSet, function(d) { return +d[filterValues.metric];} );   //<-------------------------------------------------------------------------------------------------


    xScale = d3.scale.linear()
        .domain([0, dataSet.length-1])
        .range([margin.left, width]);

    yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height, margin.top]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(dataSet.length-1)
        .tickFormat(function(i) { return dataSet[i]["region_name"]; });

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10);

    barChart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-90)");

    barChart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    barChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height + margin.top)/2)
        .attr("y", margin.top )
        .style("text-anchor", "middle")
        .text(function() {
            return filterValues.metric
        })
        .attr("class", "caption");

    barChart.append("text")
        .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + 2* margin.top) + ")")
        .style("text-anchor", "middle")
        .text("Regions") // needs to be replaced with filter data
        .attr("class", "caption");

    barChart.selectAll(".bar")
        .data(dataSet)
        .enter().append("rect")
        .attr("class",
        function(d){
            var classString = "bar "
            classString = classString + d.region_name;
            return classString;
        })
        .attr("x", function(d, i) { return xScale(i); })
//              .attr("width", xScale.rangeBand())
        .attr("width", (width/dataSet.length)-5)
        .attr("y", function(d, i) { return yScale(+d[filterValues.metric]); })
        //if the value is too small to be displayed, set the height to a minimum 0.001 to enable the tooltip to be displayed to show data on hover
        .attr("height", function(d) { if (height != yScale(+d[filterValues.metric])) return height - yScale(+d[filterValues.metric]); else return 0.001; })
        .append("title")
        .html(function(d) { return (region_short[d.region_name] + ", " + d.cause_medium + ", " + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric])});

}
