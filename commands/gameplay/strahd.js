const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "strahd",
    slashCommand: new SlashCommandBuilder()
        .setName("strahd")
        .setDescription("Call upon a bad dude."),
    run: function(interaction) {
        interaction.reply("BLEH!");
    },
    runLegacy: function(message) {
        message.channel.send("BLEH!");
    }
}
