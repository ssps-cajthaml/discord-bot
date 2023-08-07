import bot from "./bot";

import * as dotenv from 'dotenv'

import ping from "./command/commands/ping";
import purge from "./command/commands/purge";
import bonk from "./command/commands/bonk";
import say from "./command/commands/say";
import vote from "./command/commands/vote";
import help from "./command/commands/help";
import slap from "./command/commands/slap";
import activity from "./command/commands/activity";
import roleAssignmentCommand from "./command/commands/roleAssignment";
import verify from "./command/commands/verify";

import { voice } from "./module/modules/voice";
import { roleAssignment } from "./module/modules/roleAssignment";
import { welcomeMessage } from "./module/modules/welcomeMessage";

dotenv.config();

bot({
    commands: [
        ping,
        purge,
        bonk,
        say,
        vote,
        help,
        slap,
        activity,
        roleAssignmentCommand,
        verify
    ],
    modules: [
        voice,
        roleAssignment,
        welcomeMessage
    ]
});
