require('dotenv').config();

module.exports = function(discordObj) {
    if (discordObj.member?.voice?.channel) {
        return discordObj.member.voice.channel;
    }
    let guildId = discordObj.guildId ||
        getUser(discordObj.user?.id || discordObj.author?.id)?.preferredGuild;
    if (!guildId) {
        throw new Error("Interaction/message not connected to any guild and user has no preferred guild set");
    }
    const guild = discordObj.client.guilds.cache.find(g => g.id == guildId);
    const channel = guild.channels.cache.find(c => c.id.toString() == process.env.PREFERRED_VOICE_CHANNEL)
    if (!channel) {
        throw new Error("Couldn't find preferred voice channel.");
    }
    return channel;
};