(function(){
    "use strict";

    /*
    This will set up links form the configured array
    */
    var setupLinks = function(){
        var links = NSBSConfig.links;

        for(var i = 0, l = links.length; i < l; i++){
            var link = links[i];
            if(pageInfo.path.indexOf(link.path) === -1){
                generateLink(link.label, link.path);
            }
        }
    };


    /*
    Generates a generic button that can be inserted into the $buttonContainer, and will bind the provided
    function as a click handler.  It will also append to the pageInfo.$buttonContainer unless a false is
    provided.

    @param title Title to be displayed in the button
    @param f Function to be bound to onclick
    @param classes Custom classes to be added to the element, anything falsey will be replaced with ''
    @appendToContainer If false, the button will not be appended to the container, otherwise it will be appended
    */
    var generateButton = function(title, f, classes, appendToContainer){
        classes = classes || "";
        appendToContainer = !(appendToContainer === false);//Making it go from falsey to  true
        var $button = jQuery("<button class=\"" + classes + "\">"+title+"</button>");

        if(typeof f === "function"){
            $button.on("click", f);
        }
        //Appending to the container unless the appendToContainer flag is false
        if(appendToContainer){
            pageInfo.$buttonContainer.append($button);
        }

        return $button;
    };

    /*
    As per generateButton, but will create an a tag instead.  Also, if a string is provided instead
    of a function for 'f', it will be placed in the href value of the anchor.
    */
    var generateLink = function(title, f, classes, appendToContainer){
        var href, $link;
        classes = classes || "";
        appendToContainer = !(appendToContainer === false);//Making it go from falsey to boolean
        href = (typeof f === 'string') ? f : '#';

        $link = jQuery("<a href=\"" + href + "\" class=\"" + classes + "\">"+title+"</a>");

        if(typeof f === "function"){
            $link.on("click", f);
        }
        //Appending to the container unless the appendToContainer flag is false
        if(appendToContainer){
            pageInfo.$linkContainer.append($link);
        }

        return $link;
    };

    /*
    This function will retrieve a hierarchy node for a provided folder Id or path
    */
    var retrieveFolderHierarchy = function(folderId){
        var folderPath, i, l, lastNode;

        lastNode = pageInfo.fileHierarchy;
        folderPath =
            (typeof folderId === 'string' && pageInfo.folderData.hasOwnProperty(folderId)) ?
                pageInfo.folderData[folderId].path :
                (folderId instanceof Array) ? folderId : null;


        //Looping through the folder path to retrieve the folder's node in the hierarchy
        for(i = 0, l = folderPath.length; i < l; i++){
            lastNode = lastNode[folderPath[i]];
        }

        return lastNode;
    };


    /*
    This function will allow users in the FileBrowser to download a folder as a ZIP file(if it's data is cached).

    NOTE: This will require the folder to be parsed(in WebsiteHostingFiles or SuiteScrips directory)
    */
    var downloadAsZip = function(e){
        var $target, folderId, folder, folderHierarchy, fileList;

        $target = jQuery(e.target);
        folderId = $target.attr("href").substring(1);

        console.log('Initiating download of folder: ', folderId);

        folder = (pageInfo.folderData.hasOwnProperty(folderId)) ? pageInfo.folderData[folderId] : null;
        if(folder){
            folderHierarchy = retrieveFolderHierarchy(folder.path);

            //TODO: Recursive traverse the hierarchy object and build a list of files to be ajax'd

            //TODO: Start AJAX'ing the files into the collective object.

            //TODO: Trigger the ZIP File rendering/download


        }
        //TODO: for retrieving the file itself
        //URL For downloading a file: https://system.sandbox.netsuite.com/core/media/media.nl?id=4699&c=1116468&&_xt=.ssp&xd=T
        //It looks like ID, customer, _xt(extension), and xd=T are required parameters

        return false;
    };

    var ensureTableIsPopulated = function(){
        var $table, $editLinks, $existingLinks, typeIndex, typeSelector, $cell, type, href, cellId,
            $link, $downloadLink;

        $table = jQuery(parent.document.getElementById("div__body"));
        $editLinks = $table.find("tr>td:nth-child(1):visible a");
        $existingLinks = $table.find(".direct-edit");

        //Retrieving the index of the 'Type' header
        typeIndex = 1 + jQuery('#div__labtab td:contains(Type)').index();
        typeSelector = "td:nth-child(" + typeIndex + ")";

        for(var i = 0, l = $editLinks.length; i < l; i++){
            $cell = $editLinks.eq(i);
            type = jQuery.trim($cell.parents('tr').eq(0).find(typeSelector).text());
            href = $cell.attr('href');
            cellId = NSBSPageInfo.getParam('id', href.substring(href.indexOf('?')));
            if(type !== "Folder" && type !== ""){
                //Generating the link
                $link = jQuery("<a class=\"direct-edit\" style=\"float:left;\" href=\"#" + cellId + "\">EditFile</a>");

                $cell.parent().next().prepend($link);
            }//For Download As Zip functionality
            // else if(type === 'Folder'){
            //     $downloadLink = jQuery('<a class="download-as-zip" style="float: left;" href="#' + cellId + '">Download Zip</a>');
            //     $cell.parent().next().prepend($downloadLink);
            // }
        }


        $table.off("click");

        $table.on("click", ".direct-edit", null, function(e){
            var $target = jQuery(e.target);
            nlOpenWindow("/app/common/record/edittextmediaitem.nl?id="+ $target.attr("href").substring(1) +"&e=T&l=T&target=filesize", "edittextmediaitem34815", 800, 600);
            return false;
        });

        $table.on('click', '.download-as-zip', downloadAsZip);
    };



    var showSspLinks = function(e){
        e.stopPropagation();
        pageInfo.$sspLinksContainer.show();
        return false;
    };

    var renderSspLinks = function(){
        var $sspLink = generateLink('SSP Applications<span class="menu_tri"></span>', showSspLinks);
        var $sspLinksContainer = jQuery('<div id="sspLinks"></div>');
        pageInfo.$sspLinksContainer = $sspLinksContainer;

        $sspLinksContainer.appendTo('body');

        for(var i = 0, l = pageInfo.sspIds.length; i < l; i++){
            var link = pageInfo.sspIds[i];
            var sspPath = "/app/common/scripting/webapp.nl?id=" + link.id;

            var $link = generateLink(link.name, sspPath, null, false);
            $sspLinksContainer.append($link);
        }

        jQuery('body').click(function(){
           if(pageInfo.$sspLinksContainer.is(':visible')){
                pageInfo.$sspLinksContainer.hide();
           }
        });
    };


    /*
    This function will hijack the globally defined 'globalSearch'(or constructSuggestionBoxFromResponse)
    function and wrap it in a function that performs additional logic based upon the rendered results
    section.  It will add a direct edit link to search result items that link into the the file records pages.
    */
    var setupAndHijackSearchBar = function(){
        if(window.top.hasOwnProperty('globalSearch') && typeof window.top.globalSearch === 'function'){
            //A system of catching callbacks to be used on the other end of a setTimeout and AJAX call
            var callbacks = {};
            var wrappedSuccess = function(data, status, jqXhr){
                var callback = callbacks[jqXhr.id];
                try{
                    callback.call(this, data, status, jqXhr);
                }
                catch(e){
                    console.log('callback threw error');
                    console.error(e);
                }

                //Adding the links
                addDirectEditLinks();
            };
            //This will retrieve the search container
            var addDirectEditLinks = function(){
                var i, l, href, $item, $link, $editLink;
                var $results = jQuery('#uir-global-search-container > li');
                //Looping through the results to inject the DirectEdit link, if needed
                for(i = 0, l = $results.length; i < l; i++){
                    $item = $results.eq(i);
                    $item.css({'position': 'relative'});//Adding relative for the DirectEdit link
                    $link = $item.find('a:first');
                    if($link.length > 0){
                        href = $link.attr('href');
                        //We only want to add a directEdit link if it's linking to a mediaItem(file)
                        if(href.indexOf('/app/common/media/mediaitem.nl') !== -1){
                            href = href.substring(href.indexOf('?'));
                            $editLink  = generateLink('DirectEdit', '#'+ NSBSPageInfo.getParam('id', href), 'edit-link', false);
                            $editLink.attr('title', NSBSFileInfo.renderFilePathById(NSBSPageInfo.getParam('id', href)));
                            //Appending to the LI
                            $item.find('a:last').before($editLink);
                        }
                    }
                }
                //This needs to be bound everytime the tooltip is instantiated.
                jQuery('#uir-global-search-container').on('click', '.edit-link', function(e){
                    e.preventDefault();
                    e.stopPropagation();

                    var $target = jQuery(e.target);
                    nlOpenWindow("/app/common/record/edittextmediaitem.nl?id="+ $target.attr("href").substring(1) +"&e=T&l=T&target=filesize", "edittextmediaitem34815", 800, 600);

                    return false;
                });
            };
            //Adding a prefilter to wrap the success function of AJAX calls to the /../autosuggest.nl endpoint
            jQuery.ajaxPrefilter(function(options, originalOptions, jqXhr){
                if(options.url.indexOf("/app/common/autosuggest.nl?cur_val=") !== -1){
                    //Storing the success function in a locally scoped object to be used in the success
                    jqXhr.id = Math.floor(Math.random() * 1000000000);
                    callbacks[jqXhr.id] = originalOptions.success;
                    options.success = wrappedSuccess;
                }
            });
        }
        else{
            console.log('globalSearch not found, trying in 250ms');
            setTimeout(setupAndHijackSearchBar, 250);
        }
    };



    var setup = function(){
        NSBSPageInfo.getPageInfo();

        //This will assign fileList itself, since it may require ajax calls
        NSBSFileInfo.fetchOrRetrieveFileData();

        if(jQuery.isArray(pageInfo.sspIds)){
            renderSspLinks();
        }
        else{
            setTimeout(renderSspLinks, 250);
        }

        setupFileLinks();

        setupAndHijackSearchBar();
        setupQuickNav();
    };


    /*
    This function will alter the title text for links to MediaItems by rendering the filePath for the item.
    */
    var setupFileLinks = function(){
        addFilePathToLinks();

        setupFileTooltip();
    };


    /*
    This function adds class-conditional hover functions to the body.  It will hide/display a tooltip with file
    information.
    */
    var setupFileTooltip = function(){
        //TODO: Build the tooltip Element to be re-used

        // jQuery('body').on('mouseenter', '.added-path', function(e){
        //     //Hide existing tooltips, then render one for the element
        //     console.log(e);
        // });

        // jQuery('body').on('mouseleave', '.added-path', function(e){
        //     //Hide any existing tooltips
        //     console.log(e);
        // });
    };


    /*

    */
    var addFilePathToLinks = function(){
        var i,l, href, id, path, $item, $links;
        $links = jQuery('a:not(.added-path)');

        for(i = 0, l = $links.length; i < l; i++){
            $item = $links.eq(i);
            href = $item.attr('href');
            if(href && (href.indexOf('mediaitem.nl') !== -1 || href.indexOf('media.nl') !== -1) ){
                id = NSBSPageInfo.getParam('id', href.substring(href.indexOf('?')));
                path = NSBSFileInfo.renderFilePathById(id);

                $item.addClass('added-path');
                $item.attr('title', path);
            }
        }
    };


    /*
    This will loop through the custom pages array and determine if the page has customHandlers.  If so, it will
    return true, and also set pageInfo.setup to be the defined setup function for the page.
    */
    var isCustomPage = function(){
        var ret = false;
        var customPages = NSBSConfig.customPages;

        for(var i = 0, l = customPages.length; i < l; i++){
            if(window.location.pathname.indexOf(customPages[i].path) !== -1){
                ret = true;
                pageInfo.customSetup = customPages[i].setup;
                break;
            }
        }
        return ret;
    };

    /*
    This function performs a page-level validation to ensure we don't fire the script multiple times when iframes
    are used on pages, and to avoid the controls displaying when they really aren't needed.

    It is called in the docReady function of the tamperMonkey script, and will prevent any actions, if it
    returns false.
    */
    var isValidPage = function(){
        var ret = true, isValidChild = false, isCustom = false, i,l;
        //Iterating over the custom pages
        for(i = 0, l = NSBSConfig.customPages.length; i < l; i++){
            isCustom = isCustom || window.location.pathname.indexOf(NSBSConfig.customPages[i].path) !== -1;
        }
        //If we're in a child window, loop through the list of validChildWindows
        if(window.self !== window.top){
            for(i = 0, l = NSBSConfig.childWindowPages.length; i < l; i++){
                if(window.location.pathname.indexOf(NSBSConfig.childWindowPages[i]) !== -1){
                    isValidChild = true;
                    break;
                }
            }
        }
        else{
            isValidChild = true;
        }
        ret = ret && isValidChild && !isCustom;
        //Checking the list of excluded pages.
        for(i = 0, l = NSBSConfig.excludedPages.length; !isCustom && i < l; i++){
            ret = ret && window.location.pathname.indexOf(NSBSConfig.excludedPages[i]) === -1;
        }
        console.log('isValidPage: ', ret);
        return ret;
    };

    /*additional include functions*/

    //renders an input, gets the dataset, starts event handlers, and typeahead plugin on selector for the input
    var renderTypeahead = function(){
        var input = '<div id="nlAutoCompleteMenus"><input class="typeaheadcustom span6" type="text" placeholder="Search NetSuite Menus..." /><button>Go</button></div>';
        pageInfo.$buttonContainer.append(input);
        //jQuery('body').append(input);
        var dataset = getLocalStorage('navigation');

        initTypeAhead('#nlAutoCompleteMenus input.typeaheadcustom', JSON.parse(dataset));
        initFocus('#nlAutoCompleteMenus input.typeaheadcustom.span6.tt-input');
        //initBlur('#nlAutoCompleteMenus input.typeaheadcustom.span6.tt-input');
        initClick('#nlAutoCompleteMenus button');
    };

    //returns an subarray of objects from an array of objects filterd by {key:value}
    var getCurrentLink = function(obj, value, key)
    {
        return jQuery.grep(obj, function(v, i)
        {
            return value === v[key];
        });
    };
    //converts keys in an array of objects into and array of key strings
    var objectKeyValuesToArray = function(obj, keyVal)
    {
        var arr = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(key + '=' + obj[key]);
            }
        }
        var result = arr.join(',');
    };

    //localStorage/sessionStorage.
    //The localStorage object stores the data with no expiration date.
    //The data will not be deleted when the browser is closed, and will be available the next day, week, or year.
    var setLocalStorage = function(name, value){
         if(typeof(Storage) !== "undefined"){
            // Store
            localStorage.setItem(name, JSON.stringify(value));
        }
        else{
            // Sorry! No Web Storage support..
        }
    };
    //gets data soted in local storage by its name
    var getLocalStorage = function(name){
        // Retrieve
        return localStorage.getItem(name);
    };
    //factory substring matcher for quick order pad
    var substringMatcher = function(strs){
        return function findMatches(q, cb)
        {
            // use regex used to determine if a string contains the substring `q`
            var matches = [], substrRegex = new RegExp(q, 'i');
            // iterate through the pool of strings and for any string that contains the substring `q`, add it to the `matches` array
            // the typeahead jQuery plugin expects suggestions to a JavaScript object
            jQuery.each(strs, function(i, str){ if(substrRegex.test(str)){  matches.push({ value: str }); } });
            //return the matches found
            cb(matches);
        };
    };
    //passes in dataset, substring matcher function and then starts the typeahead plugin on the provides selector
    var initTypeAhead = function(selector, dataset){


        jQuery(selector).typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: 'dataset',
          displayKey: 'value',
          source: substringMatcher(dataset)
        });

        jQuery('.tt-dropdown-menu').css({"max-height":"300px","overflow-y":"auto","background":"#ffffff","border":"1px solid #888888","box-shadow":"0.4em 0.4em 1em #aaaaaa","font-size":"10px","padding":"5px"});
        jQuery('.twitter-typeahead').css({"float":"left", "padding":"1px"});

    };
    //sets a blur event for the typeahead input to match the object by label and finds the link matching thelabel and navigates to the the link url
    var initBlur  = function(selector){
        jQuery(selector).blur(function(){
            //get link url of current label and navigate to link url
            //we will be getting the object that has the label value matching the value of the blurred input,
            //and then getting that objects link and setting window.location to the link found
            var label_to_match = jQuery(this).val();

            var menu_arrays = JSON.parse(localStorage.getItem('menus'));

            var link_to_find = getCurrentLink(menu_arrays, label_to_match, 'label');

            var link_url = link_to_find[0].link;

            window.location = link_url;
        });
    };
    //sets a blur event for the typeahead input to match the object by label and finds the link matching thelabel and navigates to the the link url
    var initClick  = function(selector){
        jQuery(selector).click(function(){
            //get link url of current label and navigate to link url
            //we will be getting the object that has the label value matching the value of the blurred input,
            //and then getting that objects link and setting window.location to the link found
            var label_to_match = jQuery('#nlAutoCompleteMenus input.typeaheadcustom.span6.tt-input').val();

            var menu_arrays = JSON.parse(localStorage.getItem('menus'));

            var link_to_find = getCurrentLink(menu_arrays, label_to_match, 'label');

            var link_url = link_to_find[0].link;

            window.location = link_url;
        });
    };
    // clears the placeholder on focus
    var initFocus = function(selector){
        jQuery(selector).focus(function(){
            if(jQuery(this).val() == 'Search NetSuite Menus...'){jQuery(this).val('');}
        });
    };

    var setupQuickNav = function(){
        var ajax_url;
        var knownLabels = [
            {label: '"new"',type:  'new'}, {label: '"search"' ,type:  'search custom'},
            {label: '"list"' ,type:  'list'}, {label: '"customize"' ,type:  'customize'},
            {label: '"status"' ,type:  'status'}, {label: '"customize detail"' ,type:  'customize detail'},
            {label: '"detail"' ,type:  'detail'}, {label: '"edit"' ,type:  'edit'}
        ];

        if(!getLocalStorage('menus')){
            //here we gather all of the ids required to generate ajax urls to get the menu data
            var crazy_ids = [], num_ids, menu_arrays = [], navigation_labels = [], parents = [];
            jQuery('.ddmSpan a').each(function(){
                var href = jQuery(this).attr('href');
                var crazy_id = NSBSPageInfo.getParam("sc" , href.substring(href.indexOf("?")));
                crazy_ids.push(crazy_id);
            });

            num_ids = crazy_ids.length;

            var successFunction = function(res){
                var menu_array, num_sharts, current, label, link, childLabel, parentid, parent_of_child, parent_label,childlabel;
                menu_array = res.toString().split('\n');
                num_sharts = menu_array.length;
                //Looping through the retrieved lines and parsing data
                for(var j = 0; j < num_sharts; j++){
                    current = menu_array[j];
                    //If this is a line that may have relevant data
                    if(current.indexOf('Array("') > 0){
                        label    = current.split('Array("')[1].split('","')[0];
                        link     = current.split('","')[1].split('?whence=')[0];
                        childlabel = '';
                        parentid = '';
                        if(current.split('m_')[1]){
                            parentid = current.split('m_')[1].split('[')[0];
                            //If we've already parsed parent information
                            if(parents.length > 0){
                                parent_of_child = getCurrentLink(parents, parentid, 'parentid');

                                if(parent_of_child.length > 0){
                                    parent_label = parent_of_child[0].label;
                                    childlabel = parent_label + ' ' + label;
                                }
                                else{
                                    childlabel = parent_label + ' ' + label;
                                }
                            }
                        }
                        else{
                            parentid = 'ID Missing';
                        }
                        //Looping through the known Labels to determine if this line matches them.
                        var specialCase = true;
                        for(var i = 0, l = knownLabels.length; i < l; i++){
                            //If it's a match, we'll push the menu and label info, set a flag, and break the loop
                            if(current.indexOf(knownLabels[i].label) !== -1){
                                navigation_labels.push(childlabel);
                                menu_arrays.push({label: childlabel, link:link, isparent:false, parentid: parentid, linktype: knownLabels[i].type});
                                specialCase = false;
                                break;
                            }
                        }
                        //If the specialCase flag wasn't falsed
                        if(specialCase){
                            //SearchType custom is a special case
                            if(current.indexOf('searchtype=Custom') > 0){
                                navigation_labels.push(childlabel);
                                menu_arrays.push({label: childlabel, link:link, isparent:false, parentid: parentid, linktype:'search custom'});
                            }//Else, it is a parent menu item
                            else{
                                if(current.split('whence=","')[1]){
                                    parentid = current.split('whence=","')[1].split('",null')[0];
                                    if(parentid.match(/;/)){
                                        parentid = '';
                                    }
                                    navigation_labels.push(label);
                                    parents.push({label:label, link:link, isparent:true, parentid:parentid, linktype:''});
                                    menu_arrays.push({label:label, link:link, isparent:true, parentid:parentid, linktype:''});
                                }
                            }
                        }
                    }
                }
            };

            //here we ajax to each javascript file and parse the javascript text repsonse into an array of objects,
            //while retaining parent child relationship for the menus links
            for(var i = 0; i < num_ids; i++){
                ajax_url = '/app/center/NLNavMenuData.nl__t=dD2hTE9es&sections=' + crazy_ids[i] + '.nlqs'; //example crazy_id: -10
                jQuery.ajax({
                    async:false,
                    url:ajax_url,
                    contentType: 'text/javascript',
                    success: successFunction
                });
            }

            //once arrays have been generated we store them to local storage so this will only need to do ajax for the initial data store
            console.log('Found %i labels, and %i menus.', navigation_labels.length, menu_arrays.length);
            setLocalStorage('navigation', navigation_labels);
            setLocalStorage('parents', parents);
            setLocalStorage('menus', menu_arrays);

            //we call the render typeahead function to start everything up once data has be stored for future retrieval
        }
        renderTypeahead();
    };



    /*
    This function will go through the folderList object, and generate an array of top-level folders which have
    all normal properties of a folder(id/name/hasChildren/etc), but will also have an array of child files,
    thus establishing a hierarchy.
    */
    var initializeFileHierarchy = function(){
        var hierarchy, folders, i, l, j, m, current, lastPathNode, currentPathId;
        //Sorting the folders by the path(ascending)
        folders = pageInfo.folderList[pageInfo.userId].sort(function(a, b){
            return a.path.length - b.path.length;
        });
        //Defining the top-level node
        hierarchy = {};
        //Looping over every single folder to build out the hierarchy object
        for(i = 0, l = folders.length; i < l; i++){
            current = folders[i];
            lastPathNode = hierarchy;

            for(j = 0, m = current.path.length; j < m; j++){
                currentPathId = current.path[j];
                //If the lastNode doesn't have this portion of the path, we will add it
                if(!lastPathNode.hasOwnProperty(currentPathId)){
                    lastPathNode[currentPathId] = {};
                }
                //Updating lastNodePath, since it should have the currentPathId
                lastPathNode = lastPathNode[currentPathId];
            }
        }
        //Storing the hierarchy
        pageInfo.fileHierarchy = hierarchy;
    };

    /*
    This functions generates the header for the fileBrowser dialog.  It may eventually use a jQuery UI dialog,
    or something along the lines.
    */
    var generateFileBrowserHeaderMarkup = function(){
        //TODO: ImplementControls Markup
        var header = [
            ''
        ].join('');


        return header;
    };

    /*
    This function will render the footer markup for the FileBrowser widget.  Currently, there is no solid
    design-concept for this section, but I imagine selection specific controls will be managed here.
    */
    var generateFileBrowserFooterMarkup = function(){
        var footer = [
            ''
        ].join('');


        return footer;

    };


    /*
    This function will recursively traverse the folderHierarchy to generate the markup needed to render a
    file tree of the hiearchy.  It leverages recursion, and the traverseHierarchy function is defined within
    this function, for scoping purposes.
    */
    var generateFileBrowserHierarchyMarkup = function(){
        var i, l, currentLevel, folder;

        currentLevel = 0;
        //A recursive function to traverse the folderHierarchy
        var traverseHierarchy = function(obj, level){
            var markup = '', keys = Object.keys(obj);
            //If there are children, then we will need to render a UL of them.
            if(keys && keys.length > 0){
                //RenderKeys via iteration
                markup += '<ul class="list">';
                for(var i = 0, l = keys.length; i < l; i++){
                    folder = pageInfo.folderData[keys[i]];
                    markup += [
                        '<li data-level="', level, '" >',
                            '<a class="label" href="#', keys[i] , '" style="text-indent: ', (level * 12 ) , 'px;" >',
                                '<span class="expand">+</span>',
                                '<span class="collapse">-</span>',
                                folder.name,
                            '</a>',
                            traverseHierarchy(obj[keys[i]], level + 1),
                        '</li>'
                    ].join('');
                }
                markup += '</ul>';
            }
            //Returning the markup for this node
            return markup;
        };

        return '<div id="folderHierarchy">' + traverseHierarchy(pageInfo.fileHierarchy, 0) + '</div>';
    };

    /*
    Placeholder/stub function for generating the containers for the fileList
    */
    var genereateFileBrowserListMarkup = function(){
        var markup = '<div id="fileList">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel gravida mi. Proin ultrices maximus accumsan. Duis finibus ex non faucibus feugiat. Nunc facilisis fringilla elementum. Praesent efficitur, risus non semper ultricies, eros nibh blandit purus, non porta lacus mi in nunc. Donec iaculis elit bibendum ligula finibus consequat. Praesent eu aliquet ligula. Quisque et felis mollis nunc commodo tincidunt quis ac ante. Integer magna nisl, fermentum sit amet tellus id, bibendum molestie nisl. Cras congue congue dui vel auctor. Aenean quis est vestibulum, tristique nisi non, egestas ipsum. Duis urna felis, feugiat et purus in, convallis pretium quam. Maecenas faucibus purus non purus pulvinar venenatis. Maecenas lectus nisl, rutrum ut facilisis a, mollis eu nunc. Aliquam a aliquam sem, vel semper dui. Aliquam risus sem, aliquam quis elit quis, ornare mollis metus. Quisque volutpat odio sed urna dictum, eu fringilla ante rhoncus. Phasellus tincidunt arcu ut eros molestie maximus. Curabitur sit amet lectus in risus finibus iaculis a sit amet enim. Vivamus convallis ex quis dolor mollis pharetra. Sed sodales viverra dui ut pulvinar. Quisque semper in tortor sed feugiat. In dapibus velit sed massa mollis rutrum. Mauris turpis eros, congue sed turpis at, ultricies rutrum nulla. Suspendisse malesuada nunc nisl, vel euismod velit blandit ac. Proin vel blandit nisi, eget commodo tellus. In sed tellus pharetra, pharetra urna a, faucibus purus. In fringilla pharetra sem, ullamcorper rhoncus ex hendrerit in. Pellentesque gravida in libero in volutpat. Vivamus vehicula dapibus fringilla. Vivamus lectus nisl, commodo ornare gravida sed, blandit id risus. Ut congue, mauris at mattis aliquet, massa dolor euismod nibh, ut finibus lacus turpis porta magna. Nulla eu accumsan sapien. Mauris scelerisque fringilla purus nec dapibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eget aliquam lectus, in sodales nunc. Fusce convallis purus elit, sed elementum ligula porttitor et. Nullam id est et enim consequat porttitor. Donec vel fermentum tellus. Ut scelerisque at diam at convallis. Pellentesque in lacus ut mauris vulputate aliquet. Proin quis libero ex. Suspendisse potenti. Phasellus et ipsum at justo interdum rutrum at non urna. In vitae metus dui. Vivamus fringilla odio eu ex facilisis, vitae placerat libero blandit. Nullam vel metus id tortor rhoncus dapibus eu ut ipsum. Phasellus venenatis tortor vel nisi ultrices consectetur. Mauris congue nec tellus non laoreet. Morbi interdum risus sed magna ornare eleifend. Nunc sed orci a nisi consequat maximus et sit amet nunc. Donec porttitor consectetur purus, et accumsan urna eleifend vitae. Sed condimentum bibendum libero, sed sollicitudin odio pretium sed.</div>';
        //TODO: Implement some basic markup to get a default view

        return markup;
    };

    /*
    This function will go through the fileHierarchy and generate DOM elments for the entire hiearchy.
    After that, it will return the jQuery object.
    */
    var generateFileBrowserElements = function(){
        var header, footer, fileHierarchy, fileList, $container;

        $container = jQuery('<div id="customFileBrowser"></div>');
        //Generating Header/Footer as they're mostly containers for controls
        header = generateFileBrowserHeaderMarkup();
        footer = generateFileBrowserFooterMarkup();
        fileHierarchy = generateFileBrowserHierarchyMarkup();
        fileList = genereateFileBrowserListMarkup();

        //Building the file content section
        var content = [
            '<div id="browserContent">',
                fileHierarchy,
                fileList,
            '</div>'
        ].join('');

        //Adding the elements to the container
        $container.append(header);
        $container.append(content);
        $container.append(footer);

        return $container;
    };


    /*
    This function binds all the handlers for the FileBrowser FolderHierarchy section.  It binds expand/collapse,
    as well as the click handler for folder labels.
    */
    var initializeFileBrowserHierarchy = function(){
        //Retrieving the parent element
        var $h = pageInfo.$fileBrowser.find('#folderHierarchy');
        //Binding expand/collapse
        $h.on('click', '.expand,.collapse', fileBrowserToggleExpandCollapse);
        //Bind clicks for hierarchy spans
        $h.on('click', 'a.label', showDirectoryContents);
    };

    /*
    This is a click handler for the folder label within the FolderHiearchy section of the FileBrowser. It will
    load the list of files and sub-folders for the clicked folder in the right-side of the FileBrowser.
    */
    var showDirectoryContents = function(e){
        var folderId, $target, files, folders;

        $target = jQuery(e.target);
        folderId = $target.attr('href').substring(1);

        //TODO: Show the contents of the directory
        console.log('showing contents of folder: ', folderId);
        //Filtering against the list of folders
        files = pageInfo.fileList[pageInfo.userId].filter(function(file){
            return file.path[file.path.length - 2] === folderId;
        });
        //Retrieving the folders in the hierarchy that are direct children of the clicked folder
        folders = Object.keys(retrieveFolderHierarchy(folderId));

        console.log(files, folders);

        return false;
    };

    /*
    This function is an click handler for the expand/collapse buttons in the folderHierarchy.  It will
    toggle the state of the child UL within the span the toggle button was clicked.

    Note: It will perform a simple collapse, and will not change the state of internally collapsed elements.
    */
    var fileBrowserToggleExpandCollapse = function(e){
        var folderId, $target, $parent;

        $target = jQuery(e.target);
        $parent = $target.parent();
        folderId = $parent.attr('href').substring(1);
        //TODO: Implement clickHandler
        console.log('expand/collapse for folder: ', folderId);
        return false;
    };

    /*
    This function will initialize the fileBrowser and trigger a togle event when ready.  It should only be
    called by the toggle function, and only for the first time it's clicked within a page's lifetime.

    Essentially, it will initialize the FileBrowser DOM elements, and associated functions.  Then, it will call
    toggleFileBrowser when completed(which should display the fileBrowser).
    */
    var initializeFileBrowser = function(){
        //TODO: Instantiate the DOM elements, and bind event handlers.
        //Initializing the fileHierarchy
        initializeFileHierarchy();
        //Instantiating the DOM elements
        var $fileBrowser =  generateFileBrowserElements();


        //Appending fileBrowser to the DOM and showing it
        jQuery('body').append($fileBrowser);
        pageInfo.$fileBrowser = $fileBrowser;
        //Binding event handlers
        initializeFileBrowserHierarchy();



        toggleFileBrowser();
    };

    /*
    This function will toggle the display of a custom FileBrowser, as well as handle the initialization of
    the FileBrowser.
    */
    var toggleFileBrowser = function(){
        var $fileBrowser, topLevel, i, l;
        if(pageInfo.$fileBrowser){
            pageInfo.$fileBrowser.toggle();
        }//Else, we will be instantiating the function.
        else{
            initializeFileBrowser();
        }
    };

    jQuery(document).ready(function(){
        //We only do something if it's a valid page
        if( isValidPage() ){
            //This will pull data from local storage and global, as well as make a few AJAX requests
            setup();
            //Adds some links to the menu
            setupLinks();

            //This will log the primary data object for this script
            generateButton("LogData", function(e){
                e.preventDefault();
                console.log(pageInfo);
                return false;
            });

            //This will clear the CDN cache, use sparingly!
            generateButton("ClearCache", NSBSUtil.clearCache);

            //This should trigger the file-browser provided by this add-on
            var fb = generateButton("FileBrowser", toggleFileBrowser);
            //fb.click();//Added for debug purposes

            //If we're on a Script page, we want the execution log to be the default tab
            if(pageInfo.path.indexOf("/app/common/scripting/webapp.nl") !== -1){
                setTimeout('ShowTab("executionlog",false);', 500);
            }

            if(pageInfo.path.indexOf("/app/common/media/mediaitemfolders.nl") !== -1){
                ensureTableIsPopulated();
            }
            //This is the expand/collapse button for the menu
            var toggle = generateButton('+/-', function(e){
                e.preventDefault();

                jQuery('#buttonContainer > *').toggle();
                jQuery(e.target).closest('button').show();

                return false;
            }, '', false);

            toggle.css({'float': 'left'});
            pageInfo.$buttonContainer.prepend(toggle);
            toggle.click();
        }
        else if( isCustomPage() ){
            //This handles custom set up for pages that don't support the typical add-on features
            pageInfo.customSetup();
        }
    });
})();

