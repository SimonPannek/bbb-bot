const fs = require("fs");

const {prefix} = require("../config.json");
const {commands} = require("./globals");

// Get all subfolders
const commandFolders = fs.readdirSync("./commands")
    .filter(folder => fs.lstatSync(`./commands/${folder}`).isDirectory());

// Add all commands in the subfolders
commandFolders.forEach(folder => {
    // Get all command files
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));

    // Add commands
    commandFiles.forEach(file => {
        const command = require(`../commands/${folder}/${file}`);
        command.category = folder;

        commands.set(command.name, command);
        console.log(`Added command "${command.name}" in category "${command.category}".`);
    });
});

module.exports = async (room, author, message) => {
    // Check prefix
    if (!message.startsWith(prefix)) {
        return;
    }

    // Parse command and arguments
    const args = message.slice(1).trim().split(/ +/);
    const command = commands.get(args.shift().toLowerCase());

    if (!command) {
        return "Command not found.";
    }

    return command.execute(message, args);
};
