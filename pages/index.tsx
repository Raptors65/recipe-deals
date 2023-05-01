import React from 'react';
import Head from 'next/head';
import HeroSection from '@/components/hero-section';

export default function Home() {
  return (
    <>
      <Head>
        <title>Recipe Deals</title>
      </Head>
      <HeroSection />
    </>
  );
}
