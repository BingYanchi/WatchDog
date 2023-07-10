package report.yumc.watchdog.config;

import report.yumc.watchdog.WatchDog;

public class ConfigManager {
    public static void loadConfig() {
        WatchDog.instance.saveDefaultConfig();
        WatchDog.instance.reloadConfig();
        WatchDog.instance.Lang.saveDefaultConfig();
        WatchDog.instance.Lang.reloadConfig();
    }
}
