require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');

const getDiceRequest = require('./argumentTypes/diceRequest');
const getMusicRequest = require('./argumentTypes/musicRequest');

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.sessionStart = Date.now();
      this.lastTip = '';
      this.musicData = {
        queue: [],
        playOrder: [],
        isPlaying: false,
        volume: .25,
        songDispatcher: null,
        loop: "none",
        busy: false
      };
    }
  }
  return MusicGuild;
});

const client = new CommandoClient({
	commandPrefix: process.env.PREFIX || '!dmm',
	owner: '271003111236042753'
});

client.registry
  .registerDefaultTypes()
  .registerTypes([getDiceRequest(client), getMusicRequest(client)])
	.registerGroups([
		['gameplay', 'Gameplay'],
		['music', 'Music'],
        ['admin', 'Admin'],
        ['miscellaneous', 'Miscellaneous'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

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
