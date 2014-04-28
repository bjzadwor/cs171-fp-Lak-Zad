
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

var isDataEmpty = function(validateDataSet) {
    var emptyData=true;
    for (var key in validateDataSet) 
        if (validateDataSet[key] != null && validateDataSet[key].length != 0) 
            emptyData = false;
    return emptyData;
}

/*
*  filter()  This function loops through the data set testing each data point
*  adding it to the appropriate array if it is one of the data points needed for the visualization.
*  we build multiple arrays, as necessary for the different visualizations
*
* */
var yearChartData;
function filter(){

    var mapDivString, ageGroupBarChartDivString, regionalBarChartDivString, ageLineChartDivString;
    var regionTrendChartDivString, ageSexTrendChartDivString;
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
    ageSexTrendData = {};
    ageSexTrendData["Male"] = [];
    ageSexTrendData["Female"] = [];
    ageSexTrendData["Both"] = [];


    // set the cookie with the filter data.
    setJsonCookie("filter", filterValues, 365);

    // Loop through the data, testing each data point and adding it to the appropriate array if it
    // is one of the data points needed for the visualization.
    fullData.every(function(element, index, array){

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
            && (element.age_name.trim() != mappings["ALL"]))
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
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() == age_value[filterValues.age]))
        {
        trendBarData[element.year.trim()].push(element);
        }

        if ((element.cause_medium.trim() == cause_value[filterValues.cause])
            && (element.region_name.trim() == filterValues.region)
            && (element.year.trim() == filterValues.year)
            && (element.age_name.trim() != mappings["ALL"]))
        {
        ageSexTrendData[element.sex_name.trim()].push(element);
        }

        return true;
    })//end fullData.every



    // remove all the vis so we can re-draw them
    $('svg').remove();





    mapDivString = "#mainVis"
    ageGroupBarChartDivString = "#vis1"
    regionalBarChartDivString =  "#vis5"
    ageLineChartDivString = "#vis4"
    regionTrendChartDivString = "#vis7"
    ageSexTrendChartDivString = "#vis2"

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
            mapDivString="#vis5";
        break;

        case "trendLineChart":
            ageLineChartDivString = "#mainVis";
            mapDivString="#vis4";
        break;

        case "trendAgeSexChart":
            ageSexTrendChartDivString = "#mainVis";
            mapDivString="#vis2";
        break;

        case "trendBarChart":
            regionTrendChartDivString = "#mainVis";
            mapDivString="#vis7";
        break;

    default:
        console.log("Default Fired You should not be seeing this");
    break;

    }

    // drawMap(mapDivString);
    drawImprovedMap(mapDivString);
    
    // checking if the filtered data is an empty dataset and display the viz accordingly
    if (isDataEmpty(barChartData)) noDataToDisplay(ageGroupBarChartDivString);
    else createAgeBars(barChartData, ageGroupBarChartDivString);

    if (isDataEmpty(filteredData)) noDataToDisplay(regionalBarChartDivString);
    else regionBarChart(filteredData, regionalBarChartDivString);

    if (isDataEmpty(trendChartData)) noDataToDisplay(ageLineChartDivString);
    else trendLineGraph(trendChartData, ageLineChartDivString);

    if (isDataEmpty(trendBarData)) noDataToDisplay(regionTrendChartDivString);
    else regionTrendChart(trendBarData, regionTrendChartDivString);

    if (isDataEmpty(ageSexTrendData)) noDataToDisplay(ageSexTrendChartDivString);
    else ageSexTrendChart(ageSexTrendData, ageSexTrendChartDivString);

}// end filter()
