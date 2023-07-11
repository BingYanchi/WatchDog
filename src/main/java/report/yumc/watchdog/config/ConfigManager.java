package report.yumc.watchdog.config;

import report.yumc.watchdog.WatchDog;

public class ConfigManager {
    public static void reloadConfig() {
        WatchDog.instance.saveDefaultConfig();
        WatchDog.instance.reloadConfig();
    }
}
