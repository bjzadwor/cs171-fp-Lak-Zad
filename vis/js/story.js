/**
 * Created by Zadworney on 4/30/2014.
 */

function showInstructions(input){

    switch (input){

        case -1:  // Load the page, disregarding the cookie
            $(".instructions1").removeClass("hidden");
            $('.stop').prop("checked", false);

        break;
        case 0:
            console.log("Case0Fired")
           // This is the default start status, so we need to check for the cookie on page load.
           if (!getLoadingCookie()) $(".instructions1").removeClass("hidden");

        break;
        case 1: // this is the function call from the first page of instructions;
            console.log("Case 1 Fired");
            $(".instructions1").addClass("hidden");
            if ($('#openingInstructions .stop').is(':checked'))
            {
                setLoadingCookie(1);
                console.log("Setting Loading Cookie");

            }
            else {
                $(".instructions2").removeClass("hidden");

            }
        break;
        case 2:
            console.log("Case 2 Fired");
            $(".instructions2").addClass("hidden");
            if ($('#mainVisInstructions .stop').is(':checked'))
            {
                setLoadingCookie(1);
                console.log("Setting Loading Cookie");

            }
            else {
                $(".instructions3").removeClass("hidden");

            }
        break;
        case 3:
            console.log("Case 3 Fired");
            $(".instructions3").addClass("hidden");
            if ($('#filterFormInstructions .stop').is(':checked'))
            {
                setLoadingCookie(1);
                console.log("Setting Loading Cookie");

            }
            else {
                $(".instructions4").removeClass("hidden");

            }
        break;
        case 4:
            console.log("Case 4 Fired");
            $(".instructions4").addClass("hidden");
        if ($('#smallVisInstructions .stop').is(':checked'))
            {
                setLoadingCookie(1);
                console.log("Setting Loading Cookie");

            }
            else {
                $(".instructions5").removeClass("hidden");

            }
        break;
        default:
            break;


    }
}

function setLoadingCookie(input){

    switch(input) {
        case 1:
            setCookie("loadInstructions", "true", "365");
    break;

        case 0:
            setCookie("loadInstructions", "false", "365")
    break;


    }
}

function getLoadingCookie(){
    if (getCookie("loadInstructions") == "true"){
        return true;}
    else return false;
}

function helpButtonClicked(){
   showInstructions(-1);
}