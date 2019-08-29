require('dotenv').config();
const puppeteer = require('puppeteer');

const b = require('./utils/class-browser-wrapper.js')(puppeteer);
const { wpLogin, addTestMark } = require('./utils/helpers.js');

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

test("there is a #critical-is-test element after running addTestMark in a test", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await page.goto(rootUrl);
    await addTestMark(page);
    expect(await page.$('#critical-is-test')).not.toBeNull();
    await page.close();
});

test("having ran addTestMark in a test, the minified css output starts with Test:", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await wpLogin(page);
    await page.goto(rootUrl);
    await addTestMark(page);
    await Promise.all([
        page.click('#wp-admin-bar-critical-admin-toolbar'),
        page.waitForSelector('.critical-css-details p')
    ]);
    const cssContent = await page.evaluate(() => {
        return document.querySelector('.critical-css-details p').textContent;
    });
    expect(cssContent).toMatch(/Test:/);

    await page.close();
});

test("having not ran addTestMark in a test, the test runs across the minify API and does not start with Test:", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await wpLogin(page);
    await page.goto(rootUrl);
    await Promise.all([
        page.click('#wp-admin-bar-critical-admin-toolbar'),
        page.waitForSelector('.critical-css-details p')
    ]);
    const cssContent = await page.evaluate(() => {
        return document.querySelector('.critical-css-details p').textContent;
    });
    expect(cssContent).not.toMatch(/Test:/);

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
    await addTestMark(page);
    const res = await Promise.all([
        page.click('#wp-admin-bar-critical-admin-toolbar'),
        page.waitForSelector('.critical-css-details p'),
    ]);
    expect(res[1]).not.toBeNull();
    await page.close();
});

test("clicking close or cancel closes the modal", async () => {
    const browser = await b.getHeadless();
    const page = await browser.newPage();
    await wpLogin(page);
    await page.goto(rootUrl);
    await addTestMark(page);
    const res = await Promise.all([
        page.click('#wp-admin-bar-critical-admin-toolbar'),
        page.waitForSelector('.critical-close-button'),
    ]);
    await res[1].click();
    expect(await page.$('.critical-modal')).toBeNull();
    await page.close();
});