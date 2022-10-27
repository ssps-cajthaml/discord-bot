# Discord bot

This repository contains source code of the Discord bot used in an official study and support server for my students. It's writen in TypeScript and is fully customizable. Lots of commands help moderators manage the server.

You can join the Discord server by visiting https://discord.cajthaml.eu/.

## To run the bot for the first time
- clone/download the repository
- install **Node.JS**
- run these commands in the folder you have the project to install all the dependencies, copmile the bot and start it:
    - `npm install`
    - `npm run build`
    - `npm run start`

### Running the bot 
It's reccomended to open two tabs in your terminal and run `npm run build-watch` in one, which will continuously rebuild the TypeScript code to JavaScript to make it able to be executed.
In the second tab run `npm run start` to start the bot and make it connect to Discord. In that terminal window you will also see all the console outputs the bot produces.

## Settings
Create a `.env` file in the same folder as is the `index.ts`. It will be used for secrets of the bot, such as the discord bot token.
```
BOT_TOKEN=your-bot-token
MODULE_AUTOMATIC_VOICE_CHANNEL=id-of-automatic-voice-channel
MODULE_AUTOMATIC_VOICE_CHANNEL_NAMES=names,of,the,channels
```