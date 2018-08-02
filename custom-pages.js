/**
 * Created by Ray on 5/8/2017.
 */

NSBSConfig = NSBSConfig || {};

//An array of special objects that can be used to set up exception scenarios, such as binding Ctrl+s to editors, etc
NSBSConfig.customPages = [
    {
        path: "/app/common/record/edittextmediaitem.nl",
        /*
         This function handles a special case setup for text editors within netsuite, it adds no functionality,
         but will bind Ctrl + S to trigger the Save button on the editor.
         */
        setup: function(){
            jQuery(window).bind('keydown', function(event) {
                if (event.ctrlKey || event.metaKey) {
                    switch (String.fromCharCode(event.which).toLowerCase()) {
                        case 's':
                            event.preventDefault();
                            jQuery('#submitter').click();
                            break;
                    }
                }
            });
        }
    },
    {
        path: "/help/helpcenter",
        setup: function(){
            jQuery(function(){
                var $title = jQuery('.nshelp_title');
                document.title = $title.text();
                console.log($title.text());
            });
        }
    }
];