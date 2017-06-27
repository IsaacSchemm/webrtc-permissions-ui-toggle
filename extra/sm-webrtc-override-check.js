/* SeaMonkey WebRTC override check.
  Last updated: June 27, 2017
  https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle

  If the user is running SeaMonkey, this script will make repeated WebRTC
  permission requests. If the first request is not immediately accepted, a
  dialog will be shown prompting the user to install and activate the "WebRTC
  Permissions UI Toggle" extension.
*/

if (/SeaMonkey/.test(navigator.userAgent)) {
    window.addEventListener("load", function () {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

        var webRTCSuccess = false;

        // Initial check
        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(function () {
            webRTCSuccess = true;
        });

        // Wait 1 second
        setTimeout(function () {
            if (webRTCSuccess) return;

            // WebRTC request was not accepted; show message
            var cover = document.createElement("div");
            cover.id = "sm-webrtc-override-check";
            var cover_s = cover.style;
            cover_s.position = "absolute";
            cover_s.width = cover_s.height = "100%";
            cover_s.left = cover_s.top = "0";
            cover_s.backgroundColor = "rgba(0, 0, 0, 0.5)";
            cover_s.display = "flex";
            cover_s.alignItems = cover_s.justifyContent = "center";
            document.body.appendChild(cover);

            var box = document.createElement("div");
            var box_s = box.style;
            box_s.maxWidth = "500px";
            box_s.padding = "25px";
            box_s.backgroundColor = "white";
            box_s.color = "black";
            box_s.borderRadius = "5px";
            cover.appendChild(box);

            box.innerHTML = "To use WebRTC in SeaMonkey, install <a href='https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle#readme'>WebRTC Permissions UI Toggle</a>, toggle it on, and reload this page; or try another browser, such as Firefox or Chrome.";

            var ignore_p = document.createElement("p");
            ignore_p.align = "center";
            ignore_p.style.marginBottom = "0";
            box.appendChild(ignore_p);

            var ignore = document.createElement("button");
            ignore.innerHTML = "Ignore";
            ignore.style.minWidth = "100px";
            ignore_p.appendChild(ignore);

            function close(mediaStream) {
                webRTCSuccess = true;
				if (mediaStream) {
					// We don't need this stream, so close it.
					mediaStream.getAudioTracks().forEach(function (t) {
						t.stop();
					});
                }
                document.body.removeChild(cover);
            }

            ignore.addEventListener("click", function () {
                close();
            });

            // Retry WebRTC every time the mouse cursor leaves and re-enters the window
            document.body.addEventListener("mouseenter", function () {
                if (webRTCSuccess) return;
                setTimeout(function () {
                    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(close);
                }, 0);
            });
        }, 1000);
    });
}