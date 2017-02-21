/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var prefs = null;
var observerObj = null;
var title = "WebRTC Permissions UI Toggle";

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
	}
});

this.addEventListener("load", function () {
	prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("media.navigator.permission.");
	var thisWindow = this;
	var toolbarbutton = document.getElementById("webrtc-permissions-ui-toggle-1");
	
	Components.classes["@mozilla.org/observer-service;1"]
		.getService(Components.interfaces.nsIObserverService)
		.addObserver({
		observe: function (aSubject, aTopic, aData) {
			if (aData == "shutdown") {
				if (prefs) {
					prefs.setBoolPref("disabled", false);
				}
			}
		}
	}, "quit-application", false);

	observerObj = {
		observe: function (aSubject, aTopic, aData) {
			if ("nsPref:changed" == aTopic) {
				var newValue = aSubject.getBoolPref(aData);

				var message = "";
				if (newValue) {
					toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Override (On)";
					toolbarbutton.classList.add("setting-true");
					message = "Automatic WebRTC connection has been turned on. Make sure to turn it off when you're done!\nYou might need to refresh the current page.";
				} else {
					toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Override (Off)";
					toolbarbutton.classList.remove("setting-true");
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
									.alert(thisWindow, title, message);
						}
						break;
					case "none":
						break;
					default:
						try {
							Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
									.getService(Components.interfaces.nsIPromptService)
									.alert(thisWindow, title, message);
						} catch (e) {
							Components.classes['@mozilla.org/alerts-service;1']
										.getService(Components.interfaces.nsIAlertsService)
										.showAlertNotification(null, title, message, false, '', null);
						}
						break;
				}
			}
		}
	};
	
	prefs.addObserver("", observerObj, false);

	var value = prefs.getBoolPref("disabled");
	if (value) {
		toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Override (On)";
		toolbarbutton.classList.add("setting-true");
		
		var r = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("extensions.webrtc-permissions-ui-toggle.")
					.getBoolPref("reset-on-new-window");
		if (r) {
			prefs.setBoolPref("disabled", false);
		}
	} else {
		toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Override (Off)";
	}
});
this.addEventListener("unload", function () {
	prefs.removeObserver("", observerObj);
});

WebRTCPermissionsButtons = {
	TogglePermissionsUI: toolbarbutton => {
		AddonManager.getAddonByID("webrtc-permissions-ui-toggle@lakora.us", addon => {
			var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
				
			if (addon.pendingOperations & (AddonManager.PENDING_DISABLE | AddonManager.PENDING_UNINSTALL)) {
				promptService.alert(this.window, title, "To use this extension, you must enable or reinstall it.");
			} else {
				var actualValue = prefs.getBoolPref("disabled");
				if (actualValue) {
					prefs.setBoolPref("disabled", false);
				} else if (promptService.confirm(this.window, title, `Only use this feature with sites you trust. Sharing can allow deceptive sites to browse as you and steal your private data.
Are you sure you want to share your camera, microphone, and screen with all open web sites?
`)) {
					prefs.setBoolPref("disabled", true);
				}
			}
		});
	}
}