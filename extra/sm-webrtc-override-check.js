/* SeaMonkey WebRTC override check.
  Last updated: June 26, 2017
  https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle

  If the user is running SeaMonkey, this script will make repeated WebRTC
  permission requests. If the first request is not immediately accepted, a
  dialog will be shown prompting the user to install and activate the "WebRTC
  Permissions UI Toggle" extension.
*/

if (/SeaMonkey/.test(navigator.userAgent)) {
    var urlbase = "https://cdnjs.cloudflare.com/ajax/libs/basicModal/3.3.8/basicModal.min";
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
            var scriptLoad, styleLoad;

            if (!("basicModal" in window)) {
                var head = document.head || document.getElementsByTagName("head")[0];
                scriptLoad = new Promise(function (resolve, reject) {
                    var s = document.createElement('script');
                    s.src = urlbase + ".js";
                    s.onload = resolve;
                    s.onerror = reject;
                    head.appendChild(s);
                });
                styleLoad = new Promise(function (resolve, reject) {
                    var l = document.createElement('link');
                    l.rel = "stylesheet";
                    l.href = urlbase + ".css";
                    l.onload = resolve;
                    l.onerror = reject;
                    head.appendChild(l);
                });
            }

            Promise.all([scriptLoad, styleLoad]).then(function (resolve, reject) {
                function close(mediaStream) {
                    webRTCSuccess = true;
                    basicModal.close();
					if (mediaStream) {
						// We don't need this stream, so close it.
						mediaStream.getAudioTracks().forEach(function (t) {
							t.stop();
						});
					}
                }

                // Show the dialog
                basicModal.show({
                    body: "To use WebRTC in SeaMonkey, install <a href='https://github.com/IsaacSchemm/webrtc-permissions-ui-toggle#readme'>WebRTC Permissions UI Toggle</a>, toggle it on, and reload this page; or try another browser, such as Firefox or Chrome.",
                    buttons: {
                        action: {
                            title: "Ignore",
                            fn: close
                        }
                    }
                });

                // Retry WebRTC every time the mouse cursor leaves and re-enters the window
                document.body.addEventListener("mouseenter", function () {
                    if (webRTCSuccess) return;
                    setTimeout(function () {
                        navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(close);
                    }, 0);
                });
            });
        }, 1000);
    });
}