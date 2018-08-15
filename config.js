/**
 * Created by Ray on 5/8/2017.
 */

pageInfo = {};

var stylesheet = GM_getResourceText('stylesheet');
GM_addStyle(stylesheet);

window.doPageLogging = false;

NSBSConfig = {
    excludedPages: [
        "/pages/customerlogin.jsp", "/app/center/myroles.nl", "/app/setup/adminmessage.nl",
        "/app/common/record/edittextmediaitem.nl", "/app/help/helpcenter.nl", "/app/help/nshelp.nl",
        "/help/helpcenter", "/core/media/media.nl", "/core/help/fieldhelp.nl", "SSP Applications",
        "/app/common/media/mediaitem.nl", "/app/common/custom/custrecordentry.nl",
        "/app/crm/common/merge/emailtemplate.nl", "/app/site/hosting/scriptlet.nl"
    ],

    links: [
        {label: "File Cabinet", path: "/app/common/media/mediaitemfolders.nl"},
        {label: "Custom Record Types", path: "/app/common/custom/custrecords.nl"},
    ],

    helpLinks: {
        label: "Help",
        path: "/app/help/helpcenter.nl",
        children: [
            { label: "Schema Browser", path: "/help/helpcenter/en_US/srbrowser/Browser2018_1/schema/record/account.html" },
            { label: "SuiteScript 2.0", path: "/app/help/helpcenter.nl?fid=part_4563537633.html"}
        ]
    },

    //A list of URLs where it's ok to initialize if we're in a child window
    childWindowPages: [
        "/app/common/media/mediaitemfolders.nl"
    ],

    SOH: String.fromCharCode(1),
    STX: String.fromCharCode(2),
    ENQ: String.fromCharCode(5),
    ACK: String.fromCharCode(6)

};