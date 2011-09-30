<?php
/**
 * @file interactive_image-page.tpl.php
 * Default page template for a interactive image.
 *  
 *  $interactive_image_visible_width - getting the visible width value from configuration settings
 *  $image_uri - getting interactive image url
 *  $hotspot_image - getting hotspot image url
 *  $hotspot_label - show hotspot with title or show hotspot with legends
 *  $show_zoom_buttons - show button or don't show button
 *  $create_hotspots - show hotspot form for permitted user
 *  
 * page templates
 */
?>

<?php //get interactive image visible width from configuration settings or set default width  ?>
<?php $interactive_image_visible_width = variable_get('interactive_image_visible_width',''); ?>
<?php $interactive_image_visible_width = $interactive_image_visible_width ? $interactive_image_visible_width : '920'; ?>
<?php $legends = 0; $hotspot_height = 0; $hotspot_width = 0;$zoom_factor = 0.25; ?>
<?php $legend_table = ''; ?>
<div id="interactive-image-template" style="position:relative;">
	<?php list($width, $height, $type, $attr) = getimagesize(file_create_url($image_uri));?>
	<?php //get hotspot image or set default hotspot image  ?>
	<?php if (isset($hotspot_image)):?>
		<?php list($hotspot_width, $hotspot_height, $hotspot_type, $hotspot_attr) = getimagesize(file_create_url($hotspot_image));?>
	<?php endif;?>
	<?php if($hotspot_height > 20): ?>
		<?php $hotspot_height = 20; ?>
	<?php endif; ?>
	<?php if($hotspot_width > 20): ?>
		<?php $hotspot_width = 20; ?>
	<?php endif; ?>
	<div id="interactive-image-visiblearea" style="position:relative;width:<?php print $interactive_image_visible_width;?>px;overflow:hidden">
		<div id="interactive-image-wrapper" >
			<?php if ($width <= $interactive_image_visible_width): ?>
				<img id="interactive-image" style="width:<?php print $width;?>px;margin:auto;" rel="<?php print $width; ?>"  src="<?php print file_create_url($image_uri); ?>"  />
			<?php else: ?>
				<img id="interactive-image" style="width:<?php print $interactive_image_visible_width;?>px;margin:auto;" rel="<?php print $width; ?>"  src="<?php print file_create_url($image_uri); ?>"  />
			<?php endif; ?>
			<?php //show hotspot ?>
			<?php foreach ($hotspots as $hotspot): ?>
				<?php if (isset($hotspot_image)):?>
					<span class="hotspot" style="background-image:url('<?php print image_style_url('hotspot_image',$hotspot_image); ?>');position:absolute;height:<?php print $hotspot_height; ?>px;width:<?php print $hotspot_width; ?>px;background-repeat:no-repeat;top:<?php print $hotspot['top'] - ($hotspot_height / 2); ?>px;left:<?php print $hotspot['left'] - ($hotspot_width / 2); ?>px;" rel="<?php print url('hotspot/show/' . $hotspot['nid']); ?>" title="<?php print $hotspot['title']; ?>">
					</span>
				<?php else:?>
					<div class="hotspot hotspot-image" style="position:absolute;height:5px;width:5px;background-repeat:no-repeat;top:<?php print $hotspot['top'] - 2.5; ?>px;left:<?php print $hotspot['left'] - 2.5; ?>px;" rel="<?php print url('hotspot/show/' . $hotspot['nid']); ?>" title="<?php print $hotspot['title']; ?>">
					</div>
					<?php $hotspot_height = 5; $hotspot_width = 5; ?>
				<?php endif;?>	
				<?php //show hotspot with title?>
				<?php if($hotspot_label == 'use_title'):?>
					<span class="hotspot-label" style="position:absolute;top:<?php print $hotspot['top'] - (10); ?>px;left:<?php print $hotspot['left'] + ($hotspot_width); ?>px;">
						<?php print $hotspot['title']; ?>
					</span>
				<?php endif; ?>
				<?php //show hotspot with legends ?>
				<?php if($hotspot_label == 'use_legends'): ?>
					<span class="hotspot-label" style="position:absolute;top:<?php print $hotspot['top'] - (10); ?>px;left:<?php print $hotspot['left'] + ($hotspot_width); ?>px;">
						<?php print ++$legends; ?>
					</span>
					<?php $legend_table[] = '<div id="legends"><span>'.$legends.'. </span><span>'.$hotspot['title'].'</span></div>'; ?>
				<?php endif;?>
			<?php endforeach;?>  
		</div>
	</div> 
	<?php //show hotspot form ?>
	<?php if ($create_hotspots):?>
		<div id="floating" style="display:none;width:400px">
	 		<div class="close" title="close" >
	 		</div>
	 		<?php print render($form); ?>     
		</div>  
	<?php endif; ?>
	
	<?php ?>
	
	<?php //show zoom button ?>
	<?php if ($show_zoom_buttons && ($width >=  ($interactive_image_visible_width + ( $zoom_factor * $interactive_image_visible_width	)))):?>
		<input type="button" value="+" class="zoomin">
		<input type="button" value="-" class="zoomout">
	<?php endif;?>
	<?php //show hotspot with legends?>
	<?php if($hotspot_label == 'use_legends'): ?>
		<?php if($legends != 0): ?>
			<div id="legend-table">
				<div class="legend-title">Legends</div>
				<?php $legend_rows = intval($legends / 2); ?>
				<?php $first_column_row = $legend_rows + ($legends % 2);?>
				<?php $row = 0;?>
				<table style="width:<?php print $interactive_image_visible_width ?>px">
					<?php while ($row < $first_column_row):?>
						<tr>
							<td style = "width:50%">
								<?php print $legend_table[$row];?>
							</td>
							<td style = "width:50%">
								<?php if ($legend_rows > $row ):?>
									<?php $second_column_row = $first_column_row + $row; ?>
									<?php print $legend_table[$second_column_row];?>
								<?php endif;?>
							</td>
						</tr>
						<?php $row++;?>
					<?php endwhile;?>
				</table>			
			</div>
		<?php endif; ?>
	<?php endif;?>	
</div>