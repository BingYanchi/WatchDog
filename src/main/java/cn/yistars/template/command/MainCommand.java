package cn.yistars.template.command;

import cn.yistars.template.BingTemplate;
import cn.yistars.template.config.ConfigManager;
import cn.yistars.template.config.LangManager;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.util.StringUtil;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MainCommand implements CommandExecutor, TabCompleter {
    @Override
    public boolean onCommand(CommandSender sender, Command commands, String label, String[] args) {
        if (args.length == 0) {
            sender.sendMessage("BingTemplate v%version% by Bing_Yanchi (TEMPLATE NEED EDIT)".replace("%version%", BingTemplate.instance.getDescription().getVersion()));

            if (sender.hasPermission("BingTemplate.admin")) {
                sender.sendMessage(LangManager.getLang("main-get-help"));
            }

            return true;
        }

        if (!sender.hasPermission("BingTemplate.admin")) {
            return false;
        }

        switch (args[0].toLowerCase()) {
            case "help":
                for (String line : LangManager.getLang("main-command-help").split("\n")) {
                    sender.sendMessage(line);
                }
                return true;
            case "reload":
                ConfigManager.loadConfig();

                sender.sendMessage(LangManager.getLang("success-reload"));

                return true;
            case "debug":
                return true;
            default:
                return false;
        }
    }

    @Override
    public List<String> onTabComplete(CommandSender sender, Command command, String alias, String[] args) {
        final List<String> completions = new ArrayList<>();

        if (!sender.hasPermission("BingTemplate.admin")) {
            return completions;
        }

        switch (args.length) {
            case 1:
                // 定义列表
                String[] Commands = {"reload", "help", "debug"};
                // 通过开头判断
                StringUtil.copyPartialMatches(args[0], Arrays.asList(Commands), completions);
                break;
        }

        // 排序
        Collections.sort(completions);
        // 返回
        return completions;
    }
}
