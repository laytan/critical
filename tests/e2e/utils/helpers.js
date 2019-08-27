const adminUsername = process.env.WORDPRESS_USERNAME;
const adminPassword = process.env.WORDPRESS_PASSWORD;
const rootUrl = process.env.ROOT_URL;

/**
 * Logs into Wordpress as admin
 * 
 * @param {object} page puppeteer page object
 */
async function wpLogin(page) {
    await page.goto(rootUrl + 'wp-login.php');
    // Select all text
    await page.click('#user_login', { clickCount: 3 });
    await page.type('#user_login', adminUsername);
    await page.click('#user_pass', { clickCount: 3 });
    await page.type('#user_pass', adminPassword);
    await page.click('#wp-submit');
    await page.waitForNavigation({ 'waitUntil': 'domcontentloaded' });
}

/**
 * Adds an element with id critical-is-test to the page
 * 
 * @since 1.0.0
 * @param {object} page puppeteer page object
 */
async function addTestMark(page) {
    await page.evaluate(() => {
        const mark = document.createElement('div');
        mark.id = 'critical-is-test';
        mark.style.visibility = 'none';
        document.body.appendChild(mark);
    });
    await page.waitForSelector('#critical-is-test');
}

module.exports = {
    wpLogin,
    addTestMark,
}