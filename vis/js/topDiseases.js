/**
 * Created by Zadworney on 4/29/2014.
 */

function topDiseases(topDiseasesData, topDiseasesDiv){
var numToDisplay;

    topDiseasesData.sort(function(a,b){
        return b[filterValues.metric] - a[filterValues.metric]
    })

    tableName = topDiseasesDiv + "table"
    tableNameShort = topDiseasesDiv.substr(1) + "table" // remove the #
    $(".topDiseasesTable").remove();

    $(topDiseasesDiv).append('<table class="tabularData topDiseasesTable" id = '+tableNameShort+'></table>');
    $(tableName).append("<tr><th width=\"75%\">Causes</th><th>"+mappings[filterValues.metric]+"</th></tr>")

    numToDisplay = 5
    if (topDiseasesDiv=="#mainVis")numToDisplay = 10

    for (var i=0; i<numToDisplay; i++){
     try{
         $(tableName).append("<tr><td>"+topDiseasesData[i].cause_medium+"</td><td>"+topDiseasesData[i][filterValues.metric]+"</td></tr>");
     }
        catch(err){
            console.log(err)
        }
    }


}