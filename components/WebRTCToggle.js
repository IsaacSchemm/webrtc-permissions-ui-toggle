/***********************************************************
XPCOM
***********************************************************/

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");

AddonManager.addAddonListener({
	onUninstalling: function(addon) {
		if (addon.id == "webrtc-permissions-ui-toggle@lakora.us") {
			Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("media.navigator.permission.")
				.setBoolPref("disabled", false);
		}
	},
	onDisabling: function(addon) {
		if (addon.id == "webrtc-permissions-ui-toggle@lakora.us") {
			Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("media.navigator.permission.")
				.setBoolPref("disabled", false);
		}
	},
	// If user decides to cancel the disable/uninstall, they can just reactivate the override with the toolbar button.
});

/***********************************************************
class definition
***********************************************************/

//class constructor
function WebRTCToggle() { }

// class definition
WebRTCToggle.prototype = {

    // properties required for XPCOM registration:
    classDescription: "WebRTC Toggle (WebRTC Permissions UI Override)",
    classID:          Components.ID("{265ba61d-8b89-4739-acc6-24df0bf7eb70}"),
    contractID:       "@propfire/startup;1",
    QueryInterface:   XPCOMUtils.generateQI([Components.interfaces.nsIObserver]),

    // add to category manager
    _xpcom_categories: [{category: "profile-after-change"}],

    observe: function(aSubject, aTopic, aData) 
    {
        switch (aTopic) 
        {
            case "profile-after-change":
                Components.classes["@mozilla.org/observer-service;1"]
					.getService(Components.interfaces.nsIObserverService)
					.addObserver(this, "quit-application", false);
						
				Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("media.navigator.permission.")
					.addObserver("", this, false);
                break;
			case "quit-application":
				Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("media.navigator.permission.")
					.setBoolPref("disabled", false);
				break;
            case "nsPref:changed":
				var title = "WebRTC Permissions UI Toggle";
				var newValue = aSubject.getBoolPref(aData);
				
				var message = "";
				if (newValue) {
					message = "Automatic WebRTC connection has been turned on. Make sure to turn it off when you're done!\nYou might need to refresh the current page.";
				} else {
					message = "Automatic WebRTC connection has been turned off.";
				}

				var type = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("extensions.webrtc-permissions-ui-toggle.")
					.getCharPref("notify-type");
				switch (type) {
					case "non-modal":
						try {
							Components.classes['@mozilla.org/alerts-service;1']
								.getService(Components.interfaces.nsIAlertsService)
								.showAlertNotification(null, title, message, false, '', null);
						} catch (e) {
							Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
								.getService(Components.interfaces.nsIPromptService)
								.alert(null, title, message);
						}
						break;
					case "none":
						break;
					default:
						try {
							Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
								.getService(Components.interfaces.nsIPromptService)
								.alert(null, title, message);
						} catch (e) {
							Components.classes['@mozilla.org/alerts-service;1']
								.getService(Components.interfaces.nsIAlertsService)
								.showAlertNotification(null, title, message, false, '', null);
						}
						break;
				}
                break;
            default:
                throw Components.Exception("Unknown topic: " + aTopic);
        }
    }
};

var components = [WebRTCToggle];  
if (XPCOMUtils.generateNSGetFactory)
{
    var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
}
else
{
    var NSGetModule = XPCOMUtils.generateNSGetModule(components);
}

