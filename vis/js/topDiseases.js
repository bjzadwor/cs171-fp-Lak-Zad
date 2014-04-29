/**
 * Created by Zadworney on 4/29/2014.
 */

function topDiseases(topDiseasesDiv, topDiseasesData){


    topDiseasesData.sort(function(a,b){
        return a[filterValues.metric] - b[filterValues.metric]
    })

    console.log(topDiseasesData[1])
    console.log(topDiseasesData[2])
    console.log(topDiseasesData[3])

}