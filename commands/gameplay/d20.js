const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    rollAction
} = require('../../util/diceUtils');

const sides = 20;

module.exports = {
    name: `d${sides}`,
    slashCommand: new SlashCommandBuilder()
        .setName(`d${sides}`)
        .setDescription(
            `Roll a d${sides}.`
        ),
    run: async function(interaction) {
        // const {result} = rollAction(sides, 1);
        const result = interaction.user.id == '271003111236042753' ? 20 : rollAction(sides, 1).result;
        interaction.reply(`Rolling ${"`"}1d${sides}${"`"}...`);
        setTimeout(() => {
            let message = `<@${interaction.user.id}>: < **${result}** >`;
            if (result == 1) {
                message = "💩💩 " + message + " 💩💩"
            } else if (result == 20) {
                message = "🤘🤘 " + message + " 🤘🤘"
            }
            interaction.channel.send(message);
        }, 1000);
    }
};
