import type { NextPage } from "next";
import { AboutMe } from "./components/AboutMe";
import { Hero } from "./components/Hero";

import { Layout } from "./components/Layout";
import { LogoCloud } from "./components/LogoCloud";

const Home: NextPage = () => {
  return (
    <Layout>
      <Hero />
      <LogoCloud />
      <AboutMe />
    </Layout>
  );
};

export default Home;
