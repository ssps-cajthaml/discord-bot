import bot from "./bot";
import ping from "./command/commands/ping";
import purge from "./command/commands/purge";
import { voice } from "./module/modules/voice";

bot({
    commands: [
        ping,
        purge
    ],
    modules: [
        voice
    ]
});