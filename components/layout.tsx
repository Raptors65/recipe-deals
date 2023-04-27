import React, { PropsWithChildren } from 'react';
import Navbar from './navbar';

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-5">{children}</main>
    </>
  );
}

export default Layout;
