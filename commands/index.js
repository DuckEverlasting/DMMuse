const fs = require('fs');

const commands = {};
fs.readdirSync('__dirname').forEach(dir => {
    fs.readdirSync('__dirname/' + dir).forEach(fileName => {
        const command = require(`./${fileName}`);
        commands[command.name] = { ...command, group: dir };
    });
});

module.exports = commands;