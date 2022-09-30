import bot from "./bot";
import ping from "./command/commands/ping";

bot({
    commands: [
        ping
    ]
});