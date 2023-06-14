import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { Disclosure } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import classNames from 'classnames';
import { getLoblawsProps, getLoblawsStores } from '@/lib/loblaws';
import { Badge, Price } from '@/types/loblaws';

type LoblawsStoreProps = {
  deals: {
    ingredient: string,
    ingredientID: number,
    itemsOnSale: {
      link: string,
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
      <ul className="divide-y divide-gray-100 w-full md:w-3/4 lg:w-1/2">
        {deals.map((deal) => (
          <Disclosure
            as="li"
            key={deal.ingredientID}
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="hover:bg-gray-100 text-left w-full flex items-center justify-between p-2">
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
                    <ChevronRightIcon className={classNames('h-6 w-6', open ? 'rotate-90 transform' : '')} />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="mb-2">
                  <ul className="list-disc ml-5">
                    {deal.itemsOnSale.map((item) => (
                      <li className="mb-2" key={item.link}>
                        <Link href={item.link} rel="noopener noreferrer" target="_blank" className="font-semibold hover:underline">
                          {item.name}
                        </Link>
                        <p className="text-sm">
                          Normal Price:
                          {' '}
                          $
                          {item.price.value.toFixed(2)}
                        </p>
                        <p className="text-sm">
                          Deal:
                          {' '}
                          {item.deal.text}
                          {item.deal.name === 'SALE'
                       && ` (now $${(item.price.value
                                     - parseFloat(item.deal.text!.substring(item.deal.text!.indexOf('$') + 1))).toFixed(2)})`}
                        </p>
                        <p className="text-sm">
                          Expires:
                          {' '}
                          {item.deal.expiryDate?.slice(0, 10)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="bg-gray-300 p-2 rounded hover:bg-gray-400 mt-2 inline-block mr-2"
                    href={`/ingredients/${deal.ingredient}`}
                  >
                    Find Recipes
                  </Link>
                  <Link
                    className="bg-green-300 p-2 rounded hover:bg-green-500 mt-2 inline-block"
                    href={`/generate_recipe?ingredient=${deal.ingredient}`}
                  >
                    Generate Recipe
                  </Link>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </ul>
    </>
  );
}

export const getStaticProps: GetStaticProps<LoblawsStoreProps> = async (context) => {
  const deals = await getLoblawsProps(context.params!.storeID as string);

  return {
    props: {
      deals,
    },
    revalidate: 60 * 60 * 2, // Every 2 hours
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const stores = await getLoblawsStores();
  const paths = stores
    .filter((store) => store.visible)
    .map((store) => ({ params: { storeID: store.id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default LoblawsStore;
