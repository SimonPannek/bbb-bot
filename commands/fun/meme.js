let tries = 0;

const memes = [
    "What does packet loss in wireless networks look like?\nhttps://youtu.be/h16HA4XjyD8?t=165",
    "https://i.redd.it/io45wpcapjj61.png",
    "https://i.redd.it/904ez7itt0u51.png",
    "https://i.redd.it/0vsup2e75hh61.jpg",
    "pain https://i.redd.it/7kheyjw0pz361.jpg",
    "https://i.redd.it/rekqbbcfnsg51.jpg"
];

module.exports = {
    name: "meme",
    description: "Give a link to a mystery meme.",
    async execute() {
        tries++;

        if (tries % memes.length === 0) {
            return "You know what, I'm tired of this.\nFind your own memes:\nhttps://old.reddit.com/r/networkingmemes/";
        } else {
            // Return random meme
            return memes[Math.floor(Math.random() * memes.length)];
        }
    }
};
