const {prefix} = require("../../config.json");
const {commands} = require("../../modules/globals");

module.exports = {
    name: "help",
    description: "Print some information about all commands.",
    usage: "[?command]",
    async execute(message, args) {
        const reply = [];

        if (args.length) {
            // Get command
            const command = commands.get(args[0].toLowerCase());

            // Check if command exists
            if (!command) {
                return "Command not found.";
            }

            // Print help
            reply.push(`**Name:** ${capitalize(command.name)}`);
            reply.push("-----");
            if (command.description)
                reply.push(`**Description:** ${command.description}`);
            if (command.usage)
                reply.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        } else {
            // Sort commands by category
            const sortedCommands = Array.from(commands.values()).sort((c1, c2) => c1.category > c2.category ? 1 : -1);

            reply.push("**Commands:**");

            let currentCategory = "";
            for (let command of sortedCommands) {
                // Add category to message, if it is new
                if (command.category && currentCategory !== command.category) {
                    currentCategory = command.category;
                    reply.push(`${capitalize(command.category)}:`);
                }

                // Add current command to message
                let current = `- ${capitalize(command.name)}`;
                if (command.description) current += `: ${command.description}`;
                reply.push(current);
            }
        }

        return reply.join("\n");
    }
};

function capitalize(string = "") {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
