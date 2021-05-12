const {Builder, By, Key, until} = require('selenium-webdriver');

const {name, timeout, messageTimeout} = require("../config.json");
const commandHandler = require("./commandHandler");

//const messagesWrapper = "//div[starts-with(@class, 'chat--')]//div[starts-with(@class, 'messageListWrapper--')]";

module.exports = async room => {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        // Connect to room
        await driver.get(room);

        // Find name input
        const input = await driver.findElement(By.xpath("//input[@required = 'required']"));
        if (!input) {
            return;
        }

        // Input name
        input.sendKeys(name, Key.RETURN);

        // Find audio close modal
        const modal = await driver
            .wait(until.elementLocated(By.xpath("//button[@aria-label = 'Close Join audio modal']")), timeout);
        if (!modal) {
            return;
        }

        // Close audio modal
        modal.click();

        let lastMessage = "*";

        // Loop while chat is still active
        while (await driver.findElement(By.xpath("//div[@id = 'chat-messages']"))) {
            try {
                // Get container surrounding the message
                const messageContainer = await driver
                    .wait(until.elementLocated(By.xpath(getMessageSelector(lastMessage))), messageTimeout);

                // Parse information of the message
                const message = await messageContainer.getText();
                const split = message.split("\n");
                const content = split.slice(-1).pop();

                // Give the information to the command handler
                await commandHandler(room, split[0], content);

                // Save first part of the message
                lastMessage = content.split("\n")[0];
            } catch (ignored) {
                // Probably a timeout error, because no new message was found
                //console.log(ignored);
            }
        }
    } catch (ignored) {
        // Probably an invalid room
        //console.log("An error occurred: ", ignored);
    } finally {
        await driver.quit();
    }
};

function getMessageSelector(lastMessage = "") {
    return `(//div[@id = 'chat-messages']//div[contains(@class, 'item--')]`
        + `//div//div[starts-with(@class, 'content--')]//div[starts-with(@class, 'messages--')])[last()]`
        + `//p[last()][not(contains(text(),'${lastMessage}'))]/parent::div/parent::div`;
}
