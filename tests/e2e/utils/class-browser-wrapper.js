class BrowserWrapper {
    constructor(puppeteer) {
        this.puppeteer = puppeteer;
        this.browser;
        this.headlessBrowser;
    }

    async getHeadless() {
        if (!this.headlessBrowser) {
            this.headlessBrowser = await this.puppeteer.launch();
        }
        return this.headlessBrowser;
    }

    async getHead() {
        if (!this.browser) {
            this.browser = await this.puppeteer.launch({ headless: false, slowMo: 50 });
        }
        return this.browser;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        if (this.headlessBrowser) {
            await this.headlessBrowser.close();
        }
    }
}

let browserWrap;
function getBrowserWrapper(puppeteer) {
    if (!browserWrap) {
        browserWrap = new BrowserWrapper(puppeteer);
    }
    return browserWrap;
}

module.exports = getBrowserWrapper;