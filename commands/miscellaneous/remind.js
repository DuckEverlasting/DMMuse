const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'remind',
    slashCommand: new SlashCommandBuilder()
        .setName("remind")
        .setDescription("Set up a reminder (or a series of them)"),
    run: async function(interaction) {
        interaction.reply("Not yet implemented!");
    }
}