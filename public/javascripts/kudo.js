var sending_kudo = false;
function sendKudoInfoToServer(element_id){
 var kudosid = element_id.replace('-','/')
if (! sending_kudo){
sending_kudo = true;
$.get('/' + kudosid, function() {});
console.log("kudo sent");
setTimeout("sending_kudo = false;", 50);}}
function startKudoing(element) {
element.oldKudoText = element.children("p.count").html();
element.children("p.count").hide();
element.append('<p class="count notice"><span class="dont-move">Hold it!</span></p>');
element.addClass("filling").removeClass("animate");
element.parent("figure").addClass("filling");
element_id = element.attr('id')
setTimeout("sendKudo('" + element_id +"')", 1050 );
}
function endKudoing(element) {
if (element.hasClass("kudoable")){
element.removeClass("filling").addClass("animate");
element.parent("figure").removeClass("filling");
element.children("p.count").show();
element.children("p.notice").remove();
element.children("p.count").fadeIn("slow");
}}
function sendKudo(element_id) {
var element = $("#"+element_id);
if (element.hasClass('kudoable') && element.hasClass("filling") ){
element.flag = true;
element.article = element.closest("article").attr("id");
sendKudoInfoToServer(element_id);
element.removeClass("animate").removeClass("kudoable").removeClass("filling").addClass("completed");
element.parent("figure").removeClass("filling");
$.cookie(element.article, true);
var count = $('#'+element_id+'-count');
newnum = parseInt(count.text()) + 1;
count.html(newnum);
element.children("p.notice").hide().remove();
element.children("p.count").show();
count.fadeIn();
}}
$(function() {
$("a.kudos").each(function(e) {
var id = $(this).closest("article").attr("id");
if ($.cookie(id)){
$(this).removeClass("animate").removeClass("kudoable").addClass("completed");
}});
$.kudo = {};
$.kudo.flag = false;
$.kudo.article = false;
$("a.kudos").click(function(e) {
e.preventDefault();
return false;
});
$("a.kudos").mouseenter(function() {
var k = $(this);
if (k.hasClass("kudoable")){startKudoing(k);}
}).mouseleave(function() {
var k = $(this);
endKudoing(k);
});
$("a.kudos").live("touchstart", function(b) {
var k = $(this);
if (k.hasClass("kudoable")){startKudoing(k);}
b.preventDefault();
return false;});
$("a.kudos").live("touchend", function(b) {
var k = $(this);
endKudoing(k);
b.preventDefault();
return false;});
});
