/**
 * Created by Zadworney on 4/21/2014.
 */


createSimpleYearChart(yearChartDiv, simpleYearChartData){

   divWidth = yearChartDiv.width()



    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = divWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    d3.select(yearChartDiv).append("svg")
        .attr({ width: width + margin.left + margin.right,
                height: height + margin.top + margin.bottom,
                class: "simpleYearChartSVG"
        });

    var barChartRect = svg.append("rect")
        .attr({ width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
            class: "barChartRect",
            fill: "white"
        })
        .on("click", function(d){ // if a user click on the chart(not a bar) open in big window
            console.log("RegionBarChart Rectangle Clicked");
            $("#mainSelect").val("regionBarChart");
            $('#filterForm').change();

        });

}