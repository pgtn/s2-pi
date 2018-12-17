(function (ext) {
    var socket = null;

    var connected = false;
    var myStatus = 1; // initially yellow
    var myMsg = 'not_ready';

    ext.cnct = function (callback) {
        window.socket = new WebSocket("ws://127.0.0.1:9000");
        window.socket.onopen = function () {
            var msg = JSON.stringify({
                "command": "ready"
            });
            window.socket.send(msg);
            myStatus = 2;

            // change status light from yellow to green
            myMsg = 'ready';
            connected = true;

            // give the connection time establish
            window.setTimeout(function() {
            callback();
        }, 1000);

        };

        window.socket.onmessage = function (message) {
            console.log(message.data);
        };
        window.socket.onclose = function (e) {
            console.log("Connection closed.");
            socket = null;
            connected = false;
            myStatus = 1;
            myMsg = 'not_ready'
        };
    };

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        var msg = JSON.stringify({
            "command": "shutdown"
        });
        window.socket.send(msg);
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function (status, msg) {
        return {status: myStatus, msg: myMsg};
    };

    ext.send_iothub = function(t, p, h) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        t = parseInt(t);
        p = parseInt(p);
        h = parseInt(h);

        var msg = JSON.stringify({
            "command": 'send_sensehat',
            't': t,
            'p': p,
            'h': h
        });
        console.log(msg);
        window.socket.send(msg);
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ["w", 'Connect to s2_pi server.', 'cnct'],
            [" ", 'Send SenseHat Temperature: %n, Pressure: %n, Humidity: %n', 'send_iothub', "0", "0", "0"]
        ],
        url: 'http://MrYsLab.github.io/s2-pi'
    };

    // Register the extension
    ScratchExtensions.register('s2_pi', descriptor, ext);
})({});
