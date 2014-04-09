
$("#filterForm").change(function(){
    filterValues.region = $("#regionSelect").val();
    filterValues.cause = cause_value[$("#causeSelect").val()];
    filterValues.age = age_value[$("#ageSelect").val()];
    filterValues.metric = $("#metricSelect").val();
    filter();
})

$("#maleButton").click(function(){
    filterValues.sex = "Male";
    $(".sexButton").removeClass("btn-primary");
    $("#maleButton").addClass("btn-primary");
    filter();
})

$("#bothButton").click(function(){
    filterValues.sex = "Both";
    $(".sexButton").removeClass("btn-primary");
    $("#bothButton").addClass("btn-primary");
    filter();
})

$("#femaleButton").click(function(){
    filterValues.sex = "Female";
    $(".sexButton").removeClass("btn-primary");
    $("#femaleButton").addClass("btn-primary");
    filter();
})

$("#yr1990Button").click(function(){
    filterValues.year = "1990";
    $(".yrButton").removeClass("btn-primary");
    $("#yr1990Button").addClass("btn-primary");
    filter();
})

$("#yr2005Button").click(function(){
    filterValues.year = "2005"
    $(".yrButton").removeClass("btn-primary")
    $("#yr2005Button").addClass("btn-primary")
    filter();
})

$("#yr2010Button").click(function(){
    filterValues.year = "2010"
    $(".yrButton").removeClass("btn-primary")
    $("#yr2010Button").addClass("btn-primary")
    filter();
})




function filter(){
    filteredData = [];
    barChartData = [];
    fullData.every(function(element, index, array){

        if (
                ((element.cause_medium.trim() == filterValues.cause))
                // && true // ((filterValues.region == null)||(element.region_name.trim() == filterValues.region))
                && (element.year.trim() == filterValues.year)
                && (element.sex_name.trim() == filterValues.sex)
                && (element.age_name.trim() == filterValues.age)
            )
        {

            filteredData.push(element)
        }


        if ((element.cause_medium.trim() == filterValues.cause)
            && (element.region_name.trim() == filterValues.region)
            && (element.year.trim() == filterValues.year)
            && (element.sex_name.trim() == filterValues.sex)
            && (element.age_name.trim() != "All ages")){
            barChartData.push(element)
        }

        /*            if (filteredData.length > 21  ) return false;
         else return true;

         */
        return true;
    })
    createAgeBars(barChartData, "#vis1");
    drawChartColors();
}// end filter()
