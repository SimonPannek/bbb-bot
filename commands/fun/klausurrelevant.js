let tries = 0;

module.exports = {
    name: "klausurrelevant",
    description: "Answer the age old question whether a topic is \"klausurrelevant\".",
    async execute() {
        tries++;
        return "Yes." + (tries % 3 === 0 ? " And to be honest, this is a really stupid question." : "");
    }
};
