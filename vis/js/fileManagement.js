/**
 * Created by Zadworney on 4/23/2014.
 */


var data; var jsonCsv; var readData;
var fileSystem;
var fileName;
fileName = "datasmall5.json";
var start = new Date();
console.log("starting");
console.log(start);
getAndSaveFile();
// http://www.html5rocks.com/en/tutorials/file/filesystem/	 4/17/2014
//https://developers.google.com/chrome/whitepapers/storage#asking_more
//http://www.html5rocks.com/en/tutorials/offline/storage/ 4/17/2014
//http://www.smashingmagazine.com/2010/10/11/local-storage-and-how-to-use-it/



/* ****************************************************
 * Try opening the file system, if you successfully open the file system
 * call the function which gets the file out
 *
 * If the browser does not support webkit, catch the error
 *  there's nothing else to do here, we have to download the file
 *  from.
 ********************************************************/
function getAndSaveFile() {
    console.log("Step 1  downloadAndSaveFile executing");
    try {
        window.webkitRequestFileSystem(
            "PERSISTENT",
            30000000,
            function (fs) {
                console.log("Step 2. File System Opened Correctly.  Call openFileSystemAndGetMyFile")
                openFileSystemAndGetMyFile(fs, fileName)
            },
            function (error) {

                console.log("An Unanticipated Internal Error occurrred we will download the files the hard way.", error)
                downloadTheHardWay();
            }
        );
    }
    catch (err) {
        $('#loading').append("<h3>For faster load times and a better user experience, we recommend Google Chrome</h3>");
        console.log("I caught the error, this browser does not support the Webkit File System we will download the hard way: ", err);
        downloadTheHardWay();


     }
}
function saveFile(fs){
    d3.csv("data/fullsmall2.csv",function(csv){
        // convert our data to a string before we go any further, this way we can save the small data to the hd.
        jsonCsv = JSON.stringify(csv);
        console.log("We downloaded the data using d3.csv but it's small, so we need to expand it using processData.")
        processData(csv);

        console.log("Now we will save it to the local storage so future loads will be faster.")
        //Save our file to the file system, setting create: true in the second variable tells the fn to save.
        fs.root.getFile(fileName, {create: true}
            , function(fileEntry) {
            // Create a FileWriter object for our FileEntry (fileName).
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                    };
                    fileWriter.onerror = function(e){
                        console.log('Write failed: ' + e);
                    };
                    // Create a new Blob and write jsonCSV to it .
                    var blob = new Blob([jsonCsv], {type: 'text/plain'});
                    fileWriter.write(blob);
                    console.log("File correctly Written to local file storage");
                }, function(e){console.log("error2",e);});
            }
            , function(e){
                console.log("error3", e);
            }); // end fs.root.getFile
    });
}

/* *****************************************
*  This function takes in a file system reference and a file name.
*  it opens the file system and looks for the file.
*  If the file exists it gets the file from the local file system,
*  parses the data into the global object fullData      <---------------------------------------------------------------------------
*  if the file does not exist it calls the download function to save the file
*
 */
function openFileSystemAndGetMyFile(fs, internalFileName){

    // having nothing in the second variable means we are opening the data from the local file system.
    fs.root.getFile(internalFileName,{},
        function(fileEntry) { // success function
            console.log("Step 3. File found successfully, opening it and converting to an object.")
            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    fullData = JSON.parse(this.result);
                    processData(fullData);
                    console.log("Step4.  File has been converted from a JSON file to a JavaScriptObject, success!", fileName , " Has been downloaded and parsed into fullData");
                    };
                reader.readAsText(file);


            }, function (e) {
                console.log("error3", e);
                downloadTheHardWay();
            });
        }
        , function(e){ // error function.
            if (e.message == "A requested file or directory could not be found at the time an operation was processed."){
                // if we are getting an error with the message above, we opened a successful file system,
                // but the file does not exist
                // so we have to save it.
                console.log("The file did not exist yet, so we download it and save it to the file system.")
                saveFile(fs);
            }
            else { downloadTheHardWay();}

   });   // end fs.getFile.
}

function downloadTheHardWay(){
    console.log("Processing the data the long hard way by downloading it with d3.csvl");
    d3.csv("data/fullsmall2.csv", function (csv) {

        fullData = csv;
        console.log("Data is downloaded.  Time to draw the page.");
        processData(fullData);

    });

}
