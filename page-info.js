/**
 * Created by Ray on 5/9/2017.
 */

var pageInfo = (function(){

    /*
     This function takes an optional query parameter(in the format: ?param1=val&param2=val2), and parses the
     parameter keys and values into a JSON object.  If the query isn't provided, it will use the value of
     window.search.
     */
    function getParams(query){
        var paramList, params = {};
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

    return {
        getParams: getParams,
        getPageInfo: function(){
            //Just grabbing the URL info in a nice, usable format
            return {
                domain: window.location.hostname,
                path: window.location.pathname,
                query: window.location.search,
                params: getParams(),
                //This userId refers to the 'client id' for netsuite.
                userId: NSBSUtil.readCookie("lastUser").split("_")[0],
                //Will perform an ajax call if it has never been loaded
                siteId: retrieveSiteId(),
                sspIds: retrieveSspIds(),
                combinerFiles: retrieveCombinerFiles(),
                //Creating the button container
                $buttonContainer: createButtonContainer(),
                $linkContainer: createLinkContainer()
            }
        }
    };
})();