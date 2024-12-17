"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import axios from "axios";
import clsx from "clsx";
import NextLink from "next/link";
import React from "react";

import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

/**
 * The `Navbar` component renders a navigation bar with various links and functionalities.
 * It includes a search input, social media links, theme switch, and a sponsor button.
 * The component also handles access control for the "Manager" link, ensuring only users
 * with the appropriate permissions can access the manager view.
 *
 * @component
 * @example
 * // Usage example:
 * <Navbar />
 *
 * @returns {JSX.Element} The rendered navigation bar component.
 *
 * @remarks
 * - The `handleManagerClick` function checks if the user is logged in and has the "Manager" job position.
 * - If the user is not logged in or does not have the required permissions, an alert is shown and navigation is prevented.
 * - The `searchInput` variable defines the search input field with custom styles and keyboard shortcut hint.
 * - The navigation bar includes links to Twitter, Discord, GitHub, and a sponsor button.
 * - The `NavbarMenu` component renders a collapsible menu for smaller screens.
 *
 * @requires axios
 * @requires clsx
 * @requires localStorage
 * @requires React
 * @requires NextLink
 * @requires NextUINavbar
 * @requires NavbarContent
 * @requires NavbarBrand
 * @requires NavbarItem
 * @requires NavbarMenu
 * @requires NavbarMenuItem
 * @requires NavbarMenuToggle
 * @requires Input
 * @requires Kbd
 * @requires SearchIcon
 * @requires TwitterIcon
 * @requires DiscordIcon
 * @requires GithubIcon
 * @requires ThemeSwitch
 * @requires Button
 * @requires HeartFilledIcon
 * @requires siteConfig
 */
export const Navbar = () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const handleManagerClick = async (event: React.MouseEvent) => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      alert("You must be logged in to access this view.");
      event.preventDefault(); // Prevent navigation

      return;
    }

    try {
      const response = await axios.get("/api/employees/check", {
        params: { email },
      });

      const { employee } = response.data;

      if (employee?.jobPosition?.name !== "Manager") {
        alert(
          "Access restricted: You do not have permission to access the manager view.",
        );
        event.preventDefault(); // Prevent navigation
      }
    } catch (error) {
      console.error("Error checking job position:", error);
      alert("An error occurred while verifying your permissions.");
      event.preventDefault(); // Prevent navigation
    }
  };

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              {item.label === "Manager" ? (
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  href={item.href}
                  onClick={handleManagerClick} // Add the handler for the Manager link
                >
                  {item.label}
                </NextLink>
              ) : (
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              )}
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
