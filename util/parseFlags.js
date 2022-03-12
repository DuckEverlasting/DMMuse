module.exports = function(flagsString) {
  const flags = new Set();
  let nextFlag;
  const parseExp = /\s*\$\w+/gi;
  do {
    nextFlag = parseExp.exec(flagsString);
    if (nextFlag) {
      flags.add(nextFlag[0].slice(1).toLowerCase().trim());
    }
  } while (nextFlag);
  return flags;
}
