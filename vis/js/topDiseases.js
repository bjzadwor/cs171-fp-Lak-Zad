/**
 * Created by Zadworney on 4/29/2014.
 */

function topDiseases(topDiseasesData, topDiseasesDiv){


    topDiseasesData.sort(function(a,b){
        return b[filterValues.metric] - a[filterValues.metric]
    })

    tableName = topDiseasesDiv + "table"
    tableNameShort = topDiseasesDiv.substr(1) + "table" // remove the #
    $(".topRegionsTable").remove();

    $(topDiseasesDiv).append('<table class="tabularData topRegionsTable" id = '+tableNameShort+'></table>');
    $(tableName).append("<tr><th>Region Name</th><th>"+mappings[filterValues.metric]+"</th></tr>")

    for (var i=0; i<10; i++){
        $(tableName).append("<tr><td>"+mappings[topDiseasesData[i].region_name]+"</td><td>"+topDiseasesData[i][filterValues.metric]+"</td></tr>");
    }


}