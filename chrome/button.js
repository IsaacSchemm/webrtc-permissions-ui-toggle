/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var prefs = null;
var observerObj = null;

this.addEventListener("load", function () {
	prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("media.navigator.permission.");
	var thisWindow = this;
	var toolbarbutton = document.getElementById("webrtc-permissions-ui-toggle-1");

	observerObj = {
		observe: function (aSubject, aTopic, aData) {
			if ("nsPref:changed" == aTopic) {
				var newValue = aSubject.getBoolPref(aData);

				var message = "";
				if (newValue) {
					toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (On)";
					toolbarbutton.classList.add("setting-true");
					message = "Automatic WebRTC connection has been turned on (permissions dialog overridden).\nYou might need to refresh the current page.";
				} else {
					toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (Off)";
					toolbarbutton.classList.remove("setting-true");
					message = "Automatic WebRTC connection has been turned off (permissions dialog re-enabled).";
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
									.showAlertNotification(null, "WebRTC Permissions UI Toggle", message, false, '', null);
						} catch (e) {
							alert(message);
						}
						break;
					case "none":
						break;
					default:
						try {
							alert(message);
						} catch (e) {
							Components.classes['@mozilla.org/alerts-service;1']
										.getService(Components.interfaces.nsIAlertsService)
										.showAlertNotification(null, "WebRTC Permissions UI Toggle", message, false, '', null);
						}
						break;
				}
			}
		}
	};
	
	prefs.addObserver("", observerObj, false);

	var value = prefs.getBoolPref("disabled");
	if (value) {
		toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (On)";
		toolbarbutton.classList.add("setting-true");
		
		var r = Components.classes["@mozilla.org/preferences-service;1"]
					.getService(Components.interfaces.nsIPrefService)
					.getBranch("extensions.webrtc-permissions-ui-toggle.")
					.getBoolPref("reset-on-new-window");
		if (r) {
			prefs.setBoolPref("disabled", false);
		}
	} else {
		toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (Off)";
	}
});
this.addEventListener("unload", function () {
	prefs.removeObserver("", observerObj);
});

WebRTCPermissionsButtons = {
	TogglePermissionsUI: function (toolbarbutton) {
		var actualValue = prefs.getBoolPref("disabled");
		prefs.setBoolPref("disabled", !actualValue);
	}
}