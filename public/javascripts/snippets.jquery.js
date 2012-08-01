$(document).ready(function() {
  $("#submit-slider").addClass("nosubmit");
    $(".email").blur(function(){
      if ($(this).val() != "") {
        $("#submit-slider").removeClass("nosubmit");
      } else {
        $("#submit-slider").addClass("nosubmit");     
      }
  });    
  $("#submit-slider").slidesubmit({
      form_wrap: false,
      hidden_field: '.for-bots'
   });
  //$("#volup").onmouseClick(function() {
  //  $(document.body).css( "font-size", "+=2.5%");
  //});
   
});
<<<<<<< HEAD
=======
   $(".rte-zone").rte({
      media_url: "",
   });
   $( "#submit-slider" ).slidesubmit({
      form_wrap: false,
      form_atts: 'action="/posts/comment" method="post"',
      hidden_field: '.for-bots'
   });
 });
>>>>>>> 4a3b8aa... Clien side js
=======

>>>>>>> 8299a42... Remove excess styles etc
