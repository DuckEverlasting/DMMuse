require('dotenv').config();
const { Client, Intents } = require('discord.js');
const commands = require('./commands');

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
] });
const guildStates = {}

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
        await commands[interaction.commandName]?.run?.(interaction, guildStates);
    }
});

client.on('messageCreate', async message => {
    if (message.content.startsWith(process.env.PREFIX)) {
        const command = message.content.split(' ')[0].slice(process.env.PREFIX.length);
        const params = message.content.split(' ').slice(1);
        await commands[command]?.runLegacy?.(message, guildStates, params);
    }
})

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
