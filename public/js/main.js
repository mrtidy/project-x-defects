"use strict";

var defectsTemplate = $("#defectsTemplate").html();

/*
 * This puts in the defect data collected from the server and also calculates
 * an average value to show.
 */
var updateDefectsList = function (defectData) {
  $("#defectsList").html(Mustache.render(defectsTemplate, defectData));
}

/*
 * This posts the contents of the input field and waits for an updated
 * defects list from the server.  This takes care of things like clearing
 * the input field, disable / enable submit, etc.
 */
var postUpdatedDefectList = function () {
  var rawData = $("#rawData").val().trim();
  if(rawData.length < 1) {
    console.log("ignoring what looks like accidental press of submit");
    return;
  }

  $("#submitData").attr("disabled", "disabled");
  $("#defectsList").activity();
  $.ajax({
    type: "POST",
    url: "/defects",
    contentType: "text/csv",
    data: rawData,
    dataType: "json",
    timeout: 10000,
    success: function(defectData, textStatus) {
      updateDefectsList(defectData);
      $("#rawData").val('');
      $("#submitData").removeAttr("disabled");          
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if(textStatus === "timeout") {
        updateDefectsList({error: "Timed out waiting for the server.  Please try again."});
      } else {
        updateDefectsList({error: "Error from server: " + errorThrown});
      }
      // don't want to clear input in case they want to edit or try again
      $("#submitData").removeAttr("disabled");          
    }
  });
}

$(document).ready(function() {
    // on submit we'll post what we have and wait for the updated defects
    $("#submitData").click(postUpdatedDefectList);

    // when the page loads we GET the list of defects
    $("#defectsList").activity();
    $.ajax({
      url: "/defects",
      dataType: "json",
      success: function(defectData, textStatus) {
        updateDefectsList(defectData);
      },
      error: function() {
        updateDefectsList({});
      }
    });
});
