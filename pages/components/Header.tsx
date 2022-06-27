import { FC, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { routes } from "../routes";

export const Header: FC = () => {
  const router = useRouter();
  const headerRoutes = Object.values(routes).filter(
    (route) => !route.hideFromHeaderNav
  );

  return (
    <Popover as="header" className="relative">
      {({ open }) => (
        <>
          <div className="py-6">
            <nav
              className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
              aria-label="Global"
            >
              <div className="flex items-center flex-1">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <a href="/">
                    <span className="sr-only">Elías García</span>
                    <img
                      className="h-16 w-auto sm:h-16"
                      src="/logo.svg"
                      alt=""
                    />
                  </a>
                  <div className="-mr-2 flex items-center md:hidden">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:items-center md:space-x-6">
                {headerRoutes.map((route) => (
                  <a
                    key={route.name}
                    href={route.href}
                    className={`text-base font-medium ${
                      route.href === router.pathname
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {route.name}
                  </a>
                ))}
                <a
                  href={routes.contact.href}
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {routes.contact.name}
                </a>
              </div>
            </nav>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              static
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top md:hidden"
            >
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <img className="h-8 w-auto" src="/logo.svg" alt="" />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="pt-5 pb-6">
                  <div className="px-2 space-y-1">
                    {headerRoutes.map((route) => (
                      <a
                        key={route.name}
                        href={route.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                      >
                        {route.name}
                      </a>
                    ))}
                  </div>
                  <div className="mt-6 px-5">
                    <a
                      href={routes.contact.href}
                      className="block text-center w-full py-3 px-4 rounded-md shadow bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                    >
                      {routes.contact.name}
                    </a>
                  </div>
                  {/* <div className="mt-6 px-5">
                    <p className="text-center text-base font-medium text-gray-500">
                      <a
                        href="#"
                        className="w-full text-center text-base font-medium text-gray-900 hover:underline"
                      >
                        Login
                      </a>
                    </p>
                  </div> */}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
