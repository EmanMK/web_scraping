const puppeteer = require('puppeteer')

async function scrapeProduct(url){
    const browser=await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(url);

    const[maintImage]= await page.$x('//*[@id="UpperContent"]/div/div[2]/section[1]/div/div[1]/img')
    const src = await maintImage.getProperty('src');
    const image = await src.jsonValue();

    const[car]= await page.$x('//*[@id="UpperContent"]/div/div[2]/section[3]/div/div[1]/div[2]/div/a')
    const src2 = await car.getProperty('src');
    const cars = await src2.jsonValue;

    let result = await page.$$eval('.list_content', names => names.map(name => name.textContent));
    
    

    await page.waitForSelector('#UpperContent > div > div.servicesDirectoryUnit_wrapper > section.unitHead > div > div.item.title > h1');
    const title = await page.evaluate(() => document.querySelector('#UpperContent > div > div.servicesDirectoryUnit_wrapper > section.unitHead > div > div.item.title > h1').textContent);
    

    console.log({image,title,cars,result})

    await browser.close()

}

scrapeProduct('https://eg.hatla2ee.com/ar/maintenances-center/el-adawy-el-mahalla-el-kubra/396')