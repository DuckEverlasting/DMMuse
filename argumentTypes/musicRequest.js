const { ArgumentType } = require("discord.js-commando");
const { getVar } = require("../util/useSavedVariables");
const parseFlags = require("../util/parseFlags");

class MusicRequest extends ArgumentType {
  constructor(client) {
    super(client, "musicrequest");
  }

  parse(val, msg, arg) {
    const initParse = (/^(?<html>[^\$]*)(?<flagsString>(\s*\$\w+)*)/i).exec(val);
    let { html, flagsString } = initParse.groups;
    const flags = parseFlags(flagsString);

    if (html.startsWith("<") && html.endsWith(">")) {
      html = getVar(html.slice(1, val.length - 1), msg.author.id);
    }
    return {html, flags};
  }

  validate(val, msg, arg) {
    return (val && val.length);
  }
}

module.exports = client => new MusicRequest(client);
