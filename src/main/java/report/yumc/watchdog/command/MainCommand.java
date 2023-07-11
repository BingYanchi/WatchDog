package report.yumc.watchdog.command;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import report.yumc.watchdog.config.ConfigManager;

public class MainCommand implements CommandExecutor {
    @Override
    public boolean onCommand(CommandSender sender, Command commands, String label, String[] args) {
        // 偷懒直接重载配置文件吧
        ConfigManager.reloadConfig();
        // 语言文件也懒得写了
        sender.sendMessage("Reload config success!");

        return true;
    }
}
