const { SlashCommandBuilder } = require('@discordjs/builders');
const getGuildState = require("../../util/getGuildState");
const Jukebox = require("../../classes/Jukebox");

module.exports = {
    name: "reset-player",
    slashCommand: new SlashCommandBuilder()
        .setName("reset-player")
        .setDescription("Reset the bot's song player."),
    run: async function(interaction, state) {
        await interaction.deferReply();
        try {
            const guildState = getGuildState(interaction, state);
            if (guildState.jukebox) {
                guildState.jukebox.clear();
            }
            guildState.jukebox = new Jukebox();
        } catch(e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        interaction.editReply("Player reset!");
    },
    runLegacy: async function(message, state, params) {
        try {
            const guildState = getGuildState(message, state);
            guildState.jukebox = new Jukebox();
        } catch(e) {
            console.error(e);
            return message.reply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        message.reply("Player reset!");
    }
}
