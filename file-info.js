/**
 * Created by Ray on 5/9/2017.
 */

NSBSFileInfo = (function(){

    function fetchSspIds(){
        jQuery.ajax({
            url: "https://" + pageInfo.domain + "/app/common/scripting/webapplist.nl?whence=",
            success:function(data){
                var nameIndex = 1 + jQuery('#div__labtab td:contains(Name)', data).index();
                var $links = jQuery("#div__bodytab tr td:nth-child(" + nameIndex + ") a:contains(Custom)", data);
                var sspIds = [];

                for(var i = 0, l = $links.length; i < l; i++){
                    var $link = $links.eq(i);
                    var href = $link.attr('href');
                    href = href.substring(href.indexOf("?"));
                    sspIds.push({
                        name: $link.text().trim(),
                        id: getParam("id" , href)
                    });
                }

                NSBSUtil.createCookie("sspIds", JSON.stringify(sspIds));
                retrieveSspIds();
            }
        });
    }

    function retrieveSspIds(){
        var knownSspIds = JSON.parse(NSBSUtil.readCookie('knownSspIds'));
        if(knownSspIds === null || !knownSspIds.hasOwnProperty(pageInfo.userId)){
            var currentSspIds = JSON.parse(NSBSUtil.readCookie('sspIds'));
            knownSspIds = knownSspIds || {};
            if(currentSspIds !== null){
                knownSspIds[pageInfo.userId] = currentSspIds;
                pageInfo.sspIds = currentSspIds;
                NSBSUtil.createCookie('knownSspIds', JSON.stringify(knownSspIds));
                NSBSUtil.eraseCookie('sspIds');
            }
            else{
                fetchSspIds();
            }
        }

        return (knownSspIds && knownSspIds.hasOwnProperty(pageInfo.userId)) ? knownSspIds[pageInfo.userId] : null;
    }


    /*
     This will ensure the fileList is present, and if not, will trigger it to be loaded.
     */
    function fetchCombinerData(){
        //Fetching the DocumentBrowserPage, and parsing the top-level folders
        var fileList = JSON.parse((localStorage.fileList) ? localStorage.fileList : '');
        if(fileList === null){
            retrieveFileData();
        }
        else{
            //Grep the file list for combiner/templates.config within a 'Custom' directory
            pageInfo.combinerData = fileList.filter(function(v,i,a){
                var path;
                //If it's a combiner file and inside a directory w/ 'Custom' in the name
                if(v.name === "combiner.config" || v.name === "templates.config"){
                    path = renderFilePathById(v.id);

                    return path.indexOf('Custom') !== -1;
                }
                return false;
            });
        }
    }

    /*
     This will load the combinerFile data from localStorage, and if not loaded, will trigger the data to be loaded.
     */
    function retrieveCombinerFiles(){
        var combinerData = JSON.parse(localStorage.combinerData);
        //If we have a localstorage that's incomplete for our siteId
        if(combinerData === null || combinerData[pageInfo.siteId] === null){
            fetchCombinerData();
        }//Else we have combinerFile data, and an entry for our siteId
        else{
            var siteCombiners = combinerData[siteId];

            //TODO: Render the links
        }
    }

    return {
        fetchSspIds: fetchSspIds,
        fetchCombinerData: fetchCombinerData,
        retrieveSspIds: retrieveSspIds,
        retrieveCombinerFiles: retrieveCombinerFiles
    };
})();