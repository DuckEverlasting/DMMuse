const { ArgumentType } = require("discord.js-commando");
const { getVar } = require("../util/useSavedVariables");
const parseFlags = require("../util/parseFlags");

class MusicRequest extends ArgumentType {
  constructor(client) {
    super(client, "musicrequest");
  }

  parse(val, msg, arg) {
    const initParse = (/^(?<input>[^\$]*)(?<flagsString>(\s*\$\w+)*)/i).exec(val);
    let { input, flagsString } = initParse.groups;
    const flags = parseFlags(flagsString);

    if (input.startsWith("<") && input.endsWith(">")) {
      input = getVar(input.slice(1, val.length - 1), msg.author.id);
    }
    return {input, flags};
  }

  validate(val, msg, arg) {
    return (val && val.length);
  }
}

module.exports = client => new MusicRequest(client);
