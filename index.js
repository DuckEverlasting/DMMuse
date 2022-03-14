require('dotenv').config();

const { Client, Intents } = require('discord.js');
const path = require('path');

const getDiceRequest = require('./argumentTypes/diceRequest');
const getMusicRequest = require('./argumentTypes/musicRequest');
const Jukebox = require('./classes/Jukebox');
const commands = require('./commands');

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.sessionStart = Date.now();
      this.lastTip = '';
      this.jukebox = new Jukebox();
    }
  }
  return MusicGuild;
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const guildStates = {}

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
        await commands[interaction.commandName]?.run?.(interaction, guildStates);
    }
});

client.login(process.env.TOKEN);

client.once('ready', () => {
  console.log('Ready!');
});
client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});
