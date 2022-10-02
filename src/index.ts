import bot from "./bot";
import ping from "./command/commands/ping";
import purge from "./command/commands/purge";
import say from "./command/commands/say";
import vote from "./command/commands/vote";
import { voice } from "./module/modules/voice";

bot({
    commands: [
        ping,
        purge,
        say,
        vote
    ],
    modules: [
        voice
    ]
});