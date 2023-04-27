import { LoblawsResponse, Store } from '@/types/loblaws';

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
    body: JSON.stringify(data),
    cache: 'no-cache',
    referrer: 'https://www.loblaws.ca/',
  });
  const loblawsJSON: LoblawsResponse = await loblawsResponse.json();

  return loblawsJSON;
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
