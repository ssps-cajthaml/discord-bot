import { Client } from "discord.js";

export default interface Module {
    name: string;

    onReady: (client: Client) => boolean | Promise<boolean>;

    handle(event: string, ...args: any[]): void | Promise<void>;
}