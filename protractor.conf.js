const SELENIUM_FOLDER = './node_modules/protractor/node_modules/webdriver-manager/selenium';
const fs = require('fs');
let res, seleniumVersion;
fs.readdirSync(SELENIUM_FOLDER).forEach(file => {
    res = file.match(/selenium-server-standalone-(\d{1}.\d{1}.\d{1}).jar/i);
    if (res) {
        seleniumVersion = res[1];
    }
})
if (!seleniumVersion) {
    throw new Error('No selenium server jar found inside your protractor node_modules subfolder');
}

exports.config = {
    directConnect: false,
    allScriptsTimeout: 11000,
    getPageTimeout: 10000,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://localhost:3000',
    seleniumServerJar: `./node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-${seleniumVersion}.jar`,
    specs: [
        './test/e2e/**/*.spec.js'
    ],
    onPrepare: function() {
        browser.waitForAngularEnabled(true);
    }
};