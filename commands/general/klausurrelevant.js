const limit = 3;
var tries = 0;

module.exports = {
    name: "klausurrelevant",
    description: "Answer the age old question whether a topic is klausurrelevant",
    async execute() {
        tries += 1; // if this overflows the sutdents have already won.
        
        return "Yes."+ (tries >= limit?" And to be honest, this is a really stupid question.":"");
    }
};
