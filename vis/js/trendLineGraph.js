/**
 * library for subgraphs
 */

var trendLineGraph = function(dataSet, trendGraphDiv) { //trendChartData
    var lineChart, xAxis, xScale, yAxis,  yScale;
    var lineChartContainerWidth = $(trendGraphDiv).width()
    var margin = { left: 40 , right: 0, top: 15, bottom: 40};
    var width = lineChartContainerWidth - margin.left - margin.right;
    var height = (.65*lineChartContainerWidth) - margin.bottom - margin.top;
    if (trendGraphDiv == "#mainVis") height = (250)
    var xAxisMetric = "age_name";

    lineChart = d3.select(trendGraphDiv).append("svg")
        .attr({ width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
            class: "lineChart"
        })
        .on("click", function(){
            $("#mainSelect").val("trendLineChart")
            $('#filterForm').change();
        });

        var arrData = [];
        for (var key in dataSet) {
            arrData.push(dataSet[key]);
        }
        
        var yMin = d3.min(arrData, function(d, i) { return d3.min(d, function(e, i) { return +e[filterValues.metric]; }); });
        var yMax = d3.max(arrData, function(d, i) { return d3.max(d, function(e, i) { return +e[filterValues.metric]; }); });

//        xScale = d3.scale.ordinal().rangeRoundBands([margin.left, width], .1);
        xScale = d3.scale.linear()
            .domain([0, dataSet["1990"].length-1])
            .range([margin.left, width]);

        yScale = d3.scale.linear()
            .domain([yMin, yMax])
            .range([height, margin.top]);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(dataSet["1990"].length-1)
            .tickFormat(function(i) { return dataSet["1990"][i][xAxisMetric]; });

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

        lineChart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.2em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-90)");

        lineChart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis);

        lineChart.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height + margin.top)/2)
            .attr("y", margin.top )
            .style("text-anchor", "middle")
            .html(function() {
                var retStr = mappings[filterValues.metric];
//console.log("### retStr", retStr, retStr.length, retStr.substr(0, 25) + "<br>" + retStr.substr(25, retStr.length));
//                retStr.wordWrap(25, "\n", 0);
                if (retStr.length > 25) {
                    retStr = retStr.substr(0, 25) + "<br>" + retStr.substr(25, retStr.length);
                }
                return retStr;
            })
            .attr("class", "caption");

        lineChart.append("text")
            .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + margin.top + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text(mappings[xAxisMetric]) 
            .attr("class", "caption");

        var color = d3.scale.category10()
            .domain(0, 2); 

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d, i) { return xScale(i); })
            .y(function(d, i) { return yScale(d[filterValues.metric]); });

        var yrData = lineChart.selectAll(".year")
            .data(arrData)
            .enter()
            .append("g")
            .attr("class", "year");

        yrData.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d);})
            .attr("data-legend",function(d) { return d[0].year})
            .attr("class", function(d, i) { return "line line" + d[0].year;})
            .append("title")
            .html(function(d) { 
                return  (d[0].year + ": " + mappings[d[0].region_name] + ", " 
                    + d[0].cause_medium + ", " + d.age_name + ", Sex-" + d[0].sex_name + " : " +d[filterValues.metric]) } );
;

/*         var legend = svg.append("g")
            .attr("class","legend")
            .attr("transform","translate(50,30)")
            .style("font-size","12px")
            .call(d3.legend);
*/        
}
