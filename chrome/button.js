this.addEventListener("load", () => {
	console.log("loading");
	
	var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("media.navigator.permission.");
	var toolbarbutton = document.getElementById("webrtc-permissions-ui-toggle-1");

	var value = prefs.getBoolPref("disabled");
	toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto " + (value ? "(On)" : "(Off)");
	if (value) toolbarbutton.classList.add("setting-true");
});
this.addEventListener("unload", () => console.log("unloading"));

WebRTCPermissionsButtons = {
	TogglePermissionsUI: function (toolbarbutton) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("media.navigator.permission.");

		var thisButtonValue = toolbarbutton.classList.contains("setting-true");
		var actualValue = prefs.getBoolPref("disabled");
		if (!thisButtonValue) {
			toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (On)";
			toolbarbutton.classList.add("setting-true");
			prefs.setBoolPref("disabled", true);
			if (thisButtonValue == actualValue)
				alert("Automatic WebRTC connection has been turned on (permissions dialog disabled).\nYou might need to refresh the current page.");
		} else {
			toolbarbutton.label = toolbarbutton.tooltipText = "WebRTC Auto (Off)";
			toolbarbutton.classList.remove("setting-true");
			prefs.setBoolPref("disabled", false);
			if (thisButtonValue == actualValue)
				alert("Automatic WebRTC connection has been turned off (permissions dialog enabled).");
		}
	}
}