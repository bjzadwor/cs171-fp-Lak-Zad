/**
 * Created by Bryan on 4/3/14.
 */

var mapContainerWidth = $('#mapContainer').width()


var path, vis, xy;
var map;
var tip;
var globalCsv;
var colorScale;
var scaleValues;
var region_name = {};
var region_short = {};
var cause_medium = {};
var cause_value = {};
var age_value = {};
var age_name = {};
var metric = {};
var mappings = {};
var className;
var cause_value_var = 0;
var age_value_var = 0;
var fullData;
var filteredData;
var barChartData;
var trendChartData;
var ageSexTrendData;
var geoJSON;
var dataLoaded;
var geoJSONLoaded;
var mappingsLoaded;
var sex = {male: "Male", female: "Female", both: "Both"};
var filterValues = {sex: "Both", year:"2010", age: "20", main: "map", region: "GLB", metric: "death_rate"};

var backgroundColor, male, female, both, ninety, ten, five;


backgroundColor = $('body').css("background-color");
$("select").addClass("blueBackground");

male = "#0000FF" ;
female = "#FF3399";
both = "#801ACC";
ninety = "#005824";
five   = "#41ae76";
ten = "#99d8c9";



dataLoaded = false;
geoJSONLoaded = false;
mappingsLoaded = false;



metric["death_rate"] = "Death Rate Per 100,000";
metric["Death Rate Per 100,000"] = "death_rate";
metric["DALY_rate"] = "Disability Adjusted Life Years per 100,000";
metric["Disability Adjusted Life Years per 100,000"] = "DALY_rate";
metric["YLD_rate"] = "Years Lived with Disabilty per 100,000";
metric["Years Lived with Disabilty per 100,000"] = "YLD_rate";
metric["YLL_rate"] = "Years of Life Lost per 100,000";
metric["Years of Life Lost per 100,000"] = "YLL_rate";



/*
*  loop through the regions and build the objects we use to translate
 */

// Load the list of regions and set up the Region Select Box and the Region Decode Document
d3.csv("data/region.csv", function(csv){
   csv.forEach(function(row){
       if(!(row.fullRegion in region_name)){
            region_name[row.fullRegion.trim()]=row.shortRegion.trim()
            region_short[row.shortRegion.trim()]=row.fullRegion.trim()
            $("#regionSelect")
                .append($("<option></option>")
                    .attr("value",row.shortRegion.trim())
                    .text(row.fullRegion.trim()));
        }
    })


}) // end csv("data/region.csv")

d3.csv("data/mappings.csv", function(csv){
    csv.forEach(function(row) {
        mappings[row.short_name] = row.full_name;
    })
    mappingsLoaded = true;
});

// Load the data set
d3.csv("data/fullsmall.csv", function(csv){
//d3.csv("http://www.zadworney.com/z/vis/filter.php", function(csv){
    globalCSV = csv;
	csv.forEach( function(row){

        if (!(row.cause_medium in cause_medium)){
            cause_medium[row.cause_medium] = cause_value_var;
            cause_value[cause_value_var] = row.cause_medium;
            $("#causeSelect")
                .append($("<option></option>")
                    .attr("value",cause_value_var)
                    .text(row.cause_medium));
            cause_value_var++;
        }

        if (!(row.age_name in age_name)){
            age_name[row.age_name] = age_value_var;
            age_value[age_value_var]= row.age_name;
            $("#ageSelect")
                .append($("<option></option>")
                    .attr("value",age_value_var)
                    .text(row.age_name));
            age_value_var++;
        }

        switch(row.year){
            case "90":
                row.year = "1990";
                break;
            case "5":
                row.year = "2005";
                break;
            case "10":
                row.year = "2010";
                break;
        }

    })  // csv for each
    fullData = csv;
    console.log("Full Data Loaded")
    dataLoaded = true;
    if (dataLoaded && geoJSONLoaded && mappingsLoaded){ drawPage();}

})


d3.json("json/Combined.geojson", function(json) {

    geoJSON = json;
    console.log("geoJson Loaded")
    geoJSONLoaded = true;
    if (dataLoaded && geoJSONLoaded  && mappingsLoaded ){ drawPage();}

});

function drawPage() {

    // Download the cookie into an object
    filterCookieValue = getJsonCookie("filter");
    // if the cookie existed set the filter form to the values from the cookie
    if(filterCookieValue != ""){
        filterValues = filterCookieValue;
        $('#mainSelect').val(filterValues.main);
        $('#regionSelect').val(filterValues.region);
        $('#causeSelect').val(filterValues.cause);
        $('#ageSelect').val(filterValues.age);
        $('#metricSelect').val(filterValues.metric);
        $(".sexButton").removeClass("btn-primary");
        $(".yrButton").removeClass("btn-primary")

        switch(filterValues.sex)
        {
            case "Male":
                $("#maleButton").addClass("btn-primary")
            break;
            case "Both":
                $("#bothButton").addClass("btn-primary")
            break;
            case "Female":
                $("#femaleButton").addClass("btn-primary")
            break;
        }

        switch(filterValues.year)
        {
            case "1990":
                $("#yr1990Button").addClass("btn-primary")
                break;
            case "2005":
                $("#yr2005Button").addClass("btn-primary")
                break;
            case "2010":
                $("#yr2010Button").addClass("btn-primary")
                break;
        }
    }


     $("#filterForm").change();
     $("#loadingOverlay").addClass("hidden");

}
