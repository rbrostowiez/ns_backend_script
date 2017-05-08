/**
 * Created by Ray on 5/8/2017.
 */

var NSBSConfig = {
    excludedPages: [
        "/pages/customerlogin.jsp", "/app/center/myroles.nl", "/app/setup/adminmessage.nl",
        "/app/common/record/edittextmediaitem.nl", "/app/help/helpcenter.nl", "/app/help/nshelp.nl",
        "/help/helpcenter", "/core/media/media.nl", "/core/help/fieldhelp.nl", "SSP Applications",
        "/app/common/media/mediaitem.nl", "/app/common/custom/custrecordentry.nl",
        "/app/crm/common/merge/emailtemplate.nl", "/app/site/hosting/scriptlet.nl"
    ],

    links: [
        {label: "File Cabinet", path: "/app/common/media/mediaitemfolders.nl"},
        {label: "Custom Record Types", path: "/app/common/custom/custrecords.nl"}
    ],

    //A list of URLs where it's ok to initialize if we're in a child window
    childWindowPages: [
        "/app/common/media/mediaitemfolders.nl"
    ],

    SOH: String.fromCharCode(1),
    STX: String.fromCharCode(2),
    ENQ: String.fromCharCode(5),
    ACK: String.fromCharCode(6)

};