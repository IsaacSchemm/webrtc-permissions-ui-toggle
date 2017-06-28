sm-webrtc-override-check
------------------------

If the user is running SeaMonkey, this script will make repeated WebRTC
permission requests. If the first request is not immediately accepted, a
dialog will be shown prompting the user to install and activate the "WebRTC
Permissions UI Toggle" extension.

When the user activates the WebRTC override using the extension, this script
should detect that the request has suceeded and remove the dialog from the
page. The user can also dismiss the dialog manually with the Ignore button.

This script can be included for all browsers; it won't do anything if the
browser is not SeaMonkey. You can include it before or after the page has
loaded.
