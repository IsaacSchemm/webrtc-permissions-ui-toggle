WebRTC Permissions UI Toggle
============================

This extension provides a UI to enable the WebRTC support in SeaMonkey. When
you activate it (from a toolbar button or from the Tools menu in the browser),
it does three things:

* Enables WebRTC (if currently disabled)
* Turns on the setting `media.navigator.permission.disabled`, which allows
  all WebRTC connections without prompting
* Checks the status of [OpenH264](http://www.openh264.org/); if it's enabled
  but not installed, the user will be asked if they want to install or disable it

SeaMonkey does not have a permissions dialog to let the user select a camera
and microphone (see [bug 956854](https://bugzilla.mozilla.org/show_bug.cgi?id=956854)),
so using `media.navigator.permission.disabled` to override the dialog is the
only way to enable WebRTC support.

Of course, leaving this setting on is insecure, since any web site that's open
will be able to get access to your microphone, camera, and screen! So be sure
to only turn it on when you need to use WebRTC, and turn it off once you're
done with it.

Instructions
------------

1. Install the extension. You can get the newest version from the
[releases page](https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle/releases)
or use the
[SeaMonkey Add-ons site](https://addons.mozilla.org/en-US/seamonkey/addon/webrtc-permissions-ui-toggle).
After you install the extension, you will need to restart SeaMonkey.

2. Before visiting a website that needs to use WebRTC, open the Tools menu and
select "Enable WebRTC." A box will appear asking if you want to share your
camera, microphone, and screen with all open websites. Clicking OK will enable
the override until you turn it off or close your browser.

3. If you do not have OpenH264 installed yet (and you haven't disabled it),
the extension will offer to install it for you.

4. If you are on a page that uses WebRTC and you have just enabled the
override, you may need to refresh the page for it to work.

Notes for Web Developers
------------------------

In SeaMonkey (2.49.1 and later), WebRTC is typically disabled, which means the
`navigator.mediaDevices` object will be undefined. When this extension is
activated, `navigator.mediaDevices` will be present.

In Firefox, the user is prompted to select a camera/microphone device. In
SeaMonkey, however, the user's default camera/microphone will always be used
unless you specify a device. `navigator.mediaDevices.enumerateDevices` will
get you a list of devices, but the device labels will only be included if
there is already an active `MediaStream` from `getUserMedia`. One possible
workaround is to start a stream, grab the list of devices, and then stop the
stream.

Notes
-----

Closing the entire application, or disabling or removing the extension, will
always turn off the override. If you want, you can also have it turn off
whenever a new browser window is opened.

If the SeaMonkey Add-ons site is down, check the [Releases](https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle/releases) section on GitHub for the most recent .xpi file.
