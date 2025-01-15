import puppeteer from 'puppeteer-extra';
import { Page, executablePath } from 'puppeteer';
import path from 'path';
import { getProxyUser } from './proxy';
import pluginProxy from 'puppeteer-extra-plugin-proxy';

const login = async (page: Page) => {
  // await new Promise((r) => setTimeout(r, 15000));
  const url = 'https://onlyfans.com/';
  await page.goto(url, {
    waitUntil: ['load', 'domcontentloaded'],
  });
  await page.waitForNavigation();

  await new Promise(r => setTimeout(r, 5000));

  const inputLogin = async (email: string, password: string) => {
    await page.type('input[at-attr="input"][name="email"]', email);
    await page.type('input[at-attr="input"][name="password"]', password);
  };

  const clickLogin = async () => {
    await page.click('button[at-attr="submit"][type="submit"]');
  };

  const checkingForCaptcha = async () => {
    console.log('checking for captcha');
    await new Promise(r => setTimeout(r, 3000));
    const captcha = await page.$('.captcha-solver');

    if (captcha) {
      let valid = false;
      console.log('on lopping');
      while (!valid) {
        await Promise.all([
          new Promise(async resolver => {
            const ready = await page.$('.captcha-solver[data-state="ready"]');
            if (ready) {
              console.log('captcha ready');
              await page.click('.captcha-solver[data-state="ready"]');
            }
            resolver(1);
          }),
          new Promise(async resolver => {
            const error = await page.$('.captcha-solver[data-state="error"]');
            if (error) {
              console.log('captcha error');
              await page.click('.captcha-solver[data-state="error"]');
            }
            resolver(1);
          }),
          new Promise(async resolver => {
            const done = await page.$('.captcha-solver[data-state="solved"]');
            if (done) {
              console.log('captcha done');
              valid = true;
              await new Promise(r => setTimeout(r, 5000));
              await clickLogin();
            }
            resolver(1);
          }),
        ]);
      }
    }
  };

  await inputLogin('kavita@gmail.com', 'Test@123');
  await checkingForCaptcha();
  await clickLogin();
  await new Promise(r => setTimeout(r, 5000));

  // try check 3 times
  await checkingForCaptcha();
  await checkingForCaptcha();
  await checkingForCaptcha();

  // get cookies
  const cookies = await page.cookies();
  console.log(cookies);

  // close
  // await page.close();
};

const main = async () => {
  const proxyUser = await getProxyUser();
  puppeteer.use(
    pluginProxy({
      address: proxyUser.proxy_address,
      port: proxyUser.port,
      credentials: {
        username: proxyUser.username,
        password: proxyUser.password,
      },
    }),
  );

  const pathToExtension = path.join(__dirname, './extensions/2captcha-solver');
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    executablePath: executablePath(),
    userDataDir: './temp',
  });
  const page = await browser.newPage();
  page.goto('https://iproyal.com/ip-lookup');
  // await login(page);
  // browser.close();
};

main();
