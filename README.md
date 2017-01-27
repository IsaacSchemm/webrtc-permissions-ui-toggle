WebRTC Permissions UI Toggle
============================

This is an extension for [SeaMonkey](http://www.seamonkey-project.org/) that
adds a toolbar button for toggling the **media.navigator.permission.disabled**
setting on and off. SeaMonkey does not have a permissions dialog to let the
user select a camera and microphone (see
[bug 956854](https://bugzilla.mozilla.org/show_bug.cgi?id=956854)), so
overriding the permissions dialog by turning this setting on is the only way to enable WebRTC support.

Of course, leaving this setting on is very insecure, since any web site
that's open will be able to get access to your microphone, camera, and screen! So be sure to only
turn it on when you need to use WebRTC, and turn it off once you're done with it.

Opening a new browser window will also turn off the permissions dialog
override, unless you disable this behavior in the extension preferences.

NOTE: your first camera/screen/etc. will be chosen automatically. If you
need to select a particular camera, mic, screen, or window to share, you'll
have to use another web browser (like Firefox.)

Releases
--------

Check the GitHub [releases section](https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle/releases)
for an XPI file that you can install.

This extension might also work in Firefox, but you'll need to add Firefox to
the install.rdf and build the extension yourself. Since Firefox already has a
WebRTC permissions dialog, this extension is not recommended for Firefox and
should not be necessary.
