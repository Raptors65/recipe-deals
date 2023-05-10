import { LoblawsResponse, Store } from '@/types/loblaws';
import prisma from './prisma';

export async function getLoblawsDeals(storeID: string) {
  const today = new Date();
  const headers = { 'Content-Type': 'application/json', 'x-apikey': process.env.LOBLAWS_API_KEY! };
  const data = {
    pagination: { from: 0, size: 48 },
    banner: 'loblaw',
    cartId: '365028aa-53c2-469f-84a2-8ecf5e25c7e8',
    lang: 'en',
    date: `${today.getDate().toString().padStart(2, '0')}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getFullYear()}`,
    storeId: storeID,
    pcId: null,
    pickupType: 'STORE',
    offerType: 'ALL',
    filter: { categories: ['27998'] }, // Meats
  };

  const loblawsResponse = await fetch('https://api.pcexpress.ca/product-facade/v3/products/deals', {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...data, pagination: { from: 0, size: 48 } }),
    cache: 'no-cache',
    referrer: 'https://www.loblaws.ca/',
  });
  const loblawsJSON: LoblawsResponse = await loblawsResponse.json();
  const { results } = loblawsJSON;

  const promises = [];

  for (let page = 1; page * 48 <= loblawsJSON.pagination.totalResults; page += 1) {
    const nextResponse = fetch('https://api.pcexpress.ca/product-facade/v3/products/deals', {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...data, pagination: { from: page, size: 48 } }),
      cache: 'no-cache',
      referrer: 'https://www.loblaws.ca/',
    });
    promises.push(nextResponse);
  }

  const responses = await Promise.all(promises);
  const jsonPromises = responses.map((response) => response.json());
  const jsons = await Promise.all(jsonPromises);
  const newResults = jsons.map((json: LoblawsResponse) => json.results);
  results.push(...newResults.flat());

  return results;
}

export async function getLoblawsStores(): Promise<Store[]> {
  const storesResponse = await fetch('https://www.loblaws.ca/api/pickup-locations?bannerIds=loblaw', {
    method: 'GET',
    cache: 'no-cache',
    referrer: 'https://www.loblaws.ca/store-locator?type=store&icta=pickup-details-modal',
  });
  const storesJSON = await storesResponse.json();

  return storesJSON;
}

export async function getLoblawsProps(storeID: string) {
  // Get all data from Loblaws deals
  const loblawsDeals = await getLoblawsDeals(storeID);

  // Filter non-deals and get codes
  const itemCodes = loblawsDeals
    .filter((result) => result.badges.dealBadge !== null)
    .map((result) => result.code);

  const matchingDatabaseItems = await prisma.loblawsItem.findMany({
    where: { code: { in: itemCodes } },
    include: { ingredient: true },
  });

  // Remove duplicate ingredients
  const ingredients = matchingDatabaseItems.map((item) => item.ingredient.name);
  const uniqueIngredients = matchingDatabaseItems
    .filter((x, i) => ingredients.indexOf(x.ingredient.name) === i);
  // Filter unnecessary data
  const dealsData = matchingDatabaseItems
    .map((loblawsItem) => {
      const loblawsInfo = loblawsDeals.find((result) => result.code === loblawsItem.code)!;
      return {
        code: loblawsItem.code,
        link: (loblawsInfo.sellerName === 'loblaw' ? 'https://loblaws.ca/p/' : 'https://nofrills.ca/p/') + loblawsItem.code,
        name: loblawsInfo.brand !== null ? `${loblawsInfo.brand}, ${loblawsInfo.name}` : loblawsInfo.name,
        ingredient: loblawsItem.ingredient.name,
        ingredientID: loblawsItem.ingredient.id,
        deal: loblawsInfo.badges.dealBadge!,
        price: loblawsInfo.prices.wasPrice || loblawsInfo.prices.price,
      };
    });

  const itemsByIngredient = uniqueIngredients
    .map((ingredient) => {
      // Find items that are this ingredient
      const ingredientItems = dealsData
        .filter((deal) => deal.ingredientID === ingredient.ingredient.id);
      const cleanedDealsData = ingredientItems
        .map(({
          link, name, deal, price,
        }) => ({
          link, name, deal, price,
        }));
      return {
        ingredient: ingredient.ingredient.name,
        ingredientID: ingredient.ingredient.id,
        itemsOnSale: cleanedDealsData,
      };
    });

  return itemsByIngredient;
}
