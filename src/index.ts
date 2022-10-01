import bot from "./bot";
import ping from "./command/commands/ping";
import purge from "./command/commands/purge";
import say from "./command/commands/say";

bot({
    commands: [
        ping,
        purge,
        say
    ]
});