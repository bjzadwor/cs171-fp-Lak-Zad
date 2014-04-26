
$("#filterForm").change(function(){
    filterValues.main = $("#mainSelect").val();
    filterValues.region = $("#regionSelect").val();
    filterValues.cause = $("#causeSelect").val();
    filterValues.age = $("#ageSelect").val();
    filterValues.metric = $("#metricSelect").val();

    // After we load the valuse into the object, call the filter function
    filter();
});

$("#maleButton").click(function(){
    filterValues.sex = "Male";
    $(".sexButton").removeClass("btn-primary");
    $("#maleButton").addClass("btn-primary");
    filter();
});

$("#bothButton").click(function(){
    filterValues.sex = "Both";
    $(".sexButton").removeClass("btn-primary");
    $("#bothButton").addClass("btn-primary");
    filter();
});

$("#femaleButton").click(function(){
    filterValues.sex = "Female";
    $(".sexButton").removeClass("btn-primary");
    $("#femaleButton").addClass("btn-primary");
    filter();
});

$("#yr1990Button").click(function(){
    filterValues.year = "1990";
    $(".yrButton").removeClass("btn-primary");
    $("#yr1990Button").addClass("btn-primary");
    filter();
});

$("#yr2005Button").click(function(){
    filterValues.year = "2005";
    $(".yrButton").removeClass("btn-primary");
    $("#yr2005Button").addClass("btn-primary");
    filter();
});

$("#yr2010Button").click(function(){
    filterValues.year = "2010";
    $(".yrButton").removeClass("btn-primary");
    $("#yr2010Button").addClass("btn-primary");
    filter();
});

/*
*  filter()  This function loops through the data set testing each data point
*  adding it to the appropriate array if it is one of the data points needed for the visualization.
*  we build multiple arrays, as necessary for the different visualizations
*
* */
var yearChartData;
function filter(){

    var mapDivString, ageGroupBarChartDivString, regionalBarChartDivString, ageLineChartDivString;
    filteredData = [];
    barChartData = [];
    simpleYearChartData = [];
    console.log("filter firing");
    trendChartData = {};
    trendChartData["1990"] = [];
    trendChartData["2005"] = [];
    trendChartData["2010"] = [];
    trendBarData = {};
    trendBarData["1990"] = [];
    trendBarData["2005"] = [];
    trendBarData["2010"] = [];

    // Loop through the data, testing each data point and adding it to the appropriate array if it
    // is one of the data points needed for the visualization.
    fullData.every(function(element, index, array){


        // colorize the map
        // draw the region metrics bar chart
        if (
                ((element.cause_medium.trim() == cause_value[filterValues.cause]))
                && (element.year.trim() == filterValues.year)
                && (element.sex_name.trim() == filterValues.sex)
                && (element.age_name.trim() == age_value[filterValues.age])
            )
        {filteredData.push(element);}

        // build the dataset required to draw the bar chart of ages
        if ((element.cause_medium.trim() == cause_value[filterValues.cause])
            && (element.region_name.trim() == filterValues.region)
            && (element.year.trim() == filterValues.year)
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() != "All ages"))
        {barChartData.push(element);}

        if ((element.cause_medium.trim() == cause_value[filterValues.cause])
            && (element.region_name.trim() == filterValues.region)
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() == age_value[filterValues.age])
            )
        {simpleYearChartData.push(element);}

        if ((element.cause_medium.trim() == cause_value[filterValues.cause])
            && (element.region_name.trim() == filterValues.region)
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() != mappings["ALL"])) 
        {
            trendChartData[element.year.trim()].push(element);
        }

        if (((element.cause_medium.trim() == cause_value[filterValues.cause]))
//            && (element.year.trim() == filterValues.year)
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() == age_value[filterValues.age]))
        {
            trendBarData[element.year.trim()].push(element);
        }

        return true;
    })//end fullData.every

    setJsonCookie("filter", filterValues, 365);

    // set the cookie with the filter data.
    $('svg').remove();

    mapDivString = "#mainVis"
    ageGroupBarChartDivString = "#vis1"
    regionalBarChartDivString =  "#vis2"
    ageLineChartDivString = "#vis3"
    regionTrendChartString = "#vis6"


    switch (filterValues.main){
    case "map":

        console.log("drawing Map in Main Vis");


        break;
        case"ageBarChart":
            console.log("drawing Age Groups in Main Vis");
            ageGroupBarChartDivString = "#mainVis";
            mapDivString="#vis1";
        break;


        case "regionBarChart":
            regionalBarChartDivString = "#mainVis";
            mapDivString="#vis2";
        break;

        case "trendLineChart":
            ageLineChartDivString = "#mainVis";
            mapDivString="#vis3";
        break;

        case "trendBarChart":
            regionTrendChartString = "#mainVis";
            mapDivString="#vis6";
        break;

    default:
        console.log("Default Fired You should not be seeing this");
    break;

    }

    // drawMap(mapDivString);
    drawImprovedMap(mapDivString);
    createAgeBars(barChartData, ageGroupBarChartDivString);
    regionBarChart(filteredData, regionalBarChartDivString);
    trendLineGraph(trendChartData, ageLineChartDivString);
    regionTrendChart(trendBarData, regionTrendChartString);
}// end filter()
