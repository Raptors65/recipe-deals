import '@/styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Layout from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Layout>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
