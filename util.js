/**
 * Created by Ray on 5/8/2017.
 */

NSBSUtil = (function(){

    function createCookie(name,value,days) {
        var date, expires;
        if (days) {
            date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        else expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    function clearCache(){
        nlapiServerCall("/app/site/setup/clearsitecache.nl", "clearResponseSiteCache", [pageInfo.userId, pageInfo.siteId]);
        alert("Call has been sent for siteId: " + pageInfo.siteId + "!");
    }

    return {
        createCookie: createCookie,
        readCookie: readCookie,
        eraseCookie: eraseCookie,
        //Performs an AJAX call to clear the CDN Cache
        clearCache: clearCache
    };
})();