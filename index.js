const Discord = require('discord.js');
const {	prefix,	token } = require('./config.json');
const ytdl = require('ytdl-core');
const parseCommand = require ('./parseCommand.js');
const genRoom = require ('./generateRoom');
const rollDice = require("./rollDice");

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
  "roll": rollDice
}

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const parsedCommand = parseCommand(message.content.slice(prefix.length));
  if (!parsedCommand.error) {
    try {
      message.channel.send(actions[parsedCommand.action](parsedCommand.params));
    } catch {
      console.log("Error");
    }
  } else {
    console.log(parsedCommand.error);
  }

  if (message.content === `${prefix}get a room`) {
    const room = genRoom();
    message.channel.send(`${room.name}: ${room.desc}`)
  }
})