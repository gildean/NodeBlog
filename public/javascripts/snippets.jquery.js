$(document).ready(function() {
   $(".rte-zone").rte({
      media_url: "",
   });
   $( "#submit-slider" ).slidesubmit({
      form_wrap: false,
      form_atts: 'action="/posts/comment" method="post"',
      hidden_field: '.for-bots'
   });
 });
