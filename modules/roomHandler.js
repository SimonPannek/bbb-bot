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

        // Loop and listen for new messages
        while (true) {
            try {
                const messageContainer = await driver
                    .wait(until.elementLocated(By.xpath(getMessageSelector(lastMessage))), messageTimeout);

                const message = await messageContainer.getText();
                const split = message.split("\n");
                const content = split.slice(-1).pop();

                await commandHandler(room, split[0], content);

                lastMessage = content.split("\n")[0];
            } catch (ignored) {
                // Probably a timeout error
                console.log(ignored);
            }

            // TODO: Check if room was closed
        }
    } catch (error) {
        console.log("An error occurred: ", error);
    } finally {
        await driver.quit();
    }
};

function getMessageSelector(lastMessage = "") {
    return `(//div[@id = 'chat-messages']//div[contains(@class, 'item--')]`
        + `//div//div[starts-with(@class, 'content--')]//div[starts-with(@class, 'messages--')])[last()]`
        + `//p[last()][not(contains(text(),'${lastMessage}'))]/parent::div/parent::div`;
}
