const getGuildState = require("./getGuildState");
const Jukebox = require("../classes/Jukebox");

module.exports = function(discordObj, state) {
    const guildState = getGuildState(discordObj, state);
    if (!guildState.jukebox) {
        guildState.jukebox = new Jukebox();
    }
    return guildState.jukebox;
};
