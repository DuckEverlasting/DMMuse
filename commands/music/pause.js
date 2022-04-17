const { SlashCommandBuilder } = require('@discordjs/builders');
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "pause",
    slashCommand: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the current playing song."),
    run: async function(interaction, state) {
        let jukebox;
        await interaction.deferReply();
        try {
            jukebox = getJukebox(interaction, state)
        } catch(e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        const { response } = jukebox.pause(interaction);
        interaction.editReply(response);
    },
    runLegacy: async function(message, state, params) {
        let jukebox;
        try {
            jukebox = getJukebox(message, state)
        } catch(e) {
            console.error(e);
            return message.reply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        const { response } = jukebox.pause(message);
        message.reply(response);
    }
}
