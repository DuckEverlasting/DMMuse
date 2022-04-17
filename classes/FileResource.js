require("dotenv").config();
const { createAudioResource } = require('@discordjs/voice');
const fs = require("fs");
const Resource = require("./Resource");

module.exports = class FileResource extends Resource {
  constructor(uri) {
    super(uri);
    if (!fs.existsSync(this.getPath())){
      throw new Error("NO FILE AT " + this.getPath());
    };
  }

  getPath() {
    return process.env.MEDIA_PATH + this.uri;
  }

  getResource() {
    return createAudioResource(
        this.getPath(),
        { inlineVolume: true }
    );
  }
}
