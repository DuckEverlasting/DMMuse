const { SlashCommandBuilder } = require("@discordjs/builders");
const getJukebox = require("../../util/getJukebox");

module.exports = {
    name: "loop",
    slashCommand: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Set the music player's loop style.")
        .addStringOption((option) => {
            return option
                .setName("type")
                .setDescription('Options: "toggle", "current", "all", "none"')
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

        const type = interaction.options.getString("type") || "toggle";
        jukebox.setLoop(type);
        return interaction.editReply(`Loop: ${type}`);
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
        const type = params[0];
        jukebox.setLoop(type);
        return message.reply(`Loop: ${type}`);
    }
};
