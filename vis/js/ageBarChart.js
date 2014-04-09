/**
 * library for subgraphs
 */


var csvData;
/*
d3.csv("data/global.csv", function(data) {
    csvData = data;
    var chartData = [];
    csvData.forEach(function(d, i) {
        if (d.cause_medium == "Tuberculosis" && d.year == "2010" && d.sex_name == "Both" && d.age_name != "All ages") { 
            d.death_abs = parseFloat(d.death_abs.split(',').join('')); // replacing commas and storing as a number
            chartData.push(d);
        }
    });
//console.log(chartData);

    createAgeBars(chartData, "#vis1");
});
*/
var ageBarsPreviouslyLoaded
var createAgeBars = function(dataSet, div) {
    var ageBars, xAxis, xScale, yAxis,  yScale;
    var barChartContainerWidth = $(div).width()
    var margin = { left: 60 , right: 20, top: 25, bottom: 30};
    var width = barChartContainerWidth - margin.left - margin.right;
    var height = (.65*barChartContainerWidth) - margin.bottom - margin.top;

    if (ageBarsPreviouslyLoaded){

        var selectString = div + " .ageBars"
        console.log (selectString)
        d3.select(selectString).remove();
    }


    ageBarsPreviouslyLoaded = true;

    ageBars = d3.select(div).append("svg")
        .attr({ width: width + margin.left + margin.right,
                height: height + margin.top + margin.bottom,
                class: "ageBars"
        })
       .on("click", function(){
            modal.open({content: $('<div id="bigChart"  style="width:800px"></div>')});
            createAgeBars(barChartData, "#bigChart");
        } );
        // .append("g").attr({ 
        //     transform: "translate(" + margin.left + "," + margin.top + ")"
        // });
        var yMin = d3.min(dataSet, function(d) { return +d[filterValues.metric];} );   //<-------------------------------------------------------------------------------------------------
        var yMax = d3.max(dataSet, function(d) { return +d[filterValues.metric];} );   //<-------------------------------------------------------------------------------------------------

//        xScale = d3.scale.ordinal().rangeRoundBands([margin.left, width], .1);
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
            .tickFormat(function(i) { return dataSet[i]["age_name"]; });

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10);

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

        ageBars.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height + margin.top)/2)
            .attr("y", margin.top )
            .style("text-anchor", "middle")
            .text(function(){
                return filterValues.metric


            })                                                                                    // needs to be replaced with filter data
            .attr("class", "caption");

        ageBars.append("text")
            .attr("transform", "translate(" + ((width + margin.left) / 2) + " ," + (height + 2* margin.top) + ")")
            .style("text-anchor", "middle")
            .text("Age Groups") // needs to be replaced with filter data
            .attr("class", "caption");

        ageBars.selectAll(".bar")
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
                .html(function(d) { return (d.region_name + ", " + d.cause_medium + ", " + d.age_name + ", Sex-" + d.sex_name + " : " +d[filterValues.metric])});

                
 }



