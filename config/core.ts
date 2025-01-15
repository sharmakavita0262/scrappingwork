import puppeteer from 'puppeteer-extra';
import { executablePath } from 'puppeteer';
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pluginProxy from 'puppeteer-extra-plugin-proxy';

puppeteer.use(StealthPlugin());

export const getBrowserInstance = async (
  proxy: {
    username: string;
    hostname: string;
    port: number;
    password: string;
  },
  userDataDir?: string,
) => {
  // puppeteer.use(
  //   pluginProxy({
  //     address: proxy.hostname,
  //     port: proxy.port,
  //     credentials: {
  //       username: proxy.username,
  //       password: proxy.password,
  //     },
  //   }),
  // );
  const pathToExtension = path.join(__dirname, '../extensions/2captcha-solver');
  let config: any = {
    headless: false,
    args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    executablePath: executablePath(),
  };
  if (userDataDir) {
    config = {
      ...config,
      userDataDir,
    };
  }
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  return { page, browser };
};
