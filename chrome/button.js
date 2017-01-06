/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var prefs = null;
var observerObj = null;

this.addEventListener("load", () => {
	prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("media.navigator.permission.");
	var toolbarbutton = document.getElementById("webrtc-permissions-ui-toggle-1");

	observerObj = {
		observe: function (aSubject, aTopic, aData) {
			console.log(arguments);
			if ("nsPref:changed" == aTopic) {
				let newValue = aSubject.getBoolPref(aData);
				toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto " + (newValue ? "(On)" : "(Off)");

				let message = "";
				if (newValue) {
					toolbarbutton.classList.add("setting-true");
					message = ("Automatic WebRTC connection has been turned on (permissions dialog disabled).\nYou might need to refresh the current page.");
				} else {
					toolbarbutton.classList.remove("setting-true");
					message = ("Automatic WebRTC connection has been turned off (permissions dialog enabled).");
				}

				try {
					Components.classes['@mozilla.org/alerts-service;1']
							.getService(Components.interfaces.nsIAlertsService)
							.showAlertNotification(null, "WebRTC Permissions UI Toggle", message, false, '', null);
				} catch(e) {
					alert(message);
				}
			}
		}
	};
	console.log(prefs,observerObj)
	prefs.addObserver("", observerObj, false);

	var value = prefs.getBoolPref("disabled");
	if (value) {
		prefs.setBoolPref("disabled", false);
		message = "Automatic WebRTC connection has been turned off (permissions dialog enabled).";
	} else {
		toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (Off)";
	}
});
this.addEventListener("unload", () => {
	prefs.removeObserver("", observerObj);
});

WebRTCPermissionsButtons = {
	TogglePermissionsUI: function (toolbarbutton) {
		var actualValue = prefs.getBoolPref("disabled");
		prefs.setBoolPref("disabled", !actualValue);
	}
}