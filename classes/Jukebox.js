const Song = require("../classes/Song");

module.exports = class Jukebox {
  constructor() {
    this.queue = [];
    this.playOrder = [];
    this.isBusy = false;
    this.volume = .25;
    this.loop = "none";
    this.shuffle = false;
    this.busy = false;
    this.connection = null;
  }

  enqueue(content) {
    if (content instanceof Array) {
      this.queue.push(...content);
    } else if (content instanceof Song) {
      this.queue.push(content);
    }
  }

  updateQueue() {
    // Remove song from queue
    const song = this.queue.shift();
    // Shuffle queue if enabled
    if (this.shuffle) {
      for (let i = queue.length - 1; i > 0; i--) {
        randInd = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[randInd]] = [queue[randInd], queue[i]];
      }
    }
    // Add song back if looping is on
    if (this.loop === "all") {
      this.queue.push(song);
    } else if (this.loop === "current") {
      this.queue.unshift(song);
    }
  }

  checkConnection(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    return this.connection?.channel?.id == voiceChannel.id;
  }

  async setConnection(interaction) {
    if (this.connection) {
      await this.connection.dispatcher?.end();
    }
    this.connection = await interaction.member.voice.channel.join();
  }

  async play(interaction) {
    if (this.isBusy) {
      return;
    }
    this.isBusy = true;

    if (!this.checkConnection(interaction)) {
      await this.setConnection(interaction);
    }

    const song = this.queue[0];

    try {
      await this.connection.play(song.getResource());
    } catch(e) {
      return this.handleError(interaction, e);
    }

    this.connection.dispatcher.on("start", () => {
      this.connection.dispatcher.setVolume(this.volume);
      interaction.reply(song.getVideoEmbed());
    });

    this.connection.dispatcher.on("finish", () => {
      this.updateQueue();
      if (this.queue.length >= 1) {
        return this.play(interaction);
      } else {
        this.connection.channel.leave();
        this.connection = null;
        return 
      }
    });

    this.connection.dispatcher.on("error", (e) => {
      this.handleError(interaction, e);
    });

    this.isBusy = false;
  }

  async handleError(interaction, e) {
    interaction.reply(
      "Something has gone wrong. I cannot play the next song. I am ashamed."
    );
    this.queue = [];
    this.isBusy = false;
    if (this.connection) {
      await this.connection.dispatcher?.end();
    }
    this.connection = null;
    console.error(e);
  }

  checkSongIsPlaying(interaction) {
    if (!this.connection || this.isBusy) { return }
    if (!interaction.member.voice.channel) {
      interaction.reply('I can only do that if you\'re in a voice channel. Join a channel and try again');
      return false;
    }
    if (!this.connection.dispatcher) {
      interaction.reply('Um... sorry, looks like there is no song playing right now.');
      return false;
    }
    return true;
  }

  pause(interaction) {
    if (this.checkSongIsPlaying(interaction)) {
      this.connection.dispatcher.pause();
      interaction.reply('Song paused :pause_button:');
    }
  }

  resume(interaction) {
    if (this.checkSongIsPlaying(interaction)) {
      this.connection.dispatcher.resume();    
      interaction.reply('Song resumed :play_pause:');
    }
  }

  clear(interaction) {
    if (this.checkSongIsPlaying(interaction)) {
      this.queue = [];
      this.connection.dispatcher.end();
      return interaction.reply('Queue cleared');
    }
  }

  skip(interaction) {
    if (this.connection.dispatcher.busy) {
      return;
    }
    if (!this.connection?.dispatcher) {
      interaction.reply('Um... sorry, looks like there is no song playing right now.');
      return;
    }
    this.connection.dispatcher.end();
  }

  remove(interaction, index = 0) {
    if (!this.queue.length) {
      interaction.reply('There are no songs in queue!');
      return;
    }
    if (this.queue[index]) {
      this.queue.splice(index, 0);
      interaction.reply('Song removed!');
    } else {
      interaction.reply(`No song at position ${index}!`);
    }
  }
}
