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

  checkConnection(message) {
    const voiceChannel = message.member.voice.channel;
    return this.connection?.channel?.id == voiceChannel.id;
  }

  async setConnection(message) {
    if (this.connection) {
      await this.connection.dispatcher?.end();
    }
    this.connection = await message.member.voice.channel.join();
  }

  async play(message) {
    if (this.isBusy) {
      return;
    }
    this.isBusy = true;

    if (!this.checkConnection(message)) {
      await this.setConnection(message);
    }

    const song = this.queue[0];

    try {
      await this.connection.play(song.getResource());
    } catch(e) {
      return this.handleError(message, e);
    }

    this.connection.dispatcher.on("start", () => {
      this.connection.dispatcher.setVolume(this.volume);
      message.say(song.getVideoEmbed());
    });

    this.connection.dispatcher.on("finish", () => {
      this.updateQueue();
      if (this.queue.length >= 1) {
        return this.play(message);
      } else {
        this.connection.channel.leave();
        this.connection = null;
        return 
      }
    });

    this.connection.dispatcher.on("error", (e) => {
      this.handleError(message, e);
    });

    this.isBusy = false;
  }

  async handleError(message, e) {
    message.say(
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

  checkSongIsPlaying(message) {
    if (!this.connection || this.isBusy) { return }
    if (!message.member.voice.channel) {
      message.reply('I can only do that if you\'re in a voice channel. Join a channel and try again');
      return false;
    }
    if (!this.connection.dispatcher) {
      message.say('Um... sorry, looks like there is no song playing right now.');
      return false;
    }
    return true;
  }

  pause(message) {
    if (this.checkSongIsPlaying(message)) {
      this.connection.dispatcher.pause();
      message.say('Song paused :pause_button:');
    }
  }

  resume(message) {
    if (this.checkSongIsPlaying(message)) {
      this.connection.dispatcher.resume();    
      message.say('Song resumed :play_pause:');
    }
  }

  clear(message) {
    if (this.checkSongIsPlaying(message)) {
      this.queue = [];
      this.connection.dispatcher.end();
      return message.say('Queue cleared');
    }
  }

  skip(message) {
    if (this.connection.dispatcher.busy) {
      return;
    }
    if (!this.connection?.dispatcher) {
      message.say('Um... sorry, looks like there is no song playing right now.');
      return;
    }
    this.connection.dispatcher.end();
  }

  remove(message, index = 0) {
    if (!this.queue.length) {
      message.say('There are no songs in queue!');
      return;
    }
    if (this.queue[index]) {
      this.queue.splice(index, 0);
      message.say('Song removed!');
    } else {
      message.say(`No song at position ${index}!`);
    }
  }
}
