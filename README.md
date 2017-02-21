WebRTC Permissions UI Toggle
============================

This is an extension for [SeaMonkey](http://www.seamonkey-project.org/) that
adds a toolbar button for toggling the **media.navigator.permission.disabled**
setting on and off. SeaMonkey does not have a permissions dialog to let the
user select a camera and microphone (see
[bug 956854](https://bugzilla.mozilla.org/show_bug.cgi?id=956854)), so
overriding the permissions dialog by turning this setting on is the only way
to enable WebRTC support.

Of course, leaving this setting on is very insecure, since any web site
that's open will be able to get access to your microphone, camera, and screen!
So be sure to only turn it on when you need to use WebRTC, and turn it off
once you're done with it.

Closing the entire application, or uninstalling the extension, will always
turn off the override. If you want, you can also have it turn off whenever a
new browser window is opened.

Instructions
------------

1. Install the extension. You can download it from the SeaMonkey Add-ons site
(https://addons.mozilla.org/en-US/seamonkey/addon/webrtc-permissions-ui-toggle)
or check the Releases section here on GitHub for the most recent .xpi file.
After you install the extension, you will need to restart SeaMonkey.

2. Add the WebRTC Override button to the toolbar. Right-click on an empty area
of a toolbar (menu bar, navigation toolbar, or bookmarks toolbar) near the
right side of the SeaMonkey window, and click Customize. Then find the WebRTC
Override icon in the list of options and drag it onto one of the toolbars.
Press Done to save your changes.

3. Before visiting a website that needs to use WebRTC, click the WebRTC
Override button. A box will appear asking if you want to share your camera,
microphone, and screen with all open websites. Clicking OK will enable the
override until you turn it off or close your browser.

4. If you are on a page that uses WebRTC and you have just enabled the
override, you may need to refresh the page for it to work.

Known Bugs
----------

* If toggling the override is configured to trigger a standard notification
(the default), and you have windows open that were launched from JavaScript,
the notification may appear outside of the top edge of the monitor.
* If toggling the override is configured to trigger a modal dialog, and you
have multiple windows open, multiple notification dialogs will be displayed.
* If the override is on, closing SeaMonkey with File > Exit or Ctrl+Q may not
turn it off.

Notes
-----

Your first camera/screen/etc. will be chosen automatically. If you need to
select a particular camera, mic, screen, or window to share, you'll
have to use another web browser (like Firefox.)

This extension might also work in Firefox, but you'll need to add Firefox to
the install.rdf and build the extension yourself. Since Firefox already has a
WebRTC permissions dialog, this extension is not recommended for Firefox and
should not be necessary.
