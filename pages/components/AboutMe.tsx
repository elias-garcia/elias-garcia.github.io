import { FC } from "react";
import {
  CodeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
} from "@heroicons/react/outline";

const transferFeatures = [
  {
    id: 1,
    name: "Open Source",
    description:
      "A lo largo de mi trayecto como desarrollador he contribuído a todo tipo de proyectos de código abierto, como Angular (de Google) o DefinitelyTyped (de Microsoft).",
    icon: CodeIcon,
  },
  {
    id: 2,
    name: "Comunidad",
    description:
      "Además de echar un cable como co-organizador del grupo CoruñaJS, también he impartido charlas y talleres sobre frontend en alguna ocasión, como en los GPUL Labs.",
    icon: UserGroupIcon,
  },
];

const communicationFeatures = [
  {
    id: 1,
    name: "La revolución DeFi",
    description:
      "Curso realizado en colaboración con Balio, la plataforma española sobre formación financiera por excelencia. Con él, trato de acercar las finanzas descentralizadas a todo el mundo.",
    icon: CurrencyDollarIcon,
    hasBeenLaunched: true,
  },
  {
    id: 2,
    name: "Web3 Camp",
    description:
      "Programa de formación + mentoring orientado a desarrolladores. El objetivo es ayudar a mis alumnnos a conseguir un puesto como desarrollador frontend en las mejores compañías Web3.",
    icon: AcademicCapIcon,
    hasBeenLaunched: false,
  },
];

export const AboutMe: FC = () => {
  return (
    <div className="py-16 overflow-hidden lg:py-24">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <svg
          className="hidden lg:block absolute left-full transform -translate-x-1/2 -translate-y-1/4"
          width={404}
          height={784}
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="b1e6e422-73f8-40a6-b5d9-c8586e37e0e7"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={784}
            fill="url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)"
          />
        </svg>

        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Sobre mí
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Puedes encontrarme por la ciudad de A Coruña, desde donde trabajo de
            forma remota como Frontend Team Lead para el proyecto Polygon
            Hermez.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
              Desarrollador frontend
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              Tras graduarme como ingeniero de software he decidido centrar mi
              carrera en el desarrollo de aplicaciones web basadas en Javascript
              y su ecosistema, especializándome sobre todo en frontend y web3.
            </p>
            <dl className="mt-10 space-y-10">
              {transferFeatures.map((item) => (
                <div key={item.id} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <svg
              className="absolute left-1/2 transform -translate-x-1/2 translate-y-16 lg:hidden"
              width={784}
              height={404}
              fill="none"
              viewBox="0 0 784 404"
            >
              <defs>
                <pattern
                  id="ca9667ae-9f92-4be7-abcb-9e3d727f2941"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={784}
                height={404}
                fill="url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)"
              />
            </svg>
            <img
              className="relative mx-auto rounded-xl"
              width={490}
              src="/images/desktop-with-laptop.png"
              alt=""
            />
          </div>
        </div>

        <svg
          className="hidden lg:block absolute right-full transform translate-x-1/2 translate-y-12"
          width={404}
          height={784}
          fill="none"
          viewBox="0 0 404 784"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={784}
            fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
          />
        </svg>

        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                Profesor y mentor
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Creo que compartir mis experiencias profesionales puede ayudar a
                mucha gente, por lo que dedico gran parte de mi tiempo libre a
                preparar cursos y formaciones de la máxima calidad posible.
              </p>
              <dl className="mt-10 space-y-10">
                {communicationFeatures.map((item) => (
                  <div key={item.id} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-16 flex">
                        <p className="text-lg leading-6 font-medium text-gray-900">
                          {item.name}
                        </p>
                        {item.hasBeenLaunched === false && (
                          <span className="ml-3 rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                            Proximamente
                          </span>
                        )}
                      </div>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
              <svg
                className="absolute left-1/2 transform -translate-x-1/2 translate-y-16 lg:hidden"
                width={784}
                height={404}
                fill="none"
                viewBox="0 0 784 404"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="e80155a9-dfde-425a-b5ea-1f6fadd20131"
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x={0}
                      y={0}
                      width={4}
                      height={4}
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={784}
                  height={404}
                  fill="url(#e80155a9-dfde-425a-b5ea-1f6fadd20131)"
                />
              </svg>
              <img
                className="relative mx-auto rounded-xl"
                width={490}
                src="/images/me-balio.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
