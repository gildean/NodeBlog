/* 
    Slide Submit - A jQuery plugin
    ==================================================================
    Copyright 2012 JasonLau.biz - Version 1.0.1
    ==================================================================
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Requires jQuery UI Slider.
    
*/

(function($){
 	$.fn.extend({ 
 		slidesubmit: function(options) {
			var defaults = {
			    value : 1,
                label : 'Slide To Submit',
                label_position: 'before',
                width : '100px',
                form_wrap: false,
                form_atts: 'action="#" method="post"',
                hidden_field: false,
                slide_enable: false  
			}
				
			var option =  $.extend(defaults, options);
            var obj = $(this);

    		return this.each(function() {
    		  if(option.slide_enable){
    		      obj.addClass('slide-submit-enable');
                  $('.slide-submit-submit').toggleClass('disabled', true);
              } else {
                obj.addClass('slide-submit-submit');
              }
              
              obj.slider({
                    value:0,
                    min: 0,
                    max: option.value,
                    step: 1,
                    slide: function( event, ui ) {
                        if(ui.value == option.value){
                            if(obj.hasClass('disabled')){
                                return false;
                            }
                            if(option.hidden_field){
                                if($(option.hidden_field).val() != ''){
                                    return false;
                                }
                            }                          
                            if(option.slide_enable){
                                obj.parent().find(":disabled").prop('disabled',false);
                                $('.slide-submit-submit').toggleClass('disabled', false);
                            } else {
                               if(option.form_wrap){
                                obj.parent().wrap('<form ' + option.form_atts + '></form>');
                               }
                               obj.closest("form").submit(); 
                            }
                            
                        } else {
                           if(option.slide_enable){
                                obj.parent().find("input, button, select, textarea").prop('disabled',true);
                                $('.slide-submit-submit').toggleClass('disabled', true);
                            } 
                        }
                    }
                })
                .css({width: option.width});
                if(option.label && option.label != ''){
                    if(option.label_position == 'before'){
                        obj.before('<label class="slide-submit-label">' + option.label + '<label>');
                    } else {
                        obj.after('<label class="slide-submit-label">' + option.label + '<label>');
                    }
                }                
                $('.ui-slider-handle').css({'cursor': 'e-resize'})
    		});
    	}
	});
	
})(jQuery);

