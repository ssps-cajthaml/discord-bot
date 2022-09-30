import bot from "./bot";
import ping from "./command/commands/ping";
import purge from "./command/commands/purge";

bot({
    commands: [
        ping,
        purge
    ]
});