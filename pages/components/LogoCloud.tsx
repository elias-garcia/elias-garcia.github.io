import { FC } from "react";

export const LogoCloud: FC = () => {
  return (
    <div className="bg-indigo-50" id="sobre-mi">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <h2 className="max-w-md mx-auto text-3xl font-extrabold text-indigo-900 text-center lg:max-w-xl lg:mx-0 lg:text-left">
            <span className="block">+5 años de experiencia</span>
            <span className="block">como desarrollador frontend</span>
          </h2>
          <div className="flow-root self-center mt-8 lg:mt-0">
            <div className="-mt-4 -ml-8 flex flex-wrap justify-between lg:-ml-4">
              <div className="mt-4 ml-8 flex flex-grow flex-shrink-0 justify-center lg:flex-grow-0 lg:ml-4">
                <img
                  className="h-7"
                  src="/company-logos/polygon.svg"
                  alt="Polygon"
                />
              </div>
              <div className="mt-4 ml-8 flex flex-grow flex-shrink-0 justify-center lg:flex-grow-0 lg:ml-4">
                <img
                  className="h-7"
                  src="/company-logos/nexiona.svg"
                  alt="Nexiona"
                />
              </div>
              <div className="mt-4 ml-8 flex flex-grow flex-shrink-0 justify-center lg:flex-grow-0 lg:ml-4">
                <img
                  className="h-7"
                  src="/company-logos/netex-learning.svg"
                  alt="Netex Learning"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
