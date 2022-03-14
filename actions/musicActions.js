exports.parseMusicAction = function({params, interaction}) {
  
}

const voiceChannel = interaction.member.voice.channel;
if (!voiceChannel)
  return interaction.channel.send(
    "You need to be in a voice channel to play music!"
  );
const permissions = voiceChannel.permissionsFor(interaction.client.user);
if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
  return interaction.channel.send(
    "I need the permissions to join and speak in your voice channel!"
  );
}