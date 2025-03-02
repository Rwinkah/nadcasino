"use client";

import React, { useCallback, useRef, useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import NadcasinoIcon from "~~/public/assets/icons/Nadcasino";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Games",
    href: "/games",
  },
  {
    label: "Break⚡Monad",
    href: "/breakmonad",
  },

  // {
  //   label: "Debug Contracts",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href || pathname.includes(href);
        const isGames = pathname === "games";
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`relative group ${
                isActive ? "gradient-active shadow-md" : ""
              }  hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral 
    py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col 
    ${label === "Games" ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}`}
            >
              {icon}
              <span className="font-medium">{label}</span>

              {/* Tooltip - Only visible when label is "games" */}
              {label === "Games" && (
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Coming Soon
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = ({ props }: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`fixed  top-0  navbar ar ${isHomePage ? "bg-transparent" : "bg-[#070322]"}  min-h-0 flex-shrink-0 justify-between z-[9999]  px-0 sm:px-2`}
    >
      <div className=" w-auto lg:w-full">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact w-[90vw] dropdown-content mt-3 p-2 shadow bg-[#070322] rounded-box"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative min-w-10 items-center justify-center gap-2 font-semibold h-10">
            {/* <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" /> */}
            <NadcasinoIcon className="cursor-pointer" width={24} height={24} />
            <p>Nadcasino</p>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal w-full px-1 gap-2  items-center justify-center">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="justify-end flex-grow flex-shrink-0  w-auto">
        <RainbowKitCustomConnectButton />
        {/* <FaucetButton /> */}
      </div>
    </div>
  );
};
