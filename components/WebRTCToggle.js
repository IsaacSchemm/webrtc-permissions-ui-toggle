/***********************************************************
XPCOM
***********************************************************/

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Console.jsm");
Components.utils.import("resource://gre/modules/GMPInstallManager.jsm");

// When the user decides to disable or uninstall the add-on, turn the override
// off immediately, instead of waiting for application shutdown. In button.js
// we check the status of the add-on, and prevent the user from turning the
// override back on if the extension is going to be uninstalled or disabled.
AddonManager.addAddonListener({
	onUninstalling: function(addon) {
		if (addon.id == "webrtc-permissions-ui-toggle@lakora.us") {
			var svc = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService);
			svc.getBranch("media.navigator.permission.")
				.setBoolPref("disabled", false);
			svc.getBranch("media.navigator.")
				.clearUserPref("enabled");
			svc.getBranch("media.peerconnection.")
				.clearUserPref("enabled");
			svc.getBranch("media.gmp-manager.")
				.clearUserPref("url");
			svc.getBranch("media.gmp-gmpopenh264.")
				.clearUserPref("enabled");
		}
	},
	onDisabling: function(addon) {
		if (addon.id == "webrtc-permissions-ui-toggle@lakora.us") {
			var svc = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService);
			svc.getBranch("media.navigator.permission.")
				.setBoolPref("disabled", false);
			svc.getBranch("media.navigator.")
				.clearUserPref("enabled");
			svc.getBranch("media.peerconnection.")
				.clearUserPref("enabled");
			svc.getBranch("media.gmp-manager.")
				.clearUserPref("url");
			svc.getBranch("media.gmp-gmpopenh264.")
				.clearUserPref("enabled");
		}
	}
});

/***********************************************************
class definition
***********************************************************/

//class constructor
function WebRTCToggle() { }

WebRTCToggle.installOpenH264 = async function () {
	const strings = Components.classes["@mozilla.org/intl/stringbundle;1"]
		.getService(Components.interfaces.nsIStringBundleService)
		.createBundle("chrome://webrtc-permissions-ui-toggle/locale/webrtc-permissions-ui-toggle.properties");
	const title = strings.GetStringFromName("title");

	// Check if OpenH264 is enabled or disabled. If not set, ask the user.
	let openH264Enabled;
	const branch = Components.classes["@mozilla.org/preferences-service;1"]
		.getService(Components.interfaces.nsIPrefService)
		.getBranch("media.gmp-gmpopenh264.");
	try {
		openH264Enabled = branch.getBoolPref("enabled");
	} catch (e) {
		const ok = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
			.getService(Components.interfaces.nsIPromptService)
			.confirm(null, title, strings.GetStringFromName("openH264EnablePromptMessage"));
		branch.setBoolPref("enabled", ok);
		openH264Enabled = ok;
	}

	if (openH264Enabled) {
		// Fix GMP manager URL: replace SeaMonkey version number with Gecko/Firefox version number.
		let current_url;
		try {
			current_url = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("media.gmp-manager.")
				.getCharPref("url");
			if (!current_url) throw new Error("media.gmp-manager.url is null or empty");
		} catch (e) {
			console.error(e);
			return;
		}
		let new_url = current_url.replace("%VERSION%", "%PLATFORM_VERSION%");
		if (new_url != current_url) {
			console.log("Updating media.gmp-manager.url to " + new_url);
			Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("media.gmp-manager.")
				.setCharPref("url", new_url);
		}

		// Check if OpenH264 is installed.
		const gmpInstallManager = new GMPInstallManager();
		const resp = await gmpInstallManager.checkForAddons();
		const addon = resp.gmpAddons.filter(a => a.id === "gmp-gmpopenh264")[0];
		console.log(addon && addon.isInstalled);
		if (addon && !addon.isInstalled) {
			const ok = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService)
				.confirm(null, title, strings.GetStringFromName("openH264InstallPromptMessage"));
			if (ok) {
				// Install OpenH264
				await gmpInstallManager.installAddon(addon);
				console.log("Installed OpenH264");
			}
		}
	}
}

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
				var svc = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService);
				svc.getBranch("media.navigator.permission.")
					.setBoolPref("disabled", false);
				svc.getBranch("media.navigator.")
					.clearUserPref("enabled");
				svc.getBranch("media.peerconnection.")
					.clearUserPref("enabled");
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

				if (newValue) {
					WebRTCToggle.installOpenH264().catch(console.error);
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

