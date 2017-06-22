/***********************************************************
XPCOM
***********************************************************/

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Console.jsm");

// When the user decides to disable or uninstall the add-on, turn the override
// off immediately, instead of waiting for application shutdown. In button.js
// we check the status of the add-on, and prevent the user from turning the
// override back on if the extension is going to be uninstalled or disabled.
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
	}
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
	classID:		  Components.ID("{265ba61d-8b89-4739-acc6-24df0bf7eb70}"),
	contractID:	   "@propfire/startup;1",
	QueryInterface:   XPCOMUtils.generateQI([Components.interfaces.nsIObserver]),

	// add to category manager
	_xpcom_categories: [{category: "profile-after-change"}],
	
	prefBranch: null,
	
	getString: s => {
		var strings = Components.classes["@mozilla.org/intl/stringbundle;1"]
			.getService(Components.interfaces.nsIStringBundleService)
			.createBundle("chrome://webrtc-permissions-ui-toggle/locale/webrtc-permissions-ui-toggle.properties");
		try {
			return strings.GetStringFromName(s);
		} catch (e) {
			if ("console" in window) window.console.log(e);
			return "?";
		}
	},

	observe: function(aSubject, aTopic, aData)
	{
		switch (aTopic) 
		{
			case "profile-after-change":
				// Set up listeners for the cases below.
				Components.classes["@mozilla.org/observer-service;1"]
					.getService(Components.interfaces.nsIObserverService)
					.addObserver(this, "quit-application", false);
						
				this.prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("media.navigator.permission.");
				this.prefBranch.addObserver("", this, false);
				break;
			case "quit-application":
				// Turn the override off when closing the application,
				// regardless of whether or not the add-on is going to be
				// uninstalled.
				Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("media.navigator.permission.")
					.setBoolPref("disabled", false);
				break;
			case "nsPref:changed":
				var strings = Components.classes["@mozilla.org/intl/stringbundle;1"]
					.getService(Components.interfaces.nsIStringBundleService)
					.createBundle("chrome://webrtc-permissions-ui-toggle/locale/webrtc-permissions-ui-toggle.properties");
					
				// Determine which message to show to the user.
				var title = strings.GetStringFromName("title");
				var newValue = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("media.navigator.permission.")
					.getBoolPref(aData);
				
				var message = strings.GetStringFromName(newValue ? "turnedOn" : "turnedOff");
				console.log(message);

				var type = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("extensions.webrtc-permissions-ui-toggle.")
					.getCharPref("notify-type");
				switch (type) {
					case "non-modal":
						// Use nsIAlertsService to show a notification.
						// If you want the native Windows 10 notifications you
						// can use the GNotifier add-on along with this one.
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
						// User has decided not to show a notification.
						break;
					default:
						// Use nsIPromptService to show an old-fashioned modal dialog.
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

