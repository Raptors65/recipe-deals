import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="bg-white">
      <div className="relative isolate h-full px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Finding recipes from grocery deals
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Save money by selecting recipes based on what&apos;s on sale. Currently supports
              Loblaws stores across Canada.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/select_store"
                className="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link href="/features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more
                {' '}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
