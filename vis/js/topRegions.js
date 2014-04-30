/**
 * Created by Zadworney on 4/29/2014.
 */
/**
 * Created by Zadworney on 4/29/2014.
 */

function topRegions(topRegionsData, topRegionsDiv){


    topRegionsData.sort(function(a,b){
        return b[filterValues.metric] - a[filterValues.metric]
    })

    tableName = topRegionsDiv + "table"
    tableNameShort = topRegionsDiv.substr(1) + "table" // remove the #
    $(".topRegionsTable").remove();

    $(topRegionsDiv).append('<table class="tabularData topRegionsTable" id = '+tableNameShort+'></table>');
    $(tableName).append("<tr><th>Region Name</th><th>"+mappings[filterValues.metric]+"</th></tr>")

    for (var i=0; i<10; i++){
        $(tableName).append("<tr><td>"+mappings[topRegionsData[i].region_name]+"</td><td>"+topRegionsData[i][filterValues.metric]+"</td></tr>");
    }


}