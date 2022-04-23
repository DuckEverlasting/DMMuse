const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    rollAction,
    getResultString
} = require('../../util/diceUtils');

const sides = 12;

module.exports = {
    name: `d${sides}`,
    slashCommand: new SlashCommandBuilder()
        .setName(`d${sides}`)
        .setDescription(
            `Roll a d${sides}.`
        ),
    run: async function(interaction) {
        const {result} = rollAction(sides, 1);
        interaction.reply(`Rolling ${"`"}1d${sides}${"`"}...`);
        setTimeout(() => {
            interaction.channel.send(`<@${interaction.user.id}>: < **${result}** >`);
        }, 1000);
    }
};
