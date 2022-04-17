const { SlashCommandBuilder } = require("@discordjs/builders");
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "volume",
    slashCommand: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Change the volume of the music player.")
        .addIntegerOption((option) => {
            return option
                .setName("level")
                .setDescription("Number to set the volume to")
                .setRequired(true);
        }),
    run: async function (interaction, state) {
        let jukebox;
        await interaction.deferReply();
        try {
            jukebox = getJukebox(interaction, state)
        } catch (e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        let level = interaction.options.getInteger("level");
        level = Math.max(0, Math.min(level, 100));
        level /= 50;
        const { response } = jukebox.setVolume(level);
        if (response) {
            interaction.editReply(response);
        } else {
            interaction.deleteReply();
        }
    },
    runLegacy: async function(message, state, params) {
        let jukebox;
        try {
            jukebox = getJukebox(message, state)
        } catch (e) {
            console.error(e);
            return message.reply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }
        let level = params[0];
        level = Math.max(0, Math.min(level, 100));
        level /= 50;
        const { response } = jukebox.setVolume(level);
        if (response) {
            message.reply(response);
        }
    }
};
