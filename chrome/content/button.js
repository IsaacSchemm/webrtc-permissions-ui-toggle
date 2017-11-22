/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var prefs = null;
var observerObj = null;

this.addEventListener("load", function () {
	prefs = Services.prefs.getBranch("media.navigator.permission.");
	var toolbarbutton = document.getElementById("webrtc-permissions-ui-toggle-1");
	var menuItem = document.getElementById("webRTCOverrideToolsMenuToggle");
	
	var showInMenu = Services.prefs
		.getBranch("extensions.webrtc-permissions-ui-toggle.")
		.getBoolPref("show-in-menu");
	if (!showInMenu) menuItem.hidden = true;

	observerObj = {
		observe: function (aSubject, aTopic, aData) {
			if ("nsPref:changed" == aTopic) {
				var newValue = aSubject.getBoolPref(aData);

				if (newValue) {
					toolbarbutton.label = toolbarbutton.tooltipText = WebRTCPermissionsButtons.GetString("overrideOn");
					toolbarbutton.classList.add("setting-true");
					menuItem.setAttribute("checked", true);
				} else {
					toolbarbutton.label = toolbarbutton.tooltipText = WebRTCPermissionsButtons.GetString("overrideOff");
					toolbarbutton.classList.remove("setting-true");
					menuItem.setAttribute("checked", false);
				}
			}
		}
	};
	
	prefs.addObserver("", observerObj, false);

	var value = prefs.getBoolPref("disabled");
	if (value) {
		toolbarbutton.label = toolbarbutton.tooltipText = WebRTCPermissionsButtons.GetString("overrideOn");
		toolbarbutton.classList.add("setting-true");
		menuItem.setAttribute("checked", true);
		
		var r = Services.prefs
					.getBranch("extensions.webrtc-permissions-ui-toggle.")
					.getBoolPref("reset-on-new-window");
		if (r) {
			prefs.setBoolPref("disabled", false);
		}
	} else {
		toolbarbutton.label = toolbarbutton.tooltipText = WebRTCPermissionsButtons.GetString("overrideOff");
	}
});
this.addEventListener("unload", function () {
	prefs.removeObserver("", observerObj);
});

WebRTCPermissionsButtons = {
	GetString: s => {
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
	TogglePermissionsUI: () => {
		var title = WebRTCPermissionsButtons.GetString("title");
		AddonManager.getAddonByID("webrtc-permissions-ui-toggle@lakora.us", addon => {
			var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
				
			if (addon.pendingOperations & (AddonManager.PENDING_DISABLE | AddonManager.PENDING_UNINSTALL)) {
				promptService.alert(this.window, title, WebRTCPermissionsButtons.GetString("enableOrReinstallRequired"));
			} else {
				var actualValue = prefs.getBoolPref("disabled");
				if (actualValue) {
					prefs.setBoolPref("disabled", false);
					Services.prefs.getBranch("media.navigator.").clearUserPref("enabled");
					Services.prefs.getBranch("media.peerconnection.").clearUserPref("enabled");
				} else if (promptService.confirm(this.window, title, WebRTCPermissionsButtons.GetString("confirmationPromptMessage"))) {
					prefs.setBoolPref("disabled", true);
					Services.prefs.getBranch("media.navigator.").setBoolPref("enabled", true);
					Services.prefs.getBranch("media.peerconnection.").setBoolPref("enabled", true);
				}
			}
		});
	}
}