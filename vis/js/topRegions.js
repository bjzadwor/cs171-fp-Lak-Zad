/**
 * Created by Zadworney on 4/29/2014.
 */
/**
 * Created by Zadworney on 4/29/2014.
 */

function topRegions(topRegionsData, topRegionsDiv){
var numToDisplay;

    topRegionsData.sort(function(a,b){
        return b[filterValues.metric] - a[filterValues.metric]
    })

    tableName = topRegionsDiv + "table"
    tableNameShort = topRegionsDiv.substr(1) + "table" // remove the #
    $(".topRegionsTable").remove();

    $(topRegionsDiv).append('<table class="tabularData topRegionsTable" id = '+tableNameShort+'></table>');
    $(tableName).append("<tr><th>Region Name</th><th>"+mappings[filterValues.metric]+"</th></tr>")

    numToDisplay = 8
    if (topRegionsDiv=="#mainVis")numToDisplay = 10

    for (var i=0; i<numToDisplay; i++){
       try{
           $(tableName).append("<tr><td>"+mappings[topRegionsData[i].region_name]+"</td><td>"+topRegionsData[i][filterValues.metric]+"</td></tr>");
       }
        catch(err){
            console.log(err);
        }
    }


}