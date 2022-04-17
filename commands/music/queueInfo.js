const { SlashCommandBuilder } = require("@discordjs/builders");
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "queue-info",
    slashCommand: new SlashCommandBuilder()
        .setName("queue-info")
        .setDescription("Displays the song queue."),
    run: async function (interaction, state) {
        let jukebox;
        interaction.deferReply();
        try {
            jukebox = getJukebox(interaction, state)
        } catch (e) {
            console.error(e);
            return interaction.editReply(
                'You do not have a preferred server set on which to play music. Please set one with "set-preferred-server", or send this command from a server channel.'
            );
        }

        const { response, embed } = jukebox.getQueueInfo();
        if (response) {
            interaction.editReply(response);
        } else {
            interaction.deleteReply();
        }
        if (embed) {
            interaction.channel.send({ embeds: [ embed ] });
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

        const { response, embed } = jukebox.getQueueInfo();
        if (response) {
            message.reply(response);
        }
        if (embed) {
            message.channel.send({ embeds: [ embed ] });
        }
    }
};
