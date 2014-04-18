/**
 * Created by Zadworney on 4/18/2014.

 Contains functions to get and set cookies.
 Also contains functions which takes an object, and saves the JSON string
 representing that object as a cookie value, and functions to get the object out of the cookie

 Example code:
 setJsonCookie has 3 parameters, name, object, lifespan in days
 The following line of code creates a cookie called filter, takes in the filterValues object
 and creates a cookie which expires in 365 days.
 setJsonCookie("filter", filterValues, 365);


 The following line of code downloads the cookie "filter" and saves it to the object names filterValues
 filterValues = getJsonCookie("filter")
 Object {sex: "Both", year: "1990", region: "GLB", cause: "Tuberculosis", age: "All ages"…}

This code is based on the tutorial found here:
// http://www.w3schools.com/js/js_cookies.asp Accessed 4/18/2014

 */



function setCookie(cname,cvalue,exDays)
{
    var d = new Date();
    d.setTime(d.getTime()+(exDays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function setJsonCookie(cname, objValue, exDays)
{
    var d = new Date();
    d.setTime(d.getTime()+( exDays *24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + JSON.stringify(objValue) + "; " + expires;
}


function getAllCookie()
{
   return document.cookie;
}

function getAllCookies()
{
    return document.cookie;
}

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}
//This function finds the cookie named cname, and tries to parse it into an object.
function getJsonCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) {
            try {return JSON.parse(c.substring(name.length,c.length));}
            catch (error ){console.log("The selected cookie was not a valid JSON string. ", error); return "";}
        }
    }
    return "";
}

function checkCookie(cname)
{
    var cnameCookie=getCookie(cname);
    if (cnameCookie!="")
    {
        alert("Cookie Exists " + cnameCookie);
    }
    else
    {
        alert("Cookie Not Found");
    }
}