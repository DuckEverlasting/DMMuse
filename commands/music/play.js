const { SlashCommandBuilder } = require('@discordjs/builders');
const getSongsFromInput = require("../../util/getSongsFromInput");
const getJukebox = require("../../util/getJukebox");
const getVoiceChannel = require("../../util/getVoiceChannel");

module.exports = {
    name: "play",
    slashCommand: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play song immediately (erases current queue).")
        .addStringOption(option => {
            return option
                .setName("song")
                .setDescription("The song to be played")
                .setRequired(true)
        }),
    run: async function(interaction, state) {
        await interaction.deferReply();
        try {
            getVoiceChannel(interaction)
        } catch(e) {
            console.error(e);
            return interaction.editReply(
                "I can only play music in voice channels. Join a voice channel and try again."
            );
        }
        let jukebox;
        try {
            jukebox = getJukebox(interaction, state)
        } catch(e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }

        const input = interaction.options.getString('song').trim();
        getSongsFromInput(
            interaction,
            jukebox,
            input,
            (songs) => {
                jukebox.setQueue(songs);
                return jukebox.startPlaying(interaction);
            },
            (errorMsg) => {interaction.editReply(errorMsg)}
        );
    },
    runLegacy: async function(message, state, params) {
        try {
            getVoiceChannel(message)
        } catch(e) {
            console.error(e);
            return message.reply(
                "I can only play music in voice channels. Join a voice channel and try again."
            );
        }
        let jukebox;
        try {
            jukebox = getJukebox(message, state)
        } catch(e) {
            console.error(e);
            return message.reply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }

        const input = params[0];
        getSongsFromInput(
            message,
            jukebox,
            input,
            (songs) => {
                jukebox.setQueue(songs);
                return jukebox.startPlaying(message);
            },
            (errorMsg) => {message.reply(errorMsg)}
        );
    }
}
