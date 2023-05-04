import React, { PropsWithChildren } from 'react';
import Navbar from './navbar';

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-28 px-4">{children}</main>
    </>
  );
}

export default Layout;
