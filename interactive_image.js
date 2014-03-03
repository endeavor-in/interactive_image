(function ($) {

  var zoomFactor = 0, position = new Array();
  var newImageWidth = 0;
  var imageWidth = 0;

  Drupal.behaviors.interactive_image = {
    attach: function (context, settings) {
    // Initialize the interactive image.
      interactiveImageInit();

    // Hotspot create and then show hotspot with interactive image.
      $('.node-interactive-image').ajaxSuccess(function(e, xhr, settings) {
      // check for ajax form submission
        if (settings.url.match(/system\/ajax/)) {
        // Re-initialize the interactive image after ajax loading it.
          interactiveImageInit();
          $('#floating').css('display','none');
        }
      });
    }
  };

  /**
   * interactive image initilization
   */
  function interactiveImageInit() {
    zoomFactor = 0;

    // Getting orginal interactive image width.
    var maxWidth = $('#interactive-image').attr('rel');

    // Getting view interactive image height and width.
    var imageHeight = $('#interactive-image').height();
    imageWidth      = $('#interactive-image').width();
    newImageWidth  = imageWidth;

    // Zoom in.
    $('.zoomin').click(function() {
      if (imageHeight == 0) {
        imageHeight = $('#interactive-image').height();
      }

      zoomFactor = zoomFactor + 0.25;

      if (maxWidth >= (imageWidth + (zoomFactor * imageWidth))) {
        // Interactive image width and height before zoom in.
        oldImageWidth  = $('#interactive-image').width();
        oldImageHeight = $('#interactive-image').height();

        // Interactive_image width and height after zoom in.
        $('#interactive-image-visiblearea').css({'height' : imageHeight + 'px'});
        $('#interactive-image').css({'width' : imageWidth + (zoomFactor * imageWidth) + 'px'});

        // Correct hostpot positions.
        setHotspotPositions();

        // Zoom in after interactive_image width and height.
        newImageWidth  = $('#interactive-image').width();
        newImageHeight = $('#interactive-image').height();

        // Call draggable.
        dragg();

        // Get interactive_image increasable left and top.
        var deltaLeft = (newImageWidth - oldImageWidth) / 2;
        var deltaTop  = (newImageHeight - oldImageHeight) / 2;

        // Get zoom in before interactive_image left and top position.
        // And.
        // Set zoom in afterinteractive_image left and top position.
        var position = $('#interactive-image-wrapper').position();
        $('#interactive-image-wrapper').css({
          'left': position.left - deltaLeft + 'px',
          'top' : position.top - deltaTop + 'px'
        });
      }
      else {
        zoomFactor = zoomFactor - 0.25;
      }
    });

    // Zoom out.
    $('.zoomout').click(function() {
      zoomFactor = zoomFactor - 0.25;
      if (zoomFactor > 0) {
        oldImageWidth   = $('#interactive-image').width();
        oldImageHeight = $('#interactive-image').height();
        $('#interactive-image').css({'width':imageWidth + (zoomFactor * imageWidth) + 'px'});
        setHotspotPositions();
        newImageWidth  = $('#interactive-image').width();
        newImageHeight = $('#interactive-image').height();
        dragg();
        var deltaLeft  = (newImageWidth - oldImageWidth) / 2;
        var deltaTop   = (newImageHeight - oldImageHeight) / 2;
        var position    = $('#interactive-image-wrapper').position();
        var newLeft    = position.left - deltaLeft;
        var newTop     = position.top - deltaTop;

        // Zoomout interactive_image left position less than 0px.
        if (newLeft < 0) {
          var visibleWidth = $('#interactive-image-visiblearea').width();
          if (newLeft < visibleWidth - newImageWidth) {
            var correctedLeft = visibleWidth - newImageWidth;
            $('#interactive-image-wrapper').css({'left':correctedLeft + 'px'});
          }
          else {
            $('#interactive-image-wrapper').css({'left':newLeft + 'px'});
          }
        }
        else {
          $('#interactive-image-wrapper').css({'left':0});
        }

        // Zoomout interactive_image top position less than 0px.
        if (newTop < 0) {
          var visibleHeight = $('#interactive-image-visiblearea').height();
          if (newTop < visibleHeight - newImageHeight) {
            var corrected_top = visibleHeight - newImageHeight;
            $('#interactive-image-wrapper').css({'top':corrected_top + 'px'});
          }
          else {
            $('#interactive-image-wrapper').css({'top':newTop + 'px'});
          }
        }
        else {
          $('#interactive-image-wrapper').css({'top':0});
        }
      }
      else {
        zoomFactor = 0;
        $('#interactive-image').css({'width':imageWidth + 'px'});
        $('#interactive-image-wrapper').css({'left':'0px','top':'0px'});
        dragg();
        setHotspotPositions();
      }
    });

    // Lasso click handler.
    $('.lasso').click(function() {
      var startX, startY, stopX, stopY;
      if (!$(this).hasClass('pressed')) {
        $('#interactive-image-wrapper')
        .selectable({
          start: function (e,ui) {
            // Get the starting point.
            startX = e.pageX - $(this).offset().left;
            startY = e.pageY - $(this).offset().top;
            if (zoomFactor) {
              startX = startX / (1 + zoomFactor);
              startY = startY / (1 + zoomFactor);
              startX = startX.toFixed(0);
              startY = startY.toFixed(0);
            }
          },
          stop: function (e,ui) {
            // Get the starting point.
            stopX = e.pageX - $(this).offset().left;
            stopY = e.pageY - $(this).offset().top;
            if (zoomFactor) {
              stopX = stopX / (1 + zoomFactor);
              stopY = stopY / (1 + zoomFactor);
              stopX = stopX.toFixed(0);
              stopY = stopY.toFixed(0);
            }

            // Show hotspot create form.
            var parentOffset = $('#interactive-image-template').offset();
            var parentTop = parentOffset.top;
            var scrollTop = $(window).scrollTop();
            var formTop = 100;
            var top = scrollTop - parentTop + formTop + 'px';
            $('#floating').css({
              'display':'block',
              'position':'absolute',
              'left':'150px',
              'top': top,
              'background-color':'#ffffff',
              'padding':'10px',
              'border':'1px solid',
              'z-index':'2'
            });

            // Set hidden field coordinates value.
            $('[name  = coordinates]').val(startX + ',' + startY + ' to ' + stopX + ',' + stopY);
          }
        })
        .draggable('destroy');
        $(this)
        .css('color','#BBB')
        .attr('title','Disable Selector')
        .addClass('pressed');

      }
      else {
        $('#interactive-image-wrapper')
        .selectable('destroy');
        // Restore the drag functionality.
        dragg();
        $(this)
        .css('color','inherit')
        .attr('title','Enable Selector')
        .removeClass('pressed');
      }

    });

    //check if user has permission to create hotspots 
    var createHotspots = Drupal.settings.interactive_image.create_hotspots;
    if (createHotspots) {
      //$('#interactive-image-wrapper').selectable();
      $('#interactive-image-wrapper').dblclick(function(e){

        // Get new hotspot left and top.
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;
        if (zoomFactor) {
          x = x / (1 + zoomFactor);
          y = y / (1 + zoomFactor);
          x = x.toFixed(0);
          y = y.toFixed(0);
        }

        // Show hotspot create form.
        var parentOffset = $('#interactive-image-template').offset();
        var parentTop = parentOffset.top;
        var scrollTop = $(window).scrollTop();
        var formTop = 100;
        var top = scrollTop - parentTop + formTop + 'px';
        $('#floating').css({
          'display':'block',
          'position':'absolute',
          'left':'150px',
          'top': top,
          'background-color':'#ffffff',
          'padding':'10px',
          'border':'1px solid',
          'z-index':'2'
        });

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

    // Get cluetip admin settings from drupal.
    var cluetipSettings = Drupal.settings.interactive_image.cluetip;

    // Close link text empty.
    cluetipSettings.closeText = '';

    // Assign cluetip admin settings to cluetip.js.
    $('.hotspot').cluetip(cluetipSettings);

    // Interactive image load and show hotspot.
    restrict_hotspots_by_category();
    $('#interactive-image-visiblearea').hover(
      function() {
        $('.hotspot.visible').show();
      },
      function() {
        $('.hotspot').hide();
      }
    );

    // Show only the selected category of hotspots.
    $('.interactive-image-category-display').click(restrict_hotspots_by_category);
  }

  //To restrict the hotspots icons based on category:
  function restrict_hotspots_by_category() {
    var selectedCategoryId = $('input[name=interactive-image-category-display]:checked').val();
    if (selectedCategoryId != 0) {
      $('.hotspot').removeClass('visible');
      $('.hotspot-category-' + selectedCategoryId).addClass('visible');
    }
    else {
      $('.hotspot').addClass('visible');
    }
  }

  /**
   * 
   * set hotspot position at zoom
   */
  function setHotspotPositions() {
    $('#interactive-image-wrapper .hotspot').each(function(index, element) {

      // Get hotspot left and top positions from drupal.
      var hotspots     = Drupal.settings.interactive_image.hotspots;
      var elementLeft = hotspots[index].left;
      var elementTop  = hotspots[index].top;

      // Get hotspot image width and height from drupal.
      var hotspotWidth   = hotspots[index].hotspot_width;
      var hotspotHeight  = hotspots[index].hotspot_height;

      // Check if hotspot area.
      var isHotArea = hotspots[index].is_hot_area;

      // Set hotspot position.
      if (isHotArea) {
        hotspotWidth += hotspotWidth * zoomFactor;
        hotspotHeight += hotspotHeight * zoomFactor;
        $(element).css({
          'position':'absolute',
          'left':elementLeft * (1 + zoomFactor) + 'px',
          'top':elementTop * (1 + zoomFactor) + 'px',
          'width':hotspotWidth,
          'height':hotspotHeight
        });
        $('.hotspot-label').eq(index).css({
          'position':'absolute',
          'left':elementLeft * (1 + zoomFactor) + 'px',
          'top':elementTop * (1 + zoomFactor) + 'px'
        });
      }
      else {
        $(element).css({
          'position':'absolute',
          'left':elementLeft * (1 + zoomFactor) - (hotspotWidth / 2) + 'px',
          'top':elementTop * (1 + zoomFactor) - (hotspotHeight) + 'px'
        });
        $('.hotspot-label').eq(index).css({
          'position':'absolute',
          'left':elementLeft * (1 + zoomFactor) + (hotspotWidth) + 'px',
          'top':elementTop * (1 + zoomFactor) - (hotspotHeight) + 'px'
        });
      }
    });
  }

  /**
   * interactive image dragg
   */
  function dragg() {

    // Visible image width and image width less than or equal.
    // Draggable option is disable.
    if (newImageWidth <= imageWidth) {
      $('#interactive-image-wrapper').draggable('disable');
    }
    else {
      $.globalVars = {
          originalTop: 0,
          originalLeft: 0,
          minTop: $("#interactive-image-visiblearea").height() - $('#interactive-image').height(),
          minLeft: $("#interactive-image-visiblearea").width() - $('#interactive-image').width()
      };
      $('#interactive-image-wrapper').draggable({
        start: function(event, ui) {
          if (ui.position != undefined) {

            // Set initially ui position top set gloablevariable original top and original left.
            $.globalVars.originalTop = ui.position.top;
            $.globalVars.originalLeft = ui.position.left;
          }
        },

        // Check draggable limit.
        drag: function(event, ui) {
          $('#interactive-image-wrapper').css({'cursor':'move'});
          var newTop  = ui.position.top;
          var newLeft = ui.position.left;
          if (ui.position.top < 0 && ui.position.top < $.globalVars.minTop) {
            newTop = $.globalVars.minTop;
          }
          if (ui.position.top > 0) {
            newTop = 0;
          }
          if (ui.position.left < 0 && ui.position.left < $.globalVars.minLeft) {
            newLeft = $.globalVars.minLeft;
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
