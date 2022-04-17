const { SlashCommandBuilder } = require("@discordjs/builders");
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "fade",
    slashCommand: new SlashCommandBuilder()
        .setName("fade")
        .setDescription("Change the volume of the music player gradually.")
        .addIntegerOption((option) => {
            return option
                .setName("level")
                .setDescription("Number to set the volume to")
                .setRequired(true);
        })
        .addNumberOption((option) => {
            return option
                .setName("length")
                .setDescription("Number of seconds for the fade to take (between .25 and 20)")
                .setRequired(false);
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
        let level = interaction.options.getInteger('level');
        let length = interaction.options.getNumber('length');
        level = Math.max(0, Math.min(level, 100));
        level /= 50;
        const { response } = jukebox.fadeVolume(level, length);
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
        let [ level, length ] = params;
        level = Math.max(0, Math.min(level, 100));
        level /= 50;
        const { reply } = jukebox.fadeVolume(level, length);
        if (reply) {
            message.reply(reply);
        } else {
            message.deleteReply();
        }
    }
};
