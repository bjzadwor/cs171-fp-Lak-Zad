/**
 * Created by Bijish on 4/24/2014.
 */

function regionSexTrendChart (trendBarDataSet, regionTrendDiv) {
    var barChart, xAxis, xScale, yAxis,  yScale, tickCt=10;
    var barChartContainerWidth = $(regionTrendDiv).width();
    var margin = { left: 40 , right: 0, top: 15, bottom: 40};
    var width = barChartContainerWidth - margin.left - margin.right;
    var height = (.65*barChartContainerWidth) - margin.bottom - margin.top;
    if (regionTrendDiv == "#mainVis") height = (250)
    var xAxisMetric = "region_name";

    var backgroundColor = $('body').css("background-color");
    svg = d3.select(regionTrendDiv).append("svg")
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
            $("#mainSelect").val("trendYearBarChart");
            $('#filterForm').change();
        });

    var arrData = [], dataLength=0, maxKeys=0;
    for (var key in trendBarDataSet) {
        arrData.push(trendBarDataSet[key]);
        if (trendBarDataSet[key].length > dataLength) { 
            dataLength = trendBarDataSet[key].length;
            maxKeys = key;
        }
    }

    var yMin = d3.min(arrData, function(d, i) { return d3.min(d, function(e, i) { return +e[filterValues.metric]; }); });
    var yMax = d3.max(arrData, function(d, i) { return d3.max(d, function(e, i) { return +e[filterValues.metric]; }); });
    if (yMin == yMax) { yMax = yMax + 0.01; tickCt=1;}

    xScale = d3.scale.linear()
        .domain([0, trendBarDataSet[maxKeys].length])
        .range([margin.left, width]);

    yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height, margin.top]);

    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(trendBarDataSet[maxKeys].length)
        .tickFormat(function(i) { if (i < trendBarDataSet[maxKeys].length) return trendBarDataSet[maxKeys][i][xAxisMetric]; });

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
        .attr("dy", width / (3 * trendBarDataSet[maxKeys].length)) //".15em")
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

    var wdBar = width / (trendBarDataSet[maxKeys].length * 3), j=0, 
        padding = wdBar/2;
    wdBar = wdBar - (wdBar/3);

    var keySet = ["Male", "Both", "Female"];
    for (var j=0; j < keySet.length; j++) { //for (var key in keySet) {
		var keyClass = ".bar" + keySet[j];
        var bars = svg.selectAll(keyClass)
            .data(trendBarDataSet[keySet[j]])
            .enter().append("rect")
            .attr("class", function(d) { return "bar pointer bar" + d.sex_name; })
            .attr("x", function(d, i) { return padding + xScale(i) + wdBar * j; })
            .attr("width", wdBar)
            .attr("y", function(d, i) { return yScale(+d[filterValues.metric]); })
            //if the value is too small to be displayed, set the height to a minimum 0.001 
            //to enable the tooltip to be displayed to show data on hover
            .attr("height", function(d) { 
                if (height != yScale(+d[filterValues.metric])) 
                    return height - yScale(+d[filterValues.metric]); else return 0.001; })
            .append("title")
            .html(function(d) { 
                return (d.year + ": " + mappings[d.region_name] + ", " + d.cause_medium + ", " 
                    + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric]) } )
    }

    svg.selectAll(".bar")
        .on("click", function(d){
           $("#regionSelect").val(d.region_name);
           $("#filterForm").change();
        })
        .on("mouseover", function(d){
            className = '.'+ d.region_name;
            d3.selectAll(className).filter("path")
                .attr("fill", "yellow");

            d3.selectAll(className).filter("rect")
                .attr("fill", "yellow")
                .attr("stroke", "yellow");
        })
        .on("mouseout", function(d){

            className = ".bar" + d.year;

        d3.selectAll(className).filter("path")
           .attr("fill", function(){return d3.select(this).attr("fill2")});

        d3.selectAll(className).filter("rect")
            .attr("fill", "black")
            .attr("stroke", "black");
        });

    } // end regionSexTrendChart function.
