(function ($) {
  Drupal.behaviors.interactive_image_form_actions = {
    attach: function (context, settings) {
      // When hotspot category is selected, the hotspot icon is reset to none
      $('#edit-field-hotspot-category select').change(function() {
        $('#icon-selector-wrapper select').val('_none');
        $('#icon-preview').remove();
      });

      // Likewise, when hotspot icon is selected, the hotspot category is reset to none
      $('#icon-selector-wrapper select').change(function() {
        $('#edit-field-hotspot-category select').val('_none');
      });
    }
  };
}(jQuery));
