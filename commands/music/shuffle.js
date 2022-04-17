const { SlashCommandBuilder } = require("@discordjs/builders");
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "shuffle-music",
    slashCommand: new SlashCommandBuilder()
        .setName("shuffle-music")
        .setDescription("Shuffles songs in the current music queue."),
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
        if (jukebox.queue.length == 0) {
            return interaction.editReply("There are no songs in queue!");
        }
        jukebox.shuffle();
        return interaction.editReply(`Queue shuffled`);
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
        if (jukebox.queue.length == 0) {
            return message.reply("There are no songs in queue!");
        }
        jukebox.shuffle();
        return message.reply(`Queue shuffled`);
    }
};
