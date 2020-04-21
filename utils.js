const puppeteer = require("puppeteer");
const { YC } = require("./secret");

/* navigate to Ycombinator listings website and login using my credentials */
const companyLookup = [];
async function YClogin() {
  const config = {
    login: YC.login,
    userName: YC.userName,
    password: YC.password
  };

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(config.login);
    await page.focus("#ycid-input");
    await page.keyboard.type(config.userName);
    await page.focus("#password-input");
    await page.keyboard.type(config.password);
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitForNavigation();
    await page.click(".navbar-brand");
    await page.waitForNavigation();
    await page.waitForSelector("div.company-title");
    await page.screenshot({ path: "royt.png" });

    /* get a list of all current listings and add to a results array */
    var arr = await page.$$("div.company-title");

    let res = arr.map(async company => {
      const txt = await company.getProperty("textContent");
      const rawTxt = await txt.jsonValue();
      companyLookup.push(sliceCompany(rawTxt));

      return companyLookup;
    });
    let tyryr = await res;

    return companyLookup;
  } catch (error) {
    console.error(error);
  }
}
function sliceCompany(txt) {
  let arr = txt.split("(");
  return arr[0];
}
module.exports = {
  YClogin
};
