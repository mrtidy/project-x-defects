var defectsTemplate = $("#defectsTemplate").html();

var defectData = {
    "metadata": {
        date: "Date",
        severities: ["Sev2", "Sev3", "Sev4"],
        toVerify: "To Verify",
        opened: "Total Open Defects",
        total: "Total Bugs"
    }, 
    "defects": [
        {date: "2012-01-01", severities: [1, 229, 61], toVerify: 159, opened: 291, total: 1223},
        {date: "2012-01-02", severities: [1, 232, 61], toVerify: 147, opened: 294, total: 1228},
        {date: "2012-01-03", severities: [2, 238, 67], toVerify: 147, opened: 306, total: 1240},
        {date: "2012-01-04", severities: [2, 237, 66], toVerify: 154, opened: 305, total: 1252},
        {date: "2012-01-05", severities: [2, 228, 59], toVerify: 170, opened: 289, total: 1261},
        {date: "2012-01-06", severities: [2, 228, 59], toVerify: 162, opened: 289, total: 1263},
        {date: "2012-01-07", severities: [2, 228, 59], toVerify: 162, opened: 289, total: 1263},
        {date: "2012-01-08", severities: [2, 228, 59], toVerify: 161, opened: 289, total: 1263},
        {date: "2012-01-09", severities: [1, 224, 62], toVerify: 158, opened: 287, total: 1267}
    ]
};

/*
 * This is temporary - CSV will actually be parsed server-side.
 *
 * Taken from http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
 */
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
 
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
 
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
 
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );
 
 
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
 
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
 
 
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){
 
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];
 
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
                ){
 
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );
 
            }
 
 
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){
 
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );
 
            } else {
 
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[ 3 ];
 
            }
 
 
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
 
        // Return the parsed data.
        return( arrData );
    };

$(document).ready(function() {
    /*
     * TODO - this callback will actually post to the server but working
     * out the logic here first.
     *
     * Pull the headers out of the first row: we'll store the values as
     * metadata to use in the defects list in the UI.  We expect the format
     * of the raw data to have the first column as the date, last column as
     * the total, second-to-last as total opened on a give day, third-to-last
     * as the total left to verify, and then the rest as the list of opened
     * defects by severity.
     */
    $("#submitData").click(function() {
        var rawDataArray = CSVToArray($("#rawData").val());

        // use the first row for metadata
        var rawMetadata = rawDataArray.shift();

        // we expect every row to be this same length
        var rowLength = rawMetadata.length;

        var defectData = {
          metadata: {
            date: rawMetadata[0],
            severities: rawMetadata.slice(1, -3),
            toVerify: rawMetadata[rowLength - 3],
            opened: rawMetadata[rowLength - 2],
            total: rawMetadata[rowLength - 1]
          },
          defects: []
        };
        for(var row in rawDataArray) {
          defectData.defects.push({
            date: rawDataArray[row][0],
            severities: rawDataArray[row].slice(1, -3),
            toVerify: rawDataArray[row][rowLength - 3],
            opened: rawDataArray[row][rowLength - 2],
            total: rawDataArray[row][rowLength - 1]
          });
        }
        $("#defectsList").html(Mustache.render(defectsTemplate, defectData));
    });

    // TODO - move this to callback of request to server for defect data
    $("#defectsList").html(Mustache.render(defectsTemplate, defectData));
});
