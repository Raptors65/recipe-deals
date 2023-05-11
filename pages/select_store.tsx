import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoblawsStores } from '@/lib/loblaws';
import LoblawsStoreInfo from '@/components/loblaws_store_info';
import { FilteredStoreInfo } from '@/types/loblaws';
import { getNoFrillsStores } from '@/lib/nofrills';

type SelectStoreProps = {
  stores: FilteredStoreInfo[]
};

export default function SelectStore({ stores }: SelectStoreProps) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!hasSearched && typeof router.query.chain === 'string' && router.query.chain !== query) {
    setQuery(router.query.chain);
  }

  return (
    <>
      <Head>
        <title>Select Loblaws - Recipe Deals</title>
      </Head>
      <input
        className="border-2"
        placeholder="Search store..."
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (!hasSearched) setHasSearched(true);
        }}
      />
      <div className="w-full flex-wrap">
        {stores.filter((store) => ((((store.storeBannerId === 'loblaw' && 'Loblaws - ') + store.name).toLowerCase().includes(query.toLowerCase())
                                  || store.address.toLowerCase().includes(query.toLowerCase()))))
          .slice(0, 10).map((store) => (
            <LoblawsStoreInfo key={store.id} store={store} />
          ))}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<SelectStoreProps> = async () => {
  let stores = await getLoblawsStores();
  stores = [...stores, ...await getNoFrillsStores()];
  return {
    props: {
      stores: stores.filter((store) => store.visible)
        .map(
          ({
            id, address, name, openNowResponseData, storeBannerId, geoPoint,
          }) => ({
            id,
            address: address.formattedAddress,
            name,
            openNowResponseData,
            storeBannerId,
            geoPoint,
          }),
        ),
    },
    revalidate: 60 * 60,
  };
};
