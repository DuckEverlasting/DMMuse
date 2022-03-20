const { getUser } = require("../data/controllers/usersController");

module.exports = function(interaction, guildStates) {
    let guildId = interaction.guild?.id ||
        getUser(interaction.user.id)?.preferredGuild;
    if (!guildId) {
        throw new Error("Interaction not connected to any guild and user has no preferred guild set");
    } 
    if (!guildStates[guildId]) {
        guildStates[guildId] = {}
    }
    return guildStates[guildId];
};