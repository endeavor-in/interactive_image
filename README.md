***********
* README: *
***********

DESCRIPTION:
------------
This module adds interactivity to images, by adding response behaviours
to mouse actions on those images. 

Locations inside an interactive image can be defined as 'hotspots' using the
double-click action, and by entering location-specific content in the form that
pops up.

These hotspots then respond to mouseovers by displaying a modal window with
content that was earlier added. The modal window content can include formatted
text, images, videos etc. pertaining to the image location under question.

Some examples of interactive images are: maps with spatial data about various
locations, scientific / engineering / anatomy diagrams consisting annotations
on various parts, organization charts with bios of personnel, and any other
complex image whose different parts need elaboration. 

Zooming: The module supports use of very large interactive images, and they
will be resized to the desired visible width (to be specified in settings).
Such images can be zoomed to view the fine details, and dragged around to view
the desired portions. 

DEPENDENCIES:
-------------
- Libraries 2.x or above (http://drupal.org/project/libraries)
- Jquery Cluetip plugin (http://plugins.learningjquery.com/cluetip)

INSTALLATION:
-------------
1. Download Jquery Cluetip plugin https://github.com/kswedberg/jquery-cluetip
   and extract the contents into the following location: 'sites/all/libraries'.

2. Download the Interactive Image module and extract its contents into 
   sites/all/modules/ directory.

3. Download the Libraries API module (>2.x) and extract its contents into
   sites/all/modules/ directory.

4. Enable Libraries API and Interactive Image modules by navigating to: 
		Administer > Modules.
     
5. Configure Interactive Image module by navigating to:
		Administer > Configuration > User Interface > Interactive Image

6. Configure permissions by assigning user roles that can 'create hotspots'.
		Administer > People -> Permission tab.
		
USAGE:
------
1. Navigate to:
		Administer > Add Content > Interactive Image

2. Upload the image to be used as the interactive image to the field 
   labeled 'Interactive Image'.

3. Save and view the node page, which displays the interactive image.

4. Create hotspots as follows: double-click on specific locations 
	 inside the interactive image, and fill up the form that displays 
   in the overlay, with descriptions about the hotspot location. 
   (Note: This only works for users with permission to create Hotspot 
   nodes)

5. Instead of specific locations, entire regions can be marked as 
   hotspots too. This can be accomplished using the 'lasso' selector 
   tool (the button with a dotted rectangle label, below the interactive 
   image)  
   
6. Hotspots created as above will display their descriptions in an overlay 
   / ClueTip, while hovering over them.  

7. Zoom buttons are displayed if the interactive image is down-sized 
   to fit the visible area and can be used to zoom in/out and view the 
   image at the desired size. When downsized, the image is draggable 
   within the visible area. 

8. The hotspots can be categorized using an available category or
   by adding a new category. 

Author:
-------
Ravi Sambamurthy (ravi.sambamurthy@gmail.com)
http://drupal.org/user/234725
