/**
 * Created by Ray on 5/9/2017.
 */

NSBSPageInfo = (function(){

    var $buttonContainer;

    /*
     This function takes an optional query parameter(in the format: ?param1=val&param2=val2), and parses the
     parameter keys and values into a JSON object.  If the query isn't provided, it will use the value of
     window.search.
     */
    function getParams(query){
        var paramList, params = {};
        query = query || window.location.search;
        //If the query is non-zero and starts w/ a '?'
        if(query.length > 0 && query.indexOf('?') === 0){
            paramList = query.substring(1).split("&");//Splitting into key/value pairs w/ '=' between them

            for(var i = 0, l = paramList.length; i< l; i++){
                var kv = paramList[i].split('=');
                params[kv[0]] = kv[1];
            }
        }

        return params;
    }

    //Takes the param string(? to #)
    function getParam(name, query){
        query = query || location.search;
        var p = query.substring(1).split("&");
        for(var i = 0, l = p.length; i<l; i++){
            var pVal = p[i].split("=");
            if(pVal[0] === name){
                return pVal[1];
            }
        }
        return null;
    }

    /*
     This is called by retrieveSiteId to perform an ajax call if the siteId isn't stored in a cookie.
     It will also set the pageInfo.siteId value, since that is normally called in the initialize function.
     */
    var fetchSiteId = function(){
        jQuery.ajax({
            url: "https://" + pageInfo.domain + "/app/site/setup/sitelist.nl?sitetype=ADVANCED&whence=",
            success:function(data){
                var href = jQuery("#row0 td:eq(0) a", data).attr("href");
                var siteId = getParam("id" , href.substring(href.indexOf("?")));
                NSBSUtil.createCookie("siteId", siteId);
                retrieveSiteId();
            }
        });
    };

    /*
     This will attempt to retreive the siteId from knownSiteIds cookie, and if not present, will trigger
     the retrieval of the siteId and return null.
     */
    function retrieveSiteId(){
        var knownSiteIds = JSON.parse(NSBSUtil.readCookie('knownSiteIds'));
        //If the cookie is null or if it doesn't contain the current userId
        if(knownSiteIds === null || !knownSiteIds.hasOwnProperty(pageInfo.userId)){
            var currentSiteId = NSBSUtil.readCookie('siteId');
            knownSiteIds = knownSiteIds || {};
            //If the current siteId cookie is present, then the ajax call is re-calling retrieveSiteId
            if(currentSiteId){
                knownSiteIds[pageInfo.userId] = currentSiteId;
                pageInfo.siteId = currentSiteId;
                NSBSUtil.createCookie('knownSiteIds', JSON.stringify(knownSiteIds));
                NSBSUtil.eraseCookie('siteId');
            }
            else{
                fetchSiteId();
            }
        }

        return (knownSiteIds && knownSiteIds.hasOwnProperty(pageInfo.userId)) ? knownSiteIds[pageInfo.userId] : null ;
    }

    //Creates an absolutely positioned div and appends it to the body before returning it
    function createButtonContainer(){
        var $container =  jQuery("<div id=\"buttonContainer\"></div>");

        jQuery("body").append($container);

        $buttonContainer = $container;

        return $container;
    }

    function createLinkContainer(){
        var $container =  jQuery("<div id=\"linkContainer\"></div>");

        $buttonContainer.append($container);

        return $container;
    }

    return {
        getParams: getParams,
        getParam: getParam,
        getPageInfo: function(){
            //Just grabbing the URL info in a nice, usable format
            pageInfo = jQuery.extend(pageInfo, {
                domain: window.location.hostname,
                path: window.location.pathname,
                query: window.location.search,
                params: getParams()
            });
            //This userId refers to the 'client id' for netsuite.
            if(!pageInfo.hasOwnProperty('userId') && !pageInfo.userId){
                pageInfo.userId = NSBSUtil.readCookie("lastUser").split("_")[0];
            }
            //Will perform an ajax call if it has never been loaded
            if(!pageInfo.hasOwnProperty('siteId') && !pageInfo.siteId) {
                pageInfo.siteId =  retrieveSiteId();
            }

            if(!pageInfo.hasOwnProperty('sspIds') && !pageInfo.sspIds){
                pageInfo.sspIds = NSBSFileInfo.retrieveSspIds();
            }

            if(!pageInfo.hasOwnProperty('combinerFiles') && !pageInfo.combinerFiles){
                //pageInfo.combinerFiles = NSBSFileInfo.retrieveCombinerFiles();
            }
            //Creating the button container
            if(!pageInfo.hasOwnProperty('$buttonContainer') && !pageInfo.$buttonContainer){
                pageInfo.$buttonContainer = createButtonContainer()
            }
            if(!pageInfo.hasOwnProperty('$linkContainer') && !pageInfo.$linkContainer){
                pageInfo.$linkContainer = createLinkContainer();
            }

            return pageInfo;
        }
    };
})();