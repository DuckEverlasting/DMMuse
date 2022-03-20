const { SlashCommandBuilder } = require('@discordjs/builders');
const { insertTip } = require("../../data/controllers/tipsController");
const addUserIfNew = require('../../util/addUserIfNew');

module.exports = {
    name: "add-tip",
    slashCommand: new SlashCommandBuilder()
        .setName("add-tip")
        .setDescription("Set preferred server for this user.")
        .addStringOption(option => {
            return option
                .setName("tip")
                .setDescription("The tip to be added")
                .setRequired(true)
        }),
    run: async function(interaction) {
        const tip = interaction.options.getString('tip');
        await addUserIfNew(interaction.user);
        await insertTip(tip, interaction.user.id);
        interaction.channel.send("Added!");
    }
}
