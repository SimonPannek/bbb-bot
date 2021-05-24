const chrome = require("selenium-webdriver/chrome");
const {Builder, By, Key, until} = require("selenium-webdriver");

const {name, timeout, messageTimeout} = require("../config.json");
const commandHandler = require("./commandHandler");

module.exports = async room => {
    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless()).build();

    try {
        // Connect to room
        await driver.get(room);

        // Find name input
        const input = await driver.findElement(By.xpath("//input[@required = 'required']"));
        if (!input) {
            console.error("Unable to find the name input field.");
            return;
        }

        // Input name
        input.sendKeys(name, Key.RETURN);

        // Find audio close modal
        const modal = await driver
            .wait(until.elementLocated(By.xpath("//button[@aria-label = 'Close Join audio modal']")), timeout);
        if (!modal) {
            console.error("Unable to find the close audio modal prompt.");
            return;
        }

        // Close audio modal
        modal.click();

        // Find response input
        const responseInput = await driver.findElement(By.xpath("//textarea[@id = 'message-input']"));
        if (!responseInput) {
            console.error("Unable to find the response input field.");
            return;
        }

        console.log(`Connected to room ${room}.`);

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

                // Save first part of the message
                lastMessage = content.split("\n")[0];

                if (split[0] === name) {
                    // Ignore own messages
                    continue;
                }

                // Give the information to the command handler
                const response = await commandHandler(room, split[0], content);

                if (!response) {
                    // No response to send
                    continue;
                }

                // Send response
                await responseInput.sendKeys(response, Key.RETURN);
            } catch (ignored) {
                // Catch timeout error, because no new message was found
            }
        }
    } catch (ignored) {
        // Invalid room or connection was closed
        console.error("Connection to room was closed.")
    }
};

function getMessageSelector(lastMessage = "") {
    return `(//div[@id = 'chat-messages']//div[contains(@class, 'item--')]`
        + `//div//div[starts-with(@class, 'content--')]//div[starts-with(@class, 'messages--')])[last()]`
        + `//p[last()][not(contains(text(),'${lastMessage}'))]/parent::div/parent::div`;
}
