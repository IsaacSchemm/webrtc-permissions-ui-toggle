WebRTC Permissions UI Toggle
============================

This is an extension for [SeaMonkey](http://www.seamonkey-project.org/) that
adds a toolbar button for toggling the **media.navigator.permission.disabled**
setting on and off. SeaMonkey does not have a permissions dialog to let the
user select a camera and microphone (see
[bug 956854](https://bugzilla.mozilla.org/show_bug.cgi?id=956854)), so
overriding the permissions dialog is the only way to enable WebRTC support.

Of course, leaving this setting on is *very insecure*, since any web site
will be able to get access to your microphone and camera! So be sure to only
turn it on when you need to use WebRTC, and **turn it off** once you have
your webcam up and running.

Opening a new browser window will also turn off the permissions dialog
override, unless you disable this behavior in the extension preferences.

Releases
--------

Check the GitHub [releases section](https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle/releases)
for an XPI file that you can install.

This extension might also work in Firefox (tested with Firefox 52), but since
it's unsigned, you'll need to use the Developer Edition or a non-branded
build. However, since Firefox already has a WebRTC permissions dialog, this
extension is **not recommended** for Firefox and should not be necessary.
