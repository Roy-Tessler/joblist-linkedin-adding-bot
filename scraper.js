const puppeteer = require("puppeteer");
const { LI } = require("./secret");
const { YClogin } = require("./utils");
async function scrapeAndAdd(url) {
  const linkedIn = {
    login: LI.login,
    user: LI.user,
    password: LI.password
  };
  try {
    /*Login to YC job listings */
    let companyArray = await YClogin();

    /* go to Linkedin and login using my credentials */
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(linkedIn.login);
    await page.focus("#username");
    await page.keyboard.type(linkedIn.user);
    await page.focus("#password");
    await page.keyboard.type(linkedIn.password);
    await page.click(".btn__primary--large");
    await page.waitForNavigation();

    /* Search by company, and use companies from results array */
    for (let i = 0; i < companyArray.length; i++) {
      let company = companyArray[i];
      try {
        await page.goto(
          "https://www.linkedin.com/search/results/companies/?origin=DISCOVER_FROM_SEARCH_HOME"
        );
        await page.focus("#ember42 > input");
        await page.keyboard.type(company);
        await page.keyboard.type(String.fromCharCode(13));
        await page.waitForNavigation();
        await page.screenshot({ path: `${company}toCheck.png` });
        await page.click(".search-result__title");
        await page.waitForNavigation();
        await page.screenshot({ path: `${company}.png` });
        /* Go to PEOPLE tab in current company */
        await page.click(
          'a[data-control-name="page_member_main_nav_people_tab"]'
        );
        await page.waitForSelector("div.org-people-profile-card__profile-info");
        await page.focus(".org-people__input-keywords");
        await page.keyboard.type("software engineer");
        await page.keyboard.type(String.fromCharCode(13));
        await page.waitForSelector(
          'button[data-control-name="people_profile_card_connect_button"]'
        );
        await page.screenshot({ path: `${company} engineers.png` });

        /* Send connect invitation to engineers */

        await page.click(
          'button[data-control-name="people_profile_card_connect_button"]'
        );
        await page.waitForSelector('button[aria-label="Send invitation"]');
        await page.click('button[aria-label="Send invitation"]');
        await page.screenshot({ path: `${company} connectingmsg.png` });
      } catch (error) {
        console.error(error);
      }
    }
    /* Send connect invitation to engineers */

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}
scrapeAndAdd(
  "https://www.workatastartup.com/directory?companySize=any&expo=any&industry=any&matchingJobs=matching&remote=any&role=any&sortBy=name"
);
