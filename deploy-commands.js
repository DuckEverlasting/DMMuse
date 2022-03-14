require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getGuilds } = require("../../data/controllers/guildsController");
const commands = require('./commands');

const slashCommands = commands.values().map(command => command.slashCommand.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

function registerCommands(guildId, guildName) {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), { body: slashCommands })
        .then(() => console.log('Successfully registered application commands for guild ' + guildName))
        .catch(console.error);
}

getGuilds()
    .then(guilds => guilds.forEach(g => registerCommands(g)))
    .catch(console.error);
