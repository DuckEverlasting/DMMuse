require('dotenv').config();

const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const parseCommand = require ('./actions/parseCommand.js');
const genRoom = require ('./actions/generateRoom.js');
const rollDice = require("./actions/rollDice.js");
const { setUserVar, setGlobalVar, getVar } = require("./actions/useSavedVariables.js");

const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

const client = new Discord.Client();
client.login(token);

client.once('ready', () => {
  console.log('Ready!');
});
client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});

const actions = {
  "roll": rollDice,
  "save": setUserVar,
  "load": getVar
}

client.on('message', async message => {
  if (message.author.bot) return;

  let parsedCommand;
  if (message.channel.type === "dm") {
    parsedCommand = parseCommand(message.content, message.author);
  } else if (message.content.startsWith(prefix)) {
    parsedCommand = parseCommand(message.content.slice(prefix.length), message.author);
  } else {
    return;
  }

  if (!parsedCommand.error) {
    try {
      message.channel.send(await actions[parsedCommand.action](parsedCommand));
    } catch(error) {
      console.error(error);
    }
  } else {
    console.log(parsedCommand.error);
  }

  if (message.content === `${prefix}get a room`) {
    const room = genRoom();
    message.channel.send(`${room.name}: ${room.desc}`)
  }

})

