import { ArrowRightIcon } from "@heroicons/react/outline";
import { FC } from "react";

export const Hero: FC = () => {
  return (
    <div className="mx-auto max-w-7xl w-full place-items-center lg:grid lg:grid-cols-2 lg:gap-8 lg:py-36 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl w-full pt-16 pb-16 text-center lg:text-left">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          <span className="block">Hola 👋🏼</span>{" "}
          <span className="block text-indigo-600">Me llamo Elías</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
          <span className="block">
            Soy ingeniero de software especializado en
          </span>
          <span className="block">
            el desarrollo de aplicaciones frontend Web3
          </span>
        </p>
        <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md shadow">
            <a
              href="#sobre-mi"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              <span>Conóceme</span>
              <span>
                <ArrowRightIcon className="h-5 ml-3" />
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 mb-16 lg:m-0 lg:relative w-5/6">
        <img src="/images/me.png" alt="" />
      </div>
    </div>
  );
};
