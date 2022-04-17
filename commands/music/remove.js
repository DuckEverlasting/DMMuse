const { SlashCommandBuilder } = require('@discordjs/builders');
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "remove-track",
    slashCommand: new SlashCommandBuilder()
        .setName("remove-track")
        .setDescription("Remove track at specified index from the song queue.")
        .addIntegerOption(option => {
            return option
                .setName("index")
                .setDescription("The index of the song to be removed")
                .setRequired(true)
        }),
    run: async function(interaction, state) {
        await interaction.deferReply();
        let jukebox;
        try {
            jukebox = getJukebox(interaction, state)
        } catch(e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }

        const response = jukebox.remove(target)
        return interaction.editReply(response);
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

        const response = jukebox.remove(target)
        return message.reply(response);
    }
}
