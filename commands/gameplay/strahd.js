const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "strahd",
    slashCommand: new SlashCommandBuilder()
        .setName("strahd")
        .setDescription("Call upon a bad dude."),
    run: function(interaction) {
        interaction.channel.send("BLEH!");
    }
}
