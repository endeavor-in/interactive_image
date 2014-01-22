<?php
/**
 * @file
 * interactive_image-page.tpl.php
 * Default page template for a interactive image.
 *  
 *  $interactive_image_visible_width - getting the visible width value from 
 *   configuration settings
 *  $image_uri - getting interactive image url
 *  $hotspot_image - getting hotspot image url
 *  $hotspot_label - show hotspot with title or show hotspot with legends
 *  $show_zoom_buttons - show button or don't show button
 *  $create_hotspots - show hotspot form for permitted user
 *  $explicit_width - holds the visible width value of interactive image. 
 *   Non-NULL value of this field will override the visible width value of 
 *   configuration settings.
 *  
 * page templates
 */

?>

  <!-- Get interactive image visible width from configuration settings or set default width.  -->  
<?php $interactive_image_visible_width = variable_get('interactive_image_visible_width', ''); ?>
<?php if ($explicit_width) : ?>
  <?php $interactive_image_visible_width = $explicit_width; ?>
<?php else: ?>
  <?php $interactive_image_visible_width = $interactive_image_visible_width ? $interactive_image_visible_width : '920'; ?>
<?php endif; ?>

<?php
  $legends = 0; $hotspot_height = 0; $hotspot_width = 0; $zoom_factor = 0.25;
  $legend_table = '';
  $realpath = drupal_realpath($image_uri);
  list($width, $height, $type, $attr) = getimagesize($realpath);
  $image_wrapper_width = $interactive_image_visible_width < $width ? $interactive_image_visible_width : $width;
