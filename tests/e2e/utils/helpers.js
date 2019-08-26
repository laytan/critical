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

module.exports = {
    wpLogin,
}