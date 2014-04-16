<?php


// get the query params from the url
// if we don't press in a query param it will be an empty string
// and we can test for that later


$region = htmlspecialchars($_GET["region"]);
$cause_medium = htmlspecialchars($_GET["cause_medium"]);
$age = htmlspecialchars($_GET["age"]);
$metric = htmlspecialchars($_GET["metric"]);
$sex = htmlspecialchars($_GET["sex"]);
$year = htmlspecialchars($_GET["year"]);


$fileName = 'filteredData.csv';
 
 // This code is based on this link:  http://ran.ge/2009/10/27/howto-create-stream-csv-php/
 // Set the response headers
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header('Content-Description: File Transfer');
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename={$fileName}");
header("Expires: 0");
header("Pragma: public");
header("Access-Control-Allow-Origin: *");  // this allows us to download from our home networks.


// add the query params in as response headers, this makes testing easier
header("cause_medium: "  . $cause_medium); 
header("region_name: " . $region_name);
header("year: "  . $year);  
header("age_nme: "  . $age_name); 
header("sex_name: "  . $sex_name);
header("metric: "  . $metric); 


$cause_medium_val = 0;
$region_name_val = 1;
$year_val = 2;
$age_name_val = 3;
$sex_name_val = 4;


//Open the stream
$fh = @fopen( 'php://output', 'w' );


// file open in read only mode
if (($handle = fopen("data/fullSmall.csv", "r")) !== FALSE) {
 	$column_headers = fgetcsv($handle); // read the first row.
	fputcsv($fh, $column_headers); // write the first row to the csv as the header row
	
	// change this to while to get it to loop change to 'if' to get it to run once
	while(($data = fgetcsv($handle, 1000, ",")) !== FALSE) { // loop through the rest of the rows, filtering the data
		if(
			(true) // this will be used later for a test to see if the line has been added yet, 
			and(($cause_medium == "") or ($cause_medium == $data[$cause_medium_val])) // either cause_medium was not passed in as a queryParam, or it matches
	
		){
	 	fputcsv($fh,$data); // the fputcsv file will the entire row into the csv file
	
	
		}// end if	 
  }// end while (($data = fgetcsv (or if)       
	



//$column_headers = fgetcsv($handle); // read the second row.
//fputcsv($fh, $column_headers); // write the first row to the csv as the header row





} // end if (($handle = fopen


// Close the file
fclose($fh);
// Make sure nothing else is sent, our file is done
exit;
?>