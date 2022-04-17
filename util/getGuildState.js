const { getUser } = require("../data/controllers/usersController");

module.exports = function(discordObj, guildStates) {
    let guildId = discordObj.guildId ||
        getUser(discordObj.user?.id || discordObj.author?.id)?.preferredGuild;
    if (!guildId) {
        throw new Error("Interaction/message not connected to any guild and user has no preferred guild set");
    } 
    if (!guildStates[guildId]) {
        guildStates[guildId] = {}
    }
    return guildStates[guildId];
};