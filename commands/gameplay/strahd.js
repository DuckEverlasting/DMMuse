const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "strahd",
    slashCommand: new SlashCommandBuilder()
        .setName("strahd")
        .setDescription("Call upon a bad dude."),
    run: function(interaction) {
        interaction.deleteReply();
        interaction.channel.send("BLEH!");
    },
    runLegacy: function(message) {
        message.channel.send("BLEH!");
    }
}
