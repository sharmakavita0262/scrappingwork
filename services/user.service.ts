import { Service } from 'typedi';
import { getBrowserInstance } from '../config/core';
import { URL_BASE } from '../constant';
import axios from 'axios';

@Service()
export class UserBotService {
  public async getProfile() {
    try {
      const { page, browser } = await getBrowserInstance();
      await page.goto(URL_BASE, {
        waitUntil: ['load', 'domcontentloaded'],
      });

      await page.waitForSelector('a[data-name="Profile"]', {
        timeout: 10000,
      });
      await page.click('a[data-name="Profile"]');

      const res = await page.waitForRequest(res => {
        console.log(res.url());
        return res.url().includes('https://onlyfans.com/api2/v2/users/u');
      });
      const resStory = await page.waitForRequest(res => {
        return res.url().includes('https://onlyfans.com/api2/v2/stories');
      });
      const resDataStory = resStory?.headers();
      const resData = res?.headers();
      const KEYS_COOKIE = ['csrf', 'lang', 'cookiesAccepted', 'fp', 'auth_id', 'sess', 'st'];
      const cookies = await page.cookies();
      let cookie = '';
      KEYS_COOKIE.forEach((key, index) => {
        if (key === 'cookiesAccepted') {
          cookie += 'cookiesAccepted=all;';
          return;
        }
        const find = cookies.find(cookie => cookie?.name === key);
        cookie += `${key}=${find ? find?.value : ''}${index === KEYS_COOKIE.length - 1 ? '' : '; '}`;
      });
      const headers = {
        ...resData,
        Cookie: cookie,
      };
      const headersStory = {
        ...resDataStory,
        Cookie: cookie,
      };
      console.log(headers);
      // make request to get profile axios
      const result = await axios.get('https://onlyfans.com/api2/v2/users/u244743122', {
        headers: {
          ...headers,
          time: new Date().getTime(),
        },
      });
      console.log(result.data);
      const story = await axios.get('https://onlyfans.com/api2/v2/stories', {
        headers: {
          ...headersStory,
          time: new Date().getTime(),
        },
      });
      console.log(story.data);

      // find different bewteen headers & headersStory
      const keys = Object.keys(headers);
      const keysStory = Object.keys(headersStory);
      const diff = keys.filter(key => !keysStory.includes(key));
      console.log(diff, 'diff key');
      keys.forEach(key => {
        if (headers[key] !== headersStory[key]) {
          console.log(key, headers[key], 'compare');
        }
      });

      console.log(headers);
      await browser.close();
      return resData;
    } catch (error) {
      throw error;
    }
  }
}
