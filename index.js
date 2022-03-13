require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');

const getDiceRequest = require('./argumentTypes/diceRequest');
const getMusicRequest = require('./argumentTypes/musicRequest');
const Jukebox = require('./classes/Jukebox');

Structures.extend('Guild', Guild => {
  class MusicGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.jukebox = new Jukebox();
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

// const genRoom = require ('./commands/gameplay/generateRoom.js');
// const rollDice = require("./commands/gameplay/rollDice.js");
// const { setUserVar, setGlobalVar, getVar } = require("./actions/useSavedVariables.js");

// const actions = {
//   "roll": rollDice,
//   "save": setUserVar,
//   "load": getVar,
//   "get_a_room": genRoom,
//   "play": null,
//   "pause": null,
//   "stop": null,
//   "skip": null,
// }

// client.on('message', async message => {
//   if (message.author.bot) return;

//   let parsedCommand;
//   if (message.channel.type === "dm" || message.content.startsWith(prefix)) {
//     parsedCommand = parseCommand(message);
//   } else {
//     return;
//   }

//   if (!parsedCommand.error) {
//     try {
//       message.channel.send(await actions[parsedCommand.action](parsedCommand));
//     } catch(error) {
//       console.error(error);
//     }
//   } else {
//     console.log(parsedCommand.error);
//     message.channel.send("Were you talking to me? Sorry, I don't know that command.");
//   }
// });
