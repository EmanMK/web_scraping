const puppeteer = require('puppeteer');
import { Browser } from 'puppeteer';
const fs = require('fs');

const url = 'https://eg.hatla2ee.com/ar/maintenances-center/city/cairo/page/5';

const getMaintData = async (data) => {
  console.log('here \n');

  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  var maintenances = [data.length];

  for (let i = 0; i < data.length; i++) {
    await page.goto(data[i].link);

    maintenances[i] = await page.evaluate(() => {
      const brandList = Array.from(document.querySelectorAll('.brands .interInner ul li'));
      console.log('brand List' + brandList);
      var brandss = [0];
      const brands = brandList.map((brand: any) => {
        brandss.push(brand.querySelector('a').getAttribute('alt'));
      });

      const latitude = document.querySelector('.direction a')?.getAttribute('href')?.split('&query=')[1].split(',')[0];
      const longitude = document.querySelector('.direction a')?.getAttribute('href')?.split('&query=')[1].split(',')[1];

      return {
        title: document.querySelector('.unitHead_title .item h1')?.textContent,
        phone: document.querySelector('.nCallActionList ul li a')?.getAttribute('href')?.split(':')[1],
        locationDesc: document.querySelector('.address')?.textContent,
        latitude,
        longitude,
        brands: brandss,
      };
    });
  }
  return maintenances;
};

const main = async () => {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const maintData = await page.evaluate(() => {
    const maintenances = Array.from(document.querySelectorAll('.list_content'));

    const data = maintenances.map((maint: any) => ({
      title: maint.querySelector('a').getAttribute('title'),
      link: 'https://eg.hatla2ee.com' + maint.querySelector('a').getAttribute('href'),
    }));
    return data;
  });

  console.log(maintData);
  const data = await getMaintData(maintData);

  fs.writeFile('maints.json', JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log('data saved!');
  });

  await browser.close();
};

main();
