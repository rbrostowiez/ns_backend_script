/**
 * Created by Ray on 5/9/2017.
 */

NSBSFileInfo = (function(){

    function fetchSspIds(){
        jQuery.ajax({
            url: "https://" + pageInfo.domain + "/app/common/scripting/webapplist.nl?whence=",
            success:function(data){
                var nameIndex = 1 + jQuery('#div__labtab td:contains(Name)', data).index();
                var $links = jQuery("#div__bodytab tr td:nth-child(" + nameIndex + ") a", data);
                var sspIds = [];

                for(var i = 0, l = $links.length; i < l; i++){
                    var $link = $links.eq(i);
                    var href = $link.attr('href');
                    href = href.substring(href.indexOf("?"));
                    sspIds.push({
                        name: $link.text().trim(),
                        id: NSBSPageInfo.getParam("id" , href)
                    });
                }

                NSBSUtil.createCookie("sspIds", JSON.stringify(sspIds));
                retrieveSspIds();
            }
        });
    }

    function retrieveSspIds(){
        var knownSspIds = JSON.parse(NSBSUtil.readCookie('knownSspIds'));
        if(knownSspIds === null || !knownSspIds.hasOwnProperty(parseInt(pageInfo.userId))){
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
        // //Fetching the DocumentBrowserPage, and parsing the top-level folders
        // var fileList = JSON.parse(localStorage.fileList ? localStorage.fileList : 'null');
        // if(fileList === null || !fileList.hasOwnProperty(pageInfo.userId) || !pageInfo.fileData){
        //     fetchOrRetrieveFileData(fetchCombinerData);
        // }
        // else{
        //     //Grep the file list for combiner/templates.config within a 'Custom' directory
        //     pageInfo.combinerData = fileList[pageInfo.userId].filter(function(v,i,a){
        //         var path;
        //         //If it's a combiner file and inside a directory w/ 'Custom' in the name
        //         if(v.name === "combiner.config" || v.name === "templates.config"){
        //             path = renderFilePathById(v.id);
        //
        //             return path.indexOf('Custom') !== -1;
        //         }
        //         return false;
        //     });
        // }
    }

    /*
     This will load the combinerFile data from localStorage, and if not loaded, will trigger the data to be loaded.
     */
    function retrieveCombinerFiles(){
        // var combinerData = JSON.parse(localStorage.combinerData ? localStorage.combinerData : 'null');
        // //If we have a localstorage that's incomplete for our siteId
        // if(combinerData === null){
        //     fetchCombinerData();
        // }//Else we have combinerFile data, and an entry for our siteId
        // else{
        //     var siteCombiners = combinerData[pageInfo.userId];
        //
        //     //TODO: Render the links
        // }
    }

    /*
     This function will take an id and render the path of the file in text
     */
    function renderFilePathById(id){
        // var file = pageInfo.fileData[id];
        // var path = [''];//Adding an empty string to get a leading '/'
        // if(file){
        //     //We use length -1, b/c the path also has the fileId at the end
        //     for(var i = 0, l = file.path.length-1; i < l; i++){
        //         if(pageInfo.folderData.hasOwnProperty(file.path[i])){
        //             path.push(pageInfo.folderData[file.path[i]].name);
        //         }
        //         else{
        //             path.push('???');//So our path will still partial render
        //         }
        //     }
        //     //Manually adding the file name to the path
        //     path.push(file.name);
        // }
        // else{
        //     console.log('Attempted to render path for file id: ', id, ', but the file was not found.');
        // }
        // return path.join('/');
    }


    /*
     This will perform iterative searches to retrieve all file information from the search api.  After obtaining
     a complete list of all files, it will parse the file data into the master file data objecct.

     This function should only be called after we have fully retrieved the folder structure.
     */
    function retrieveFilesFromSearch(){
        // var filters = [], columns = [], files = [], results, recordsRemain = true, lastId = 0,
        //     tmp, parentId, name, i, l, count = 0, folderList = [], path, tmpFile;
        //
        // //Building a list of parentIds from the main folder list
        // pageInfo.folderList[pageInfo.userId].forEach(function(v,i,a){
        //     folderList.push(v.id);
        // });
        //
        // columns.push( new nlobjSearchColumn('internalid').setSort() );
        // columns.push( new nlobjSearchColumn('name') );
        // columns.push( new nlobjSearchColumn('folder') );
        // // columns.push( new nlobjSearchColumn('createdDate') );
        // // columns.push( new nlobjSearchColumn('lastModifiedDate') );
        //
        // filters.push( new nlobjSearchFilter('folder', null, 'anyof', folderList) );
        //
        // while(recordsRemain){
        //     //Adding the lastId-based filter right before calling the search
        //     filters.push( new nlobjSearchFilter('internalidnumber', null, 'greaterthan', lastId));
        //     try{
        //         results = nlapiSearchRecord('file', null, filters, columns);
        //     }
        //     catch(e){
        //         console.log(e);
        //     }
        //
        //
        //     if(results){
        //         count += results.length;//Keeping track of the records we've processed
        //         //Storing the records in the fileList object
        //         for(i = 0, l = results.length; i < l; i++){
        //             tmp = results[i];
        //             //Retrieving/generating data for the file
        //             lastId = tmp.getId();
        //             parentId = tmp.getValue('folder');
        //             name = tmp.getValue('name');
        //             //Retrieving the path from the parent folder
        //             if(pageInfo.folderData.hasOwnProperty(parentId)){
        //                 path = pageInfo.folderData[parentId].path.slice();
        //             }
        //             else{
        //                 path = [];
        //                 console.log("Couldn't find the parent for %s(%s), parent id: %s", name, lastId, parentId);
        //             }
        //
        //             path.push(lastId);//adding the file itself to its path
        //             //Building up the file data
        //             tmpFile = {
        //                 id: lastId,
        //                 name: name,
        //                 path: path,
        //                 hasChildren: false
        //             };
        //
        //             files.push(tmpFile);
        //         }
        //         filters.pop();//Removing our lastId-based filter, so it can be re-added upon the next iteration
        //     }
        //     else{
        //         recordsRemain = false;
        //     }
        //     console.log("Retrieved %i records, %i API calls remain.", count, nlapiGetContext().getRemainingUsage());
        // }
        // //Storing the discovered files
        // var existingFileList = JSON.parse(localStorage.fileList || '{}');
        // existingFileList[pageInfo.userId] = files;
        // localStorage.fileList = JSON.stringify( existingFileList );
        // pageInfo.fileList = existingFileList;
        // console.log('retrieved a total of ', files.length, 'files.');
        //
        // buildFileData();
    };


    function buildFileData(){
        // //Updating the fileData object with the newly retrieved files
        // var tmp;
        // pageInfo.fileData = {};
        // var files = pageInfo.fileList[pageInfo.userId];
        // for(var i = 0, l = files.length; i < l; i++){
        //     tmp = files[i];
        //     pageInfo.fileData[tmp.id] = tmp;
        // }
    }


    /*
     This function parses the file directory information from the format that netsuite uses in its backend.

     This will return an array of fileObjects, as defined below:
     fileInfo = {
     id: id,
     name: name,
     path: [top, 2nd, 3rd, 4th]//array of Id's in order from top
     hasChildren: true
     }
     */
    function parseFolderContents(folderString){
        // var fileCount, records, fileList, workingData, startOfData, endOfData, currentLine, tempFile;
        // //Locating the start/end of data since there is a bit of header info
        // startOfData = folderString.indexOf(NSBSConfig.STX);
        // endOfData = folderString.lastIndexOf(NSBSConfig.SOH);
        //
        // fileCount = parseInt( folderString.substring( folderString.indexOf(NSBSConfig.SOH) + 1,  startOfData) );
        // fileList = [];
        // //This split will give us a
        // workingData = folderString.substring(startOfData+1, endOfData).split(NSBSConfig.SOH+NSBSConfig.ACK+NSBSConfig.ACK+NSBSConfig.STX);
        // //Loop through each line and parse the data
        // for(var i = 0, l = workingData.length; i <l; i++){
        //     currentLine = workingData[i].split(NSBSConfig.SOH);//currentLine
        //     if(currentLine.length >= 5){
        //         var path = [];
        //         var tempPath = currentLine[4].split('.');
        //         //Parsing the paths into an array of integers
        //         for(var j = 0, m = tempPath.length; j < m; j++){
        //             path.push(tempPath[j]);
        //         }
        //
        //         tempFile = {
        //             id: currentLine[0],
        //             name: currentLine[1],
        //             path: path,
        //             hasChildren: currentLine[2] === '1'
        //         };
        //
        //         fileList.push(tempFile);
        //     }
        // }
        //
        // return fileList;
    }

    /*
     This function triggers an ajax call w/ a success function that will fire off countless others to traverse
     the entire file hierarchy.  It will first retrieve the folder hierarchy, then it will retrieve the contained
     files via search.
     */
    function retrieveFileData(callback){
        // var folderList = [], folderUrl, folderQueue = [], recursiveAjax, callCount = 0,
        //     existingFolderList;
        //
        // folderUrl = "/app/common/media/mediafoldertreehandler.nl?tnodeid=@id&taction=tmloaddata";
        //
        // //Ajax Success function defined here so we can be within the closure
        // recursiveAjax = function(data){
        //     callCount++;
        //     //if we're in a success function, we will need to parse it's results
        //     if(data){
        //         var records = parseFolderContents(data);
        //
        //         folderQueue.push.apply(folderQueue, records.filter(function(v,i,a){
        //             return v.hasChildren;
        //         }));
        //
        //         folderList.push.apply(folderList, records);
        //     }
        //     //Begin processing the next in queue
        //     var next = folderQueue.shift();
        //     if(next){
        //         var url= folderUrl.split('@id').join(next.id);
        //         jQuery.ajax({
        //             url: url,
        //             dataType: "text",
        //             success: recursiveAjax
        //         });
        //     }
        //     else{
        //         existingFolderList = JSON.parse(localStorage.folderList || '{}');
        //         existingFolderList[pageInfo.userId] = folderList;
        //         pageInfo.folderList = existingFolderList;
        //         localStorage.folderList = JSON.stringify( existingFolderList );
        //         console.log("Parsed all folders. Total of: %i records using %i AJAX Calls", folderList.length, callCount);
        //         //Now we need to build a fileData object from the folder information
        //         buildFolderData();
        //         //Once we have the folderInformation parsed into fileData, we will need to retrieve the files' info
        //         retrieveFilesFromSearch();
        //
        //         if(callback && typeof callback === 'function'){
        //             callback();
        //         }
        //     }
        // };
        //
        // //Manually adding these to prime the queue
        // folderList.push({
        //     id: "-15",
        //     name: "SuiteScripts" ,
        //     hasChildren: true,
        //     path: ["-15"]
        // });
        // folderQueue.push(folderList[0]);
        //
        // folderList.push({
        //     id: "-100",
        //     name: "Web Site Hosting Files",
        //     hasChildren: true,
        //     path: ['-100']
        // });
        //
        // jQuery.ajax({
        //     url: folderUrl.split('@id').join('-100'),
        //     success: recursiveAjax,
        //     dataType: 'text'
        // });
    }

    /*
     This will take the folderList array and parse it into an object that will allow quick-access to the
     file's data by ID.
     */
    function buildFolderData(){
        // if(pageInfo.folderList[pageInfo.userId]){
        //     var data, current, sortedFolders;
        //
        //     sortedFolders = pageInfo.folderList[pageInfo.userId].sort(function(a, b){
        //         if(a.path.length === b.path.length){
        //             return 0;
        //         }
        //         else return (a.path.length > b.path.length) ? 1 : -1;
        //     });
        //
        //     data = {};
        //
        //     for(var i = 0, l = sortedFolders.length; i < l; i++){
        //         current = sortedFolders[i];
        //
        //         data[current.id] = current;
        //     }
        //     //Storing the data object to the pageInfo object
        //     pageInfo.folderData = data;
        // }
    }

    /*
     This function will check local storage and set off a chain of AJAX calls to parse the file hierarchy.  It
     will only fire the fetch for file data once; it will need to be manually updated after that.
     */
    function fetchOrRetrieveFileData(callback){
        // var folderList = JSON.parse(localStorage.folderList || 'false');
        // var fileList = JSON.parse(localStorage.fileList || 'false');
        //
        // if( !folderList || !fileList || !folderList.hasOwnProperty(pageInfo.userId) || !fileList.hasOwnProperty(pageInfo.userId) ){
        //     console.log('FileList or FolderList not found for siteId, parsed: folder: ', folderList, ', file: ', fileList);
        //     //Check if we're going to load data
        //     if(NSBSUtil.readCookie('skippedFileData') !== null || confirm('There is no file Data present, and it is being requested, grab file data?')){
        //         retrieveFileData(fetchOrRetrieveFileData.bind(this, callback));
        //         NSBSUtil.eraseCookie('skippedFileData');
        //     }
        //     else{
        //         NSBSUtil.createCookie('skippedFileData', 'true', 1);
        //     }
        // }
        // else{
        //     //Assigning the loaded file/folder data into the pageInfo object
        //     pageInfo.folderList = folderList;
        //     pageInfo.fileList = fileList;
        //     //Building a JSON object w/ the IDs of each as keys(for quick lookups)
        //     buildFolderData();
        //     buildFileData();
        //
        //     if(typeof callback === 'function'){
        //         callback();
        //     }
        // }
    }

    return {
        fetchSspIds: fetchSspIds,
        fetchCombinerData: fetchCombinerData,
        retrieveSspIds: retrieveSspIds,
        retrieveCombinerFiles: retrieveCombinerFiles,
        fetchOrRetrieveFileData: fetchOrRetrieveFileData,
        renderFilePathById: renderFilePathById
    };
})();