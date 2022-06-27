import { FC, ReactNode } from "react";
import Head from "next/head";

import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const defaultPageTitle = "Elías García";

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>
          {title ? `${defaultPageTitle} | ${title}` : defaultPageTitle}
        </title>
      </Head>
      <div className="min-h-screen">
        <div className="relative">
          <Header />
          <main className="lg:relative">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};
