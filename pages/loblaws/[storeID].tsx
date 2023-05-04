import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getLoblawsDeals } from '@/lib/loblaws';
import { Badge, Price } from '@/types/loblaws';

type LoblawsStoreProps = {
  deals: {
    ingredient: string,
    ingredientID: number,
    itemsOnSale: {
      code: string,
      name: string,
      deal: Badge,
      price: Price
    }[]
  }[]
};

function LoblawsStore({ deals }: LoblawsStoreProps) {
  // const router = useRouter();
  // const { storeID } = router.query;

  return (
    <>
      <Head>
        <title>Deals at Loblaws</title>
      </Head>
      <p>The following are on sale:</p>
      <ul className="divide-y divide-gray-100 w-1/2">
        {deals.map((deal) => (
          <Disclosure
            as="li"
            key={deal.ingredientID}
          >
            <Disclosure.Button className="hover:bg-gray-100 text-left w-full flex items-center justify-between py-2">
              <div>
                <p className="font-bold">{deal.ingredient}</p>
                <p className="text-sm">
                  {deal.itemsOnSale.length}
                  {' '}
                  item
                  {deal.itemsOnSale.length !== 1 && 's'}
                  {' '}
                  on sale
                </p>
              </div>
              <div>
                <ChevronDownIcon className="h-6 w-6" />
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="mb-2">
              <ul className="list-disc ml-5">
                {deal.itemsOnSale.map((item) => (
                  <li className="mb-2" key={item.code}>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm">
                      Normal Price:
                      {' '}
                      $
                      {item.price.value}
                    </p>
                    <p className="text-sm">
                      Deal:
                      {' '}
                      {item.deal.text}
                      {item.deal.name === 'SALE'
                       && ` (now $${(item.price.value
                                     - parseFloat(item.deal.text!.substring(item.deal.text!.indexOf('$') + 1))).toFixed(2)})`}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                className="bg-gray-100 p-1 rounded hover:bg-gray-200 mt-2 inline-block"
                href={`/ingredients/${deal.ingredient}`}
              >
                Find Recipes
              </Link>
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </ul>
    </>
  );
}

export const getStaticProps: GetStaticProps<LoblawsStoreProps> = async (context) => {
  // Get all data from Loblaws deals
  const loblawsDeals = await getLoblawsDeals(context.params!.storeID as string);

  // Filter non-deals and get codes
  const itemCodes = loblawsDeals.results
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
      const loblawsInfo = loblawsDeals.results.find((result) => result.code === loblawsItem.code)!;
      return {
        code: loblawsItem.code,
        name: `${loblawsInfo.brand}, ${loblawsInfo.name}`,
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
          code, name, deal, price,
        }) => ({
          code, name, deal, price,
        }));
      return {
        ingredient: ingredient.ingredient.name,
        ingredientID: ingredient.ingredient.id,
        itemsOnSale: cleanedDealsData,
      };
    });

  return {
    props: {
      deals: itemsByIngredient,
    },
    revalidate: 60 * 60 * 24 * 7,
  };
};

// TODO: add back this code if I ever start paying for the API.
// export const getStaticPaths: GetStaticPaths = async () => {
//   const stores = await getLoblawsStores();
//   const paths = stores
//     .filter((store) => store.visible)
//     .map((store) => ({ params: { storeID: store.id } }));

//   return {
//     paths,
//     fallback: 'blocking',
//   };
// };

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export default LoblawsStore;
