const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    parse,
    rollAction,
    getResultString
} = require('../../util/diceUtils');

module.exports = {
    name: "roll",
    slashCommand: new SlashCommandBuilder()
        .setName("roll")
        .setDescription(
            'Roll some dice. Examples: "roll 1d20+1","roll 4d6k3","roll 3d23+7kl1+20-1d3+2d2-12"'
        )
        .addStringOption((option) => {
            return option
                .setName("request")
                .setDescription("The die request.")
                .setRequired(true);
        }),
    run: function(interaction) {
        const request = parse(interaction.options.getString("request"));
        const results = request.array.map((match) => {
            if (match.groups.constant) {
                return rollAction(0, 0, new Number(match.groups.constant));
            } else {
                return rollAction(
                    new Number(match.groups.sides),
                    new Number(match.groups.rolls),
                    match.groups.addend ? new Number(match.groups.addend) : undefined,
                    match.groups.keep ? new Number(match.groups.keep.match(/\d+/) || 1) : undefined,
                    match.groups.keep ? match.groups.keep.includes("l") : undefined
                );
            }
        });
        return interaction.reply(getResultString(results, request));
    }
};
