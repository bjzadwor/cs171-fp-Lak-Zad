/**
 * Created by Zadworney on 4/30/2014.
 */

function story(input){
console.log(input);
divID = "#"+input;
    console.log(divID);
    $("#"+input).addClass("hidden");

    switch (input){
        case "":
            break;


        default:
        break;


    }
}

function exitInstructions(){
    console.log("Exiting Instructions")
    $('.allInstructions').addClass("hidden");
}