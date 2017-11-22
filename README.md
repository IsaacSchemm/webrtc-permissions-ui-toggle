WebRTC Permissions UI Toggle
============================

This is an extension for [SeaMonkey](http://www.seamonkey-project.org/) that
toggles the **media.navigator.permission.disabled** setting on and off.
SeaMonkey does not have a permissions dialog to let the user select a camera
and microphone (see [bug 956854](https://bugzilla.mozilla.org/show_bug.cgi?id=956854)),
so using this setting to override the dialog is the only way to enable WebRTC
support.

Of course, leaving this setting on is insecure, since any web site that's open
will be able to get access to your microphone, camera, and screen! So be sure
to only turn it on when you need to use WebRTC, and turn it off once you're
done with it.

Some versions of SeaMonkey might ship with WebRTC disabled by default.
WebRTC Permissions UI Toggle 1.3.0+ will enable WebRTC while toggled on, and
reset it to its original value when toggled off.

Instructions
------------

1. Install the extension. You can download it from the
[SeaMonkey Add-ons site](https://addons.mozilla.org/en-US/seamonkey/addon/webrtc-permissions-ui-toggle).
After you install the extension, you will need to restart SeaMonkey.

2. Before visiting a website that needs to use WebRTC, open the Tools menu and
select "WebRTC Override." A box will appear asking if you want to share your
camera, microphone, and screen with all open websites. Clicking OK will enable
the override until you turn it off or close your browser.

3. If you are on a page that uses WebRTC and you have just enabled the
override, you may need to refresh the page for it to work.

Known Bugs
----------

* If toggling the override is configured to trigger a standard notification
(the default), and you have windows open that were launched from JavaScript,
the notification may appear outside of the top edge of the monitor.

Notes
-----

Closing the entire application, or disabling or removing the extension, will
always turn off the override. If you want, you can also have it turn off
whenever a new browser window is opened.

Your first camera/screen/etc. will be chosen automatically. If you need to
select a particular camera, mic, screen, or window to share, you'll
have to use another web browser (like Firefox.)

Sites that use H.264 as a video codec instead of VP8 might not work properly
in SeaMonkey 2.49.x. This problem is not specific to SeaMonkey; Firefox 52 ESR
has the same issue.

If the SeaMonkey Add-ons site is down, check the [Releases](https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle/releases) section on GitHub for the most recent .xpi file.
