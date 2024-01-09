const puppeteer = require('puppeteer');

const searchFeature = async(page) => {
   // Setup puppeteer browser and page
   await page.goto('https://kaup24.ee/et/');

   // Setup viewport
   await page.setViewport({width: 1080, height: 1024});

   // Get Search box
   const searchBox = '#searchInput';
   await page.waitForSelector(searchBox);
   // Insert 'Toolid' into the searchBox
   await page.type(searchBox, 'Toolid');
   // Click the search button
   const searchButton = '.c-icon--search'
   await page.click(searchButton);
}

const accessProductPage = async(page) => {
   // Goto website
   await page.goto('https://kaup24.ee/et/search?q=Toolid');

   await page.setViewport({width: 1080, height: 1024});

   // Get first search result
   const productLink = '.product-image-container';
   const product = await page.waitForSelector(productLink);
   await product.click();

   // Test Adding object to cart
   const addToCartButton = '.c-btn--primary.h-btn-intent--atc';
   const addToCart = await page.waitForSelector(addToCartButton);
   await addToCart.click();

   // Pause for 2 sec
   await new Promise(resolve => setTimeout(resolve, 2000));

   // Click the buy button to get to cart
   const cartButton = '#buy';
   const cart = await page.waitForSelector(cartButton);
   await cart.click();
}

const findProductUsingMenus = async (page) => {
    // Goto website
    await page.goto('https://kaup24.ee/et/');
    await page.setViewport({ width: 1080, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get department id
    const departmentId = '#department-274';
    await page.waitForSelector(departmentId);
    await page.click(departmentId);

    // Get TV products
    const products = await page.$$('.category-list-item-wrap.all-categories-visible');
    const tvProducts = products[1];

    if (tvProducts) {
        await page.evaluate(element => {
            element.scrollIntoView();
        }, tvProducts);
        await tvProducts.click();
    } else {
        console.error('TV Products not found');
        return;  
    }

    // Get TVs
    const tvProductsSelection = await page.$$('.category-list-item-wrap.all-categories-visible');
    const tvSection = tvProductsSelection[3];

    if (tvSection) {
        await page.evaluate(element => {
            element.scrollIntoView();
        }, tvSection);
        await tvSection.click();
    } else {
        console.error('TV Section not found');
        return;  
    }

    // Get product
    const selectedTv = await page.waitForSelector('.product-image-container');

    if (selectedTv) {
        await page.evaluate(element => {
            element.scrollIntoView();
        }, selectedTv);
        await selectedTv.click();
    } else {
        console.error('Selected TV not found');
        return;  
    }
};

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await searchFeature(page);
    await accessProductPage(page);
    await findProductUsingMenus(page);
})();