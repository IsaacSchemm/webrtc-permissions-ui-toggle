/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var prefs = null;
var observerObj = null;
var title = "WebRTC Permissions UI Toggle";

this.addEventListener("load", function () {
	prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("media.navigator.permission.");
	var toolbarbutton = document.getElementById("webrtc-permissions-ui-toggle-1");

	observerObj = {
		observe: function (aSubject, aTopic, aData) {
			if ("nsPref:changed" == aTopic) {
				var newValue = aSubject.getBoolPref(aData);

				if (newValue) {
					toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Override (On)";
					toolbarbutton.classList.add("setting-true");
				} else {
					toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Override (Off)";
					toolbarbutton.classList.remove("setting-true");
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
		var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
			.getService(Components.interfaces.nsIPromptService);

		var actualValue = prefs.getBoolPref("disabled");
		if (actualValue) {
			prefs.setBoolPref("disabled", false);
		} else if (promptService.confirm(this.window, title, `Only use this feature with sites you trust. Sharing can allow deceptive sites to browse as you and steal your private data.
Are you sure you want to share your camera, microphone, and screen with all open web sites?
`)) {
			prefs.setBoolPref("disabled", true);
		}
	}
}