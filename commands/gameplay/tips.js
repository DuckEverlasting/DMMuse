const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTips } = require("../../data/controllers/tipsController");
const getGuildState = require("../../util/getGuildState");

module.exports = {
    name: "tips",
    slashCommand: new SlashCommandBuilder()
        .setName("tips")
        .setDescription("Get some good advice."),
    run: function(interaction, state) {
        let guildState, lastTip;
        try {
            guildState = getGuildState(interaction, state);
        } catch(e) {
            // No big deal if there's no state on this one.
            guildState = {}
        }
        lastTip = guildState.lastTip || "";
        const tips = await getTips().whereNot({ text: lastTip });
        const randIndex = Math.floor(Math.random() * tips.length);
        interaction.reply(tips[randIndex].text);
        guildState.lastTip = tips[randIndex].text;
    }
}
