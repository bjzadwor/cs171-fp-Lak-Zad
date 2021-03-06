/**
 * library for subgraphs
 */

var trendLineGraph = function(dataSet, trendGraphDiv) { //trendChartData
    var lineChart, xAxis, xScale, yAxis,  yScale, tickCt=10, rad=2, xAxisAngle="-90";
    var lineChartContainerWidth = $(trendGraphDiv).width()
    var margin = { left: 40 , right: 0, top: 15, bottom: 60};
    var width = lineChartContainerWidth - margin.left - margin.right;
    var height = (.65*lineChartContainerWidth) - margin.bottom - margin.top;
    if (trendGraphDiv == "#mainVis") { height = 250; rad = 3; xAxisAngle="-50"; }
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

    var arrData = [], dataLength=0, maxKeys;
    for (var key in dataSet) {
        arrData.push(dataSet[key]);
        if (dataSet[key].length > dataLength) { 
            dataLength = dataSet[key].length;
            maxKeys = key;
        }
    }
    
    var yMin = d3.min(arrData, function(d, i) { return d3.min(d, function(e, i) { return +e[filterValues.metric]; }); });
    var yMax = d3.max(arrData, function(d, i) { return d3.max(d, function(e, i) { return +e[filterValues.metric]; }); });
    if (yMin == yMax) { yMax = yMax + 0.01; tickCt=1;}

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
        .tickFormat(function(i) { if (i < dataLength) return dataSet[maxKeys][i][xAxisMetric]; });

    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(tickCt);

    lineChart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.2em")
            .attr("dy", width / (3 * dataLength)) //".15em")
            .attr("transform", "rotate(" + xAxisAngle + ")");

    lineChart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    lineChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height + margin.top)/2)
        .attr("y", margin.top-5)
        .style("text-anchor", "middle")
        .html(function() {
            var retStr = mappings[filterValues.metric];
            if (retStr.length > 25) {
                retStr = retStr.substr(0, 25) + "<br>" + retStr.substr(25, retStr.length);
            }
            return retStr;
        })
        .attr("class", "caption");

    lineChart.append("text")
        .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + (trendGraphDiv == "#mainVis"? 1.25 : 1) * margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text(mappings[xAxisMetric]) 
        .attr("class", "caption");

    var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d, i) { return xScale(i) + width / (3 * dataLength); })
        .y(function(d, i) { return yScale(d[filterValues.metric]); });

    var yrData = lineChart.selectAll(".year")
        .data(arrData)
        .enter()
        .append("g")
        .attr("class", "year");

    yrData.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d);})
        .attr("data-legend",function(d) { if (d.length > 0) return d[0].year})
        .attr("class", function(d, i) { if (d.length > 0) return "line line" + d[0].year;});

    for (var key in dataSet) {
       var computedClass = "circle" + dataSet[key][0].year;
        lineChart.selectAll(computedClass)
            .data(dataSet[key])
            .enter()
            .append("circle")
                .attr("class", computedClass)
                .attr("cx", function(d, i) { return xScale(i) + width / (3 * dataLength); })
                .attr("cy", function(d, i) { return yScale(d[filterValues.metric]); })
                .attr("r", rad)
                .append("title")
                .html(function(d, i) { 
                    return  (d.year + ": " + mappings[d.region_name] + ", " + d.cause_medium + ", " 
                        + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric]) 
                });
    }

/*  var legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate(50,30)")
        .style("font-size","12px")
        .call(d3.legend);
*/
}
