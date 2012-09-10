"use strict";

var defectsTemplate = $("#defectsTemplate").html();

$(document).ready(function() {
    // on submit we'll post what we have and wait for the updated defects
    $("#submitData").click(function() {
      $("#submitData").attr("disabled", "disabled");
      $("#defectsList").activity();
      $.ajax({
        type: "POST",
        url: "/defects",
        contentType: "text/csv",
        data: $("#rawData").val(),
        dataType: "json",
        success: function(defectData, textStatus) {
          $("#defectsList").html(Mustache.render(defectsTemplate, defectData));
          $("#submitData").removeAttr("disabled");
        }
      });
    });

    // when the page loads we GET the list of defects
    $("#defectsList").activity();
    $.ajax({
      url: "/defects",
      dataType: "json",
      success: function(defectData, textStatus) {
        $("#defectsList").html(Mustache.render(defectsTemplate, defectData));
      }
    });
});
