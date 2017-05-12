# ns_backend_script

This is a Tamper/Grease-MonkeyScript that adds some good functionality to the backend of NetSuite.

## Features
* Additional Controls
** Direct Links
*** Added some direct links to the File Cabinet and Custom Record pages
*** SSP Applications
**** SSP Applications are scanned and stored to localstorage, and links are generated to each SSP's page
* Search
** Search now has a 'Direct Edit' link which will directly open the file editor for the searched file(if its modifiable)
* File Cabinet
** Hierarchy Parsing(first load will take quite some time and potentially consume all the APIs)
** Direct Edit Link: In File Cabinet all non-folders will have an 'EditFile' link  which will open the editor

## Installation
You will need GreaseMonkey or TamperMonkey to install the script; these are browser extensions that allow you to run
local user scripts.  Once the addon has been installed, you will need to add a new user script, and paste in the contents
of netsuites-tampermonkey.meta.js into the user script, and set the update URL to be:
`http://nsbs.brostowicz.com/netsuites-tampermonkey.meta.js`

Once this is done, your script will prompt you to scan file cabinet; do so if you'd like.  It will take a lot of API
credits since it will traverse the entire file hierarchy of File Cabinet.