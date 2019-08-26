require('dotenv').config();
const puppeteer = require('puppeteer');

const b = require('./utils/class-browser-wrapper.js')(puppeteer);
const { wpLogin } = require('./utils/helpers.js');

jest.setTimeout(100000);

const rootUrl = process.env.ROOT_URL;

/**
 * Closes the browser after all the test completed
 */
afterAll(async () => {
    await b.close();
});

test("testing is set up correctly", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await page.goto(rootUrl);
    await page.close();
});

test("login is set up correctly", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await wpLogin(page);
    const url = page.url();
    expect(url).toMatch('/wp-admin/');
    await page.close();
});

test("toolbar is added", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await wpLogin(page);
    await page.goto(rootUrl);
    const toolbar = await page.$('#wp-admin-bar-critical-admin-toolbar');
    expect(toolbar).not.toBeNull();
    await page.close();
});

test("clicking generate critical css shows a modal with the generated css", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await wpLogin(page);
    await page.goto(rootUrl);
    await page.click('#wp-admin-bar-critical-admin-toolbar');
    const cssContent = await page.waitForSelector('.critical-css-details p');
    expect(cssContent).not.toBeNull();
    await page.close();
});

test("clicking close or cancel closes the modal", async () => {
    const browser = await b.getHead();
    const page = await browser.newPage();
    await wpLogin(page);
    await page.goto(rootUrl);
    await page.click('#wp-admin-bar-critical-admin-toolbar');
    const closeBtn = await page.waitForSelector('.critical-close-button');
    await closeBtn.click();
    expect(await page.$('.critical-modal')).toBeNull();
    await page.close();
});