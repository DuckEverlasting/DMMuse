const { SlashCommandBuilder } = require('@discordjs/builders');
const { setPreferredServer } = require("../../data/controllers/usersController");
const addUserIfNew = require('../../util/addUserIfNew');

module.exports = {
    name: 'set-preferred-server',
    slashCommand: new SlashCommandBuilder()
        .setName("set-preferred-server")
        .setDescription("Set preferred server for this user.")
        .addStringOption(option => {
            return option
                .setName('server-name')
                .setDescription('Name of preferred server')
                .setRequired(true)
        }),
    run: async function(interaction) {
        const serverName = interaction.options.getString('server-name');
        await addUserIfNew(interaction.author);
        const guild = interaction.client.guilds.cache.find(g => g.name == serverName);
        if (guild) {
            await setPreferredServer(interaction.author.id, guild.id);
            interaction.reply("Preferred server set!");
        } else {
            interaction.reply("Sorry, I'm not a member of any server with that name.");
        }
    }
}
