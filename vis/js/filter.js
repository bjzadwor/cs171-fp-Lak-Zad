
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

    var visTitleMap = "Choropleth Map"
         visTitle1 = "Age Bar Chart",
         visTitle2 = "Age/Sex Bar Chart",
         visTitle3 = "Age/Year Line Chart",
         visTitle4 = "Top Diseases",
         visTitle5 = "Region Bar Chart",
         visTitle6 = "Region/Sex Bar Chart",
         visTitle7 = "Region/Year Bar Chart",
         visTitle8 = "Top Regions";

        /* visTitle1 = "Age Group Metrics Distribution for sel. Cause & Region for " + filterValues.year,
        visTitle2 = "Age Group/Sex-wise Metrics for sel. Cause & Region for " + filterValues.year, 
        visTitle3 = "Age Group Metrics Trend 1990-2010 for sel. Cause & Region", 
        visTitle4 = "Tabular Visualization 4 - Top regions affected by sel. Cause", 
        visTitle5 = "Region-wise Metrics Distribution for sel. Cause, Sex & Region for " + filterValues.year, 
        visTitle6 = "Region-wise/Sex Metrics Distribution for sel. Cause & Age Group for " + filterValues.year, 
        visTitle7 = "Region-wise Metrics Trend 1990-2010 for sel. Cause, Sex & Age Group", 
        visTitle8 = "Tabular Visualization 8 - Top Mortality Causes for " + mappings[filterValues.region];*/

    var mapDivString, ageGroupBarChartDivString, regionalBarChartDivString, ageLineChartDivString,
        regionYearTrendChartDivString, ageSexTrendChartDivString, regionSexTrendChartDivString, topDiseasesDivString,
        topRegionsDivString;
    filteredData = [];
    ageBarChartData = [];
    simpleYearChartData = [];
    allDiseasesData=[];
    console.log("filter firing");
    ageYearLineTrendData = {};
    ageYearLineTrendData["1990"] = [];
    ageYearLineTrendData["2005"] = [];
    ageYearLineTrendData["2010"] = [];
    regionYearTrendData = {};
    regionYearTrendData["1990"] = [];
    regionYearTrendData["2005"] = [];
    regionYearTrendData["2010"] = [];
    ageSexTrendData = {};
    ageSexTrendData["Male"] = [];
    ageSexTrendData["Female"] = [];
    ageSexTrendData["Both"] = [];
    regionSexTrendData = {};
    regionSexTrendData["Male"] = [];
    regionSexTrendData["Female"] = [];
    regionSexTrendData["Both"] = [];


    // set the cookie with the filter data.
    setJsonCookie("filter", filterValues, 365);

    // Loop through the data, testing each data point and adding it to the appropriate array if it
    // is one of the data points needed for the visualization.
    fullData.every(function(element, index, array){

      // draw the region metrics bar chart
        if (((element.cause_medium.trim() == cause_value[filterValues.cause]))
                && (element.year.trim() == filterValues.year)
                && (element.sex_name.trim() == filterValues.sex)
                && (element.age_name.trim() == age_value[filterValues.age]))
        {filteredData.push(element);}

        // build the dataset required to draw the bar chart of ages
        if ((element.cause_medium.trim() == cause_value[filterValues.cause])
            && (element.region_name.trim() == filterValues.region)
            && (element.year.trim() == filterValues.year)
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() != mappings["ALL"]))
        {ageBarChartData.push(element);}

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
            ageYearLineTrendData[element.year.trim()].push(element);
        }

        if (((element.cause_medium.trim() == cause_value[filterValues.cause]))
            && (element.year.trim() == filterValues.year)
            && (element.age_name.trim() == age_value[filterValues.age]))
        {
            regionSexTrendData[element.sex_name.trim()].push(element);
        }

        if (((element.cause_medium.trim() == cause_value[filterValues.cause]))
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() == age_value[filterValues.age]))
        {
            regionYearTrendData[element.year.trim()].push(element);
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
    ageSexTrendChartDivString = "#vis2"
    ageLineChartDivString = "#vis3"
    topDiseasesDivString = "#vis4"
    regionalBarChartDivString =  "#vis5"
    regionSexTrendChartDivString = "#vis6"
    regionYearTrendChartDivString = "#vis7"
    topRegionsDivString = "#vis8"

    $('#vis1 span').text(visTitle1);
    $('#vis2 span').text(visTitle2);
    $('#vis3 span').text(visTitle3);
    $('#vis4 span').text(visTitle4);
    $('#vis5 span').text(visTitle5);
    $('#vis6 span').text(visTitle6);
    $('#vis7 span').text(visTitle7);
    $('#vis8 span').text(visTitle8);

    
    switch (filterValues.main){
    case "map":

        console.log("drawing Map in Main Vis");
        break;

        case"ageBarChart":
            console.log("drawing Age Groups in Main Vis");
            ageGroupBarChartDivString = "#mainVis";
            mapDivString="#vis1";
            $(mapDivString + ' span').text(visTitleMap);
            $(ageGroupBarChartDivString + ' span').text(visTitle1);
        break;

        case "trendAgeSexChart":
            ageSexTrendChartDivString = "#mainVis";
            mapDivString="#vis2";
            $(mapDivString + ' span').text(visTitleMap);
            $(ageSexTrendChartDivString + ' span').text(visTitle2);
        break;

        case "trendLineChart":
            ageLineChartDivString = "#mainVis";
            mapDivString="#vis3";
            $(mapDivString + ' span').text(visTitleMap);
            $(ageLineChartDivString + ' span').text(visTitle3);
        break;

        case "regionBarChart":
            regionalBarChartDivString = "#mainVis";
            mapDivString="#vis5";
            $(mapDivString + ' span').text(visTitleMap);
            $(regionalBarChartDivString + ' span').text(visTitle5);
        break;

        case "trendSexBarChart":
            regionSexTrendChartDivString = "#mainVis";
            mapDivString="#vis6";
            $(mapDivString + ' span').text(visTitleMap);
            $(regionSexTrendChartDivString + ' span').text(visTitle6);
        break;

        case "trendYearBarChart":
            regionYearTrendChartDivString = "#mainVis";
            mapDivString="#vis7";
            $(mapDivString + ' span').text(visTitleMap);
            $(regionYearTrendChartDivString + ' span').text(visTitle7);
        break;

        case "topRegions":
            topRegionsDivString = "#mainVis";
            mapDivString="#vis8"
            $(mapDivString + ' span').text(visTitleMap);
            $(topRegionsDivString + ' span').text(visTitle8);
        break;
        case "topDiseases":
            topDiseasesDivString = "#mainVis";
            mapDivString="#vis4"
            $(mapDivString + ' span').text(visTitleMap);
            $(topRegionsDivString + ' span').text(visTitle4);
        break;

    default:
        console.log("Default Fired You should not be seeing this");
    break;

    }

    // drawMap(mapDivString);
    drawImprovedMap(mapDivString);
    
    // checking if the filtered data is an empty dataset and display the viz accordingly
    if (isDataEmpty(ageBarChartData)) noDataToDisplay(ageGroupBarChartDivString);
    else createAgeBars(ageBarChartData, ageGroupBarChartDivString);

    if (isDataEmpty(filteredData)){
        noDataToDisplay(regionalBarChartDivString);
        noDataToDisplay(topRegionsDivString);
    }
    else{
        regionBarChart(filteredData, regionalBarChartDivString);
        topRegions(filteredData, topRegionsDivString);
    }

    if (isDataEmpty(ageYearLineTrendData)) noDataToDisplay(ageLineChartDivString);
    else trendLineGraph(ageYearLineTrendData, ageLineChartDivString);

    if (isDataEmpty(regionSexTrendData)) noDataToDisplay(regionSexTrendChartDivString);
    else regionSexTrendChart(regionSexTrendData, regionSexTrendChartDivString);

    if (isDataEmpty(regionYearTrendData)) noDataToDisplay(regionYearTrendChartDivString);
    else regionYearTrendChart(regionYearTrendData, regionYearTrendChartDivString);

    if (isDataEmpty(ageSexTrendData)) noDataToDisplay(ageSexTrendChartDivString);
    else ageSexTrendChart(ageSexTrendData, ageSexTrendChartDivString);

}// end filter()
