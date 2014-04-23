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
        // .append("g").attr({ 
        //     transform: "translate(" + margin.left + "," + margin.top + ")"
        // });
        var yMin = d3.min(dataSet["1990"], function(d) { return +d[filterValues.metric];} );
//                   d3.min(dataSet, function(dYear) { console.log(dYear); return d3.min(dYear, function(e) { return e[filterValues.metric]; }); });
        var yMax = d3.max(dataSet["1990"], function(d) { return +d[filterValues.metric];} );
console.log("yMin", yMin);
console.log("yMax", yMax);

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
            .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + 2* margin.top) + ")")
            .style("text-anchor", "middle")
            .text(mappings[xAxisMetric]) 
            .attr("class", "caption");

        var line = d3.svg.line()
//        .interpolate("basis")
        .x(function(d, i) { return xScale(i); })
        .y(function(d, i) { return yScale(d[filterValues.metric]); });

        var arrData = [];
        for (var key in dataSet) {
            arrData.push(dataSet[key]);
        }
        var yrData = lineChart.selectAll(".year")
            .data(arrData)
            .enter()
            .append("g")
            .attr("class", "year");

        yrData.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d);})
            .style("stroke", "red")
            .attr("class", "line");
        
/*        lineChart.selectAll(".bar")
            .data(dataSet)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d, i) { return xScale(i); })
//              .attr("width", xScale.rangeBand())
                .attr("width", (width/dataSet.length)-5)
                .attr("y", function(d, i) { return yScale(+d[filterValues.metric]); })
                //if the value is too small to be displayed, set the height to a minimum 0.001 to enable the tooltip to be displayed to show data on hover
                .attr("height", function(d) { if (height != yScale(+d[filterValues.metric])) return height - yScale(+d[filterValues.metric]); else return 0.001; })
                .append("title")
                .html(function(d) { return (d.year + ": " + region_short[d.region_name] + ", " + d.cause_medium + ", " + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric])});
*/

/*        var color = d3.scale.category10()
            .domain(d3.keys(dataSet[0]).filter(function(key) { return key !== "Year"; })); // ignore column heading 'Year'

        census = color.domain().map(function(source) { //define census obj with source name and array of years and estimates
            return {
                source: source,
                estimation: dataSet.map(function(d) {
                    return { year: +d["Year"], 
                             estimate: +d[source]};
                })
            };
        });
*/
}
