const fs = require('fs');

const commands = {};
fs.readdirSync(__dirname)
    .filter(dir => dir != 'index.js')
    .forEach(dir => {
        fs.readdirSync(__dirname + '\\' + dir).forEach(fileName => {
            const command = require(`./${dir}/${fileName}`);
            commands[command.name] = { ...command, group: dir };
        });
    }
);

module.exports = commands;