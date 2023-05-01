import React, { PropsWithChildren } from 'react';
import Navbar from './navbar';

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto mt-28 w-full md:w-3/4 lg:w-1/2 ">{children}</main>
    </>
  );
}

export default Layout;
