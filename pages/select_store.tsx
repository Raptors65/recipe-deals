import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getLoblawsStores } from '@/lib/loblaws';
import LoblawsStoreInfo from '@/components/loblaws_store_info';
import { FilteredStoreInfo } from '@/types/loblaws';
import { getNoFrillsStores } from '@/lib/nofrills';
import getDistance from '@/lib/distance';

type SelectStoreProps = {
  stores: FilteredStoreInfo[]
};

export default function SelectStore({ stores }: SelectStoreProps) {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sort = (a: FilteredStoreInfo, b: FilteredStoreInfo) => {
    if (latitude === null || longitude === null) return 0;
    const distanceA = getDistance(
      a.geoPoint.latitude,
      a.geoPoint.longitude,
      latitude,
      longitude,
    );
    const distanceB = getDistance(
      b.geoPoint.latitude,
      b.geoPoint.longitude,
      latitude,
      longitude,
    );
    return distanceA - distanceB;
  };

  if (!hasSearched && typeof router.query.chain === 'string' && router.query.chain !== query) {
    setQuery(router.query.chain);
  }

  return (
    <>
      <Head>
        <title>Select Loblaws - Recipe Deals</title>
      </Head>
      <input
        className="border-2 p-1"
        placeholder="Search store..."
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          if (!hasSearched) setHasSearched(true);
        }}
      />
      <button
        className="border-2 bg-green-200 hover:bg-green-400 p-1"
        onClick={() => {
          if (!('geolocation' in navigator)) {
            setError('Location not supported by your browser');
            return;
          }
          navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setError(null);
          }, () => setError('Unable to retrieve your location'));
        }}
        type="button"
      >
        Use Current Location
      </button>
      {error !== null && <p className="text-red-600">{error}</p>}

      <div className="w-full flex-wrap">
        {stores.filter((store) => ((((store.storeBannerId === 'loblaw' && 'Loblaws - ') + store.name).toLowerCase().includes(query.toLowerCase())
                                  || store.address.toLowerCase().includes(query.toLowerCase()))))
          .sort(sort).slice(0, 10).map((store) => (
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
