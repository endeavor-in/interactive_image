***********
* README: *
***********

DESCRIPTION:
------------
This module adds interactivity to images, by adding response behaviours to mouse actions on those images. 

Locations inside an interactive image can be defined as 'hotspots' using the double-click action, and by entering location-specific content in the form that pops up. These hotspots then respond to mouseovers by displaying a modal window with content that was earlier added. The modal window content can include formatted text, images, videos etc. pertaining to the image location under question.

Some examples of interactive images are: maps with spatial data about various locations, scientific / engineering / anatomy diagrams consisting annotations on various parts, organization charts with bios of personnel, and any other complex image whose different parts need elaboration. 

Zooming: The module supports use of very large interactive images, and they will be resized to the desired visible width (to be specified in settings). Such images can be zoomed to view the fine details, and dragged around to view the desired portions. 

DEPENDENCIES:
-------------
- Jquery Cluetip plugin (www.jqueryui.com)
- Jquery UI

INSTALLATION:
-------------
1. Download Jquery Cluetip plugin from http://plugins.jquery.com/project/cluetip and extract the contents into the following location: 'sites/all/libraries/jquery-cluetip'. After this, the cluetip JS file should be available at: sites/all/libraries/jquery-cluetip/jquery.cluetip.js.

2. Download Jquery UI (http://jqueryui.com/download) with at least the draggable interaction included, and extract the contents into the following location: sites/all/libraries. Rename the folder containing the Jquery UI files as 'jquery-ui'.

3. Download and place the entire interactive_image directory into sites/all/modules/ directory.

3. Enable Interactive Image module by navigating to: 
		Administer > Modules.
     
4. Configure Interactive Image module by navigating to:
		Administer > Configuration > User Interface > Interactive Image

5. Configure permissions by assigning user roles that can 'create hotspots'.

USAGE:
------
1. Navigate to:
		Administer > Add Content > Interactive Image

2. Upload the image to be used as the interactive image

3. Optionally upload the icon image to be used to display the hotspots

4. Save and view the node page.

5. Create hotspots by double-clicking on the required locations, and filling up the pop-up form. 

6. Check mouse-over behaviour on the hotspots. 

Author:
-------
Ravi Sambamurthy (ravi.sambamurthy@gmail.com)
http://drupal.org/user/234725
