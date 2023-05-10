import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoblawsStores } from '@/lib/loblaws';
import LoblawsStoreInfo from '@/components/loblaws_store_info';
import { Store } from '@/types/loblaws';
import { getNoFrillsStores } from '@/lib/nofrills';

type SelectStoreProps = { stores: Store[] };

export default function SelectStore({ stores }: SelectStoreProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const chain = router.query.chain || '';

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
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="w-full flex-wrap">
        {stores.filter((store) => ((store.name.toLowerCase().includes(query)
                                  || store.address.formattedAddress.toLowerCase().includes(query))
                                  && (chain === '' || store.storeBannerId === chain)))
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
    props: { stores: stores.filter((store) => store.visible) },
    revalidate: 60 * 60,
  };
};