?>
<div id="interactive-image-template" style="position: relative; width: <?php print $image_wrapper_width + 2; ?>px">    
  <div id="interactive-image-visiblearea" style="position: relative; width: <?php print $image_wrapper_width; ?>px; overflow: hidden; cursor:crosshair; border: 1px solid gray;">
    <div id="interactive-image-wrapper" >
      <?php if ($width <= $interactive_image_visible_width): ?>
        <img id="interactive-image" style="width: <?php print $width; ?>px; margin:auto;" rel="<?php print $width; ?>"  src="<?php print file_create_url($image_uri); ?>"  />
      <?php else: ?>
        <img id="interactive-image" style="width: <?php print $interactive_image_visible_width;?>px; margin: auto;" rel="<?php print $width; ?>"  src="<?php print file_create_url($image_uri); ?>"  />
      <?php endif; ?>
      <!-- Show hotspot. -->
      <?php foreach ($hotspots as $hotspot): ?>
        <?php if ($cluetip_local): ?>
          <?php $rel_value = '#hotspot-content-' . $hotspot['nid']; ?>
        <?php else: ?>
          <?php $rel_value = url('hotspot/show/' . $hotspot['nid']); ?>
        <?php endif; ?>
        <?php 
          $hotspot_width = $hotspot['hotspot_width'];
          $hotspot_height = $hotspot['hotspot_height'];
          $category_icon = $hotspot['category_icon'];
          $category_id = $hotspot['category_id'];
          $is_hot_area = $hotspot['is_hot_area'];
          $category_name = $hotspot['category_name'];
        ?>
        <?php $default_icon = base_path() . drupal_get_path('module', 'interactive_image') . '/hotspot.png' ?>       

         <?php if ($category_icon): ?>
          <?php $icon_file_path = $icon_dir . '/' . $category_icon . '.png';?>
          <span class="hotspot hotspot-category-<?php print $category_id; ?>" style="background-image: url('<?php print $icon_file_path; ?>'); position: absolute; height: <?php print $hotspot_height; ?>px; width: <?php print $hotspot_width; ?>px; background-repeat: no-repeat; top: <?php print $hotspot['top'] - ($hotspot_height); ?>px; left: <?php print $hotspot['left'] - ($hotspot_width / 2); ?>px;" rel="<?php print $rel_value; ?>" title="<?php print $hotspot['title']; ?>">
          </span>
        <?php elseif ($category_name && !$category_icon): ?>
          <span class="hotspot hotspot-category-<?php print $category_id; ?>" style="background-image: url('<?php print $default_icon; ?>'); position: absolute; height: <?php print $hotspot_height; ?>px; width: <?php print $hotspot_width; ?>px; background-repeat: no-repeat; top: <?php print $hotspot['top'] - ($hotspot_height); ?>px; left: <?php print $hotspot['left'] - ($hotspot_width / 2); ?>px;" rel="<?php print $rel_value; ?>" title="<?php print $hotspot['title']; ?>">
          </span>
        <?php elseif ($hotspot['hotspot_icon']): ?>
          <?php
            $icon_file_path = $icon_dir . '/' . $hotspot['hotspot_icon'] . '.png';
          ?>
          <span class="hotspot" style="background-image: url('<?php print $icon_file_path; ?>'); position: absolute; height: <?php print $hotspot_height; ?>px; width: <?php print $hotspot_width; ?>px; background-repeat: no-repeat; top: <?php print $hotspot['top'] - ($hotspot_height); ?>px; left: <?php print $hotspot['left'] - ($hotspot_width / 2); ?>px;" rel="<?php print $rel_value; ?>" title="<?php print $hotspot['title']; ?>">
          </span>
        <?php elseif ($is_hot_area): ?>
          <span class="hotspot hot-area  hotspot-category-<?php print $category_id; ?>" style="position: absolute; height: <?php print $hotspot_height; ?>px; width: <?php print $hotspot_width; ?>px; top: <?php print $hotspot['top']; ?>px; left: <?php print $hotspot['left']; ?>px;" rel="<?php print $rel_value; ?>" title="<?php print $hotspot['title']; ?>">
          </span>  
        <?php elseif ($hotspot_icon): ?>
          <?php
            $icon_file_path = $icon_dir . '/' . $hotspot_icon . '.png';
          ?>
          <span class="hotspot" style="background-image: url('<?php print $icon_file_path; ?>'); position: absolute; height: <?php print $hotspot_height; ?>px; width: <?php print $hotspot_width; ?>px; background-repeat: no-repeat; top: <?php print $hotspot['top'] - ($hotspot_height); ?>px; left: <?php print $hotspot['left'] - ($hotspot_width / 2); ?>px;" rel="<?php print $rel_value; ?>" title="<?php print $hotspot['title']; ?>">
          </span>        
        <?php else: ?>
          <div class="hotspot hotspot-image <?php print $category_id; ?>" style="position: absolute; height: 34px; width: 24px; background-repeat: no-repeat; top: <?php print $hotspot['top'] - 34; ?>px; left: <?php print $hotspot['left'] - 12; ?>px;" rel="<?php print $rel_value; ?>" title="<?php print $hotspot['title']; ?>">
          </div>          
        <?php endif;?>

        <!-- Show hotspot with title. -->
        <?php if($hotspot_label == 'use_title'): ?>
          <span class="hotspot-label" style="position: absolute; top: <?php print $hotspot['top'] - (10); ?>px; left: <?php print $hotspot['left'] + ($hotspot_width); ?>px;">
            <?php print $hotspot['title']; ?>
          </span>
        <?php endif; ?>
        <!-- Show hotspot with legends. -->
        <?php if($hotspot_label == 'use_legends'): ?>
          <span class="hotspot-label" style="position: absolute; top: <?php print $hotspot['top'] - (10); ?>px; left: <?php print $hotspot['left'] + ($hotspot_width); ?>px;">
            <?php print ++$legends; ?>
          </span>
          <?php $legend_table[] = '<div id="legends"><span>' . $legends . '. </span><span>' . $hotspot['title'] . '</span></div>'; ?>
        <?php endif; ?>
        
        <!-- Hidden hotspot content for 'local' cluetips  -->
        <?php if ($cluetip_local): ?>
        <div id="hotspot-content-<?php print $hotspot['nid']; ?>" style="display:none">
          <?php $hotspot_content = interactive_image_show_hotspot($hotspot['nid'], FALSE); ?>
          <?php print $hotspot_content;?>
        </div>
        <?php endif;?>
        <!-- Hidden hotspot content ends -->
      <?php endforeach; ?>  
    </div>
  </div> 
  <!-- Show hotspot form. -->
  <?php if ($create_hotspots): ?>
    <div id="floating" style="display: none; width: 600px;">
       <div class="close" title="close" >
       </div>
       <?php $form_html = render($form); ?>
       <?php print $form_html; ?>
    </div>  
  <?php endif; ?>
  
  <div class="interactive-image-controls">    
    <?php if (isset($categories)): ?>
      <ul id="category-controls"> 
        <?php $categories = array_unique($categories, SORT_REGULAR); ?>
            <li><input type="radio" value="0" name="interactive-image-category-display" class="interactive-image-category-display tid-0" checked />Show All</li>
        <?php foreach ($categories as $category) : ?>
          <?php if (isset($category['tid']) && $category['tid']): ?>
            <li><input type="radio" value="<?php print $category['tid']; ?>" name="interactive-image-category-display" class="interactive-image-category-display tid-<?php print $category['tid']; ?>"/>
            <?php if ($category['category_icon']): ?>
              <?php $icon_file_path = $icon_dir . '/' . $category['category_icon'] . '.png';?>
              <span style="background-image: url('<?php print $icon_file_path; ?>'); background-repeat: no-repeat; width: <?php print $category['hotspot_width']; ?>px; height: <?php print $category['hotspot_height']; ?>px">
              &nbsp; &nbsp; &nbsp;
              </span>
            <?php else:?>
              <?php $default_icon = base_path() . drupal_get_path('module', 'interactive_image') . '/hotspot.png' ?>
              <span style="background-image: url('<?php print $default_icon; ?>'); background-repeat: no-repeat; width: <?php print $category['hotspot_width']; ?>px; height: <?php print $category['hotspot_height']; ?>px">
              &nbsp; &nbsp; &nbsp;
                </span>
            <?php endif; ?>
            <?php print $category['name']; ?>  
              </li>
          <?php endif; ?>
        <?php endforeach; ?>
      </ul>        
    <?php endif;?>
    
    <ul id="other-controls">
      <?php if ($create_hotspots): ?>
        <li><input type="button" value="⬚" class="lasso" title="Enable Selector"></li>
      <?php endif; ?>
      <?php if ($show_zoom_buttons && ($width >= ($interactive_image_visible_width + ($zoom_factor * $interactive_image_visible_width)))):?>
        <li><input type="button" value="+" class="zoomin" title="Zoom in"></li>
        <li><input type="button" value="-" class="zoomout" title="Zoom out"></li>
      <?php endif; ?>    
    </ul>          
  </div>

  <!-- Show hotspot with legends. -->
  <?php if ($hotspot_label == 'use_legends'): ?>
    <?php if ($legends != 0): ?>
      <div id="legend-table">
        <div class="legend-title">Legends</div>
        <?php $legend_rows = intval($legends / 2); ?>
        <?php $first_column_row = $legend_rows + ($legends % 2); ?>
        <?php $row = 0; ?>
        <table style = "width:<?php print $interactive_image_visible_width ?>px;">
          <?php while ($row < $first_column_row): ?>
            <tr>
              <td style = "width:50%;">
                <?php print $legend_table[$row];?>
              </td>
              <td style = "width:50%;">
                <?php if ($legend_rows > $row): ?>
                  <?php $second_column_row = $first_column_row + $row; ?>
                  <?php print $legend_table[$second_column_row]; ?>
                <?php endif; ?>
              </td>
            </tr>
            <?php $row++; ?>
          <?php endwhile; ?>
        </table>      
      </div>
    <?php endif; ?>
  <?php endif;?>
</div>
