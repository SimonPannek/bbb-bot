const {rooms} = require("./config.json");
const roomHandler = require("./modules/roomHandler");

(async function main() {
    let handles = [];

    // Add task for each room
    for (let room of rooms) {
        handles.push(roomHandler(room));
    }

    // Join all handles
    for (let handle of handles) {
        await handle;
    }
})();
