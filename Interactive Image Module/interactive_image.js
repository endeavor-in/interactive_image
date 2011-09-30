(function ($) {

  var zoom_factor = 0,position = new Array(),new_image_width = 0,initial = 0,zoom_time = 0;
  var image_width = 0;

  $(document).ready(function() {

    //getting rich text editor type from drupal
    var rte_editor =  Drupal.settings.interactive_image.rte_editor;   

    //jquery_ui.js  file exists or not
    var jquery_ui_installed = Drupal.settings.interactive_image.jquery_ui_installed;

    //interactive image load and show hotspot
    $('#interactive-image').load(function() {
      $('.hotspot').show();
    });

    var url_pattern;    
    if (rte_editor == 'ckeditor') {
      url_pattern = /ckeditor\/xss/;
    }
    else if (rte_editor == 'wysiwyg' || rte_editor == 'normal') {
      url_pattern = /system\/ajax/;
    }

    $('#interactive-image-template').wrap('<div id="interactive-image-template-wrapper"></div>');
    interactive_image_init();

    //hotspot create and then show hotspot with interactive image
    $('#interactive-image-template-wrapper').ajaxSuccess(function(e, xhr, settings) {
      if (settings.url.match(url_pattern)) {
        interactive_image_init();
        $('#floating').css('display','none');
        $('.form-text, .form-textarea',this).val('');
      }        
    });    
  });

  /**
   * interactive image initilization
   */
  function interactive_image_init() {
    zoom_factor = 0;

    //getting orginal interactive image width 
    var max_width = $('#interactive-image').attr('rel');

    //getting view interactive image height and width 
    var image_height = $('#interactive-image').height();
    image_width      = $('#interactive-image').width();
    new_image_width  = image_width;

    //zoom in 
    $('.zoomin').click(function() {
      zoom_factor = zoom_factor + 0.25;

      if (max_width >=  (image_width + (zoom_factor * image_width))) {
        //zoom in before getting interactive image width and height
        old_image_width  = $('#interactive-image').width();
        old_image_height = $('#interactive-image').height();

        //zoom in after interactive_image width and height
        $('#interactive-image-visiblearea').css({'height' : image_height + 'px'});
        $('#interactive-image').css({'width' : image_width + (zoom_factor * image_width) + 'px'});

        //zoom in after get the hotspot postion and show hotspot  
        get_hotspot_position();

        //zoom in after interactive_image width and height
        new_image_width  = $('#interactive-image').width();
        new_image_height = $('#interactive-image').height();

        //call draggable
        dragg();

        //get interactive_image increasable left and top 
        var delta_left = (new_image_width - old_image_width) / 2;
        var delta_top  = (new_image_height - old_image_height) / 2;

        //get zoom in before interactive_image left and top position 
        //and
        //set zoom in afterinteractive_image left and top position
        var position = $('#interactive-image-wrapper').position();
        $('#interactive-image-wrapper').css({'left': position.left - delta_left + 'px','top' : position.top - delta_top + 'px'});
      } 
      else {
        zoom_factor = zoom_factor - 0.25;
      }
    });

    //zoom out 
    $('.zoomout').click(function() {
      zoom_factor = zoom_factor - 0.25;
      if (zoom_factor > 0) {
        old_image_width   = $('#interactive-image').width();
        old_image_height = $('#interactive-image').height();
        $('#interactive-image').css({'width':image_width + (zoom_factor * image_width) + 'px'});
        get_hotspot_position();
        new_image_width  = $('#interactive-image').width();
        new_image_height = $('#interactive-image').height();
        dragg();
        var delta_left  = (new_image_width - old_image_width) / 2;
        var delta_top   = (new_image_height - old_image_height) / 2;
        var position    = $('#interactive-image-wrapper').position();
        var new_left    = position.left - delta_left;
        var new_top     = position.top - delta_top;

        //zoomout interactive_image left position less than 0px 
        if (new_left < 0) {
          var visible_width = $('#interactive-image-visiblearea').width();
          if (new_left < visible_width - new_image_width) {
            var corrected_left = visible_width - new_image_width;
            $('#interactive-image-wrapper').css({'left':corrected_left + 'px'});
          }
          else {
            $('#interactive-image-wrapper').css({'left':new_left + 'px'});
          }              
        }
        else {
          $('#interactive-image-wrapper').css({'left':0});
        }

        //zoomout interactive_image top position less than 0px 
        if (new_top < 0) {
          var visible_height = $('#interactive-image-visiblearea').height();
          if (new_top < visible_height - new_image_height) {
            var corrected_top = visible_height - new_image_height;
            $('#interactive-image-wrapper').css({'top':corrected_top + 'px'});
          }
          else {
            $('#interactive-image-wrapper').css({'top':new_top + 'px'});
          }              
        }
        else {
          $('#interactive-image-wrapper').css({'top':0});
        }           
      }
      else {
        zoom_factor = 0;
        $('#interactive-image').css({'width':image_width + 'px'});
        $('#interactive-image-wrapper').css({'left':'0px','top':'0px'});
        get_hotspot_position();
      }
    });

    //hotspot create form permission get from drupal
    var create_hotspots =  Drupal.settings.interactive_image.create_hotspots;
    if (create_hotspots) {
      $('#interactive-image-wrapper').dblclick(function(e){  

        //get new hotspot left and top 
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;
        if (zoom_factor) {
          x = x / (1 + zoom_factor);
          y = y / (1 + zoom_factor);
          x = x.toFixed(0);
          y = y.toFixed(0);
        }       

        //show hotspot create form 
        $('#floating').css({'display':'block','position':'absolute','left':'150px','top':'0px','background-color':'#ffffff','padding':'10px','border':'1px solid','z-index':'2'});

        //set hidden field coordinates value
        $('[name  = coordinates]').val(x + ',' + y);      
      });
    }

    $('.close').click(function() {
      $('#floating').css('display','none');      
    }); 

    $('#floating form #fake-submit').click(function() {
      $('#floating form .wysiwyg-toggle-wrapper a').click();
      $('#floating form .form-submit').mousedown();      
    });

    //get cluetip admin settings from drupal
    var cluetip_settings = Drupal.settings.interactive_image.cluetip;

    //close link text empty
    cluetip_settings.closeText = '';

    //assign cluetip admin settings to cluetip.js
    $('.hotspot').cluetip(cluetip_settings);
  }


  /**
   * set hotspot position at zoom
   */
  function get_hotspot_position() {
    $('#interactive-image-wrapper .hotspot').each(function(index, element) {

      //get hotspot left and top positions from drupal
      var hotspots     = Drupal.settings.interactive_image.hotspots_data.hotspot;
      var element_left = hotspots[index].left;
      var element_top  = hotspots[index].top;

      //get hotspot image width and height from drupal
      var hotspot_width   = Drupal.settings.interactive_image.hotspots_data.hotspot_width;
      var hotspot_height  = Drupal.settings.interactive_image.hotspots_data.hotspot_height;

      //set hotspot position
      $(element).css({'position':'absolute','left':element_left * (1 + zoom_factor) - (hotspot_width / 2) + 'px','top':element_top * (1 + zoom_factor) - (hotspot_height / 2) + 'px'});
      $('.hotspot-label').eq(index).css({'position':'absolute','left':element_left * (1 + zoom_factor) + (hotspot_width) + 'px','top':element_top * (1 + zoom_factor) - (10) + 'px'});

    });  
  }


  /**
   * interactive image dragg
   */
  function dragg() {

    //visible image width and image width less than or equal 
    //draggable option is disable
    if (new_image_width <= image_width) {
      $('#interactive-image-wrapper').draggable( 'disable' );
    }
    else {

      $.globalVars = {
          originalTop: 0,
          originalLeft: 0,
          maxHeight:$('#interactive-image').height() - $("#interactive-image-visiblearea").height(),
          maxWidth: $('#interactive-image').width() - $("#interactive-image-visiblearea").width()
      };
      $('#interactive-image-wrapper').draggable( {
        start: function(event, ui) {
          if (ui.position != undefined) {

            //set initially ui position top set gloablevariable original top and original left
            $.globalVars.originalTop = ui.position.top;
            $.globalVars.originalLeft = ui.position.left;
          }
        },

        //check draggable limit
        drag: function(event, ui) {
          $('#interactive-image-wrapper').css({'cursor':'move'});
          var newTop  = ui.position.top;
          var newLeft = ui.position.left;
          if (ui.position.top < 0 && ui.position.top * -1 > $.globalVars.maxHeight) {
            newTop = $.globalVars.maxHeight * -1;
          }
          if (ui.position.top > 0) {
            newTop = 0;
          }
          if (ui.position.left < 0 && ui.position.left * -1 > $.globalVars.maxWidth) {
            newLeft = $.globalVars.maxWidth * -1;
          }
          if (ui.position.left > 0) {
            newLeft = 0;
          }
          ui.position.top  = newTop;
          ui.position.left = newLeft;
        },
        stop : function() {
          $('#interactive-image-wrapper').css({'cursor':'auto'});
        }
      });
    }
  }

}(jQuery)); 
