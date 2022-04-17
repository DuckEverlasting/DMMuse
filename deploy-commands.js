require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getGuilds } = require("./data/controllers/guildsController");
const commands = require('./commands');

const slashCommands = Object.values(commands).map(command => {
    return command.slashCommand.toJSON()
});

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

function registerCommands(guild) {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), { body: slashCommands })
        .then(() => console.log('Successfully registered application commands for guild ' + guild.name))
        .catch(console.error);
}

getGuilds()
    .then(guilds => guilds.forEach(g => registerCommands(g)))
    .catch(console.error);
