$(document).ready(function() {

    $("#submit-slider").addClass("nosubmit");
    $(".email").blur(function(){
        if ($(this).val() != "") {
            $("#submit-slider").removeClass("nosubmit");
        } else {
            $("#submit-slider").addClass("nosubmit");     
        }
    });    
   $(".rte-zone").rte({
      media_url: "",
   });
   $( "#submit-slider" ).slidesubmit({
      form_wrap: false,
      hidden_field: '.for-bots'
   });
 });
