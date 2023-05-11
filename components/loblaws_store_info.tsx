import Link from 'next/link';
import React from 'react';
import { FilteredStoreInfo } from '@/types/loblaws';

type LoblawsStoreInfoProps = {
  store: FilteredStoreInfo
};

export default function LoblawsStoreInfo({ store }: LoblawsStoreInfoProps) {
  return (
    <div className="flex w-full justify-between gap-x-5 border-2 p-5">
      <div>
        <h1>
          {store.storeBannerId === 'loblaw' && 'Loblaws - '}
          {' '}
          {store.name}
        </h1>
        <p>{store.address}</p>
        <p>{store.openNowResponseData.hours}</p>
      </div>
      <div>
        <Link href={`/loblaws/${store.id}`}>
          <button className="bg-red-600 text-white p-2 rounded" type="button">
            Select
            <br />
            Location
          </button>
        </Link>
      </div>
    </div>
  );
}
